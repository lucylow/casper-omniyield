import { useState, useEffect, useCallback } from 'react';
import CasperService from '@/services/casperService';

interface UseCasperOptions {
  network?: 'testnet' | 'mainnet';
  autoConnect?: boolean;
}

interface CasperState {
  isConnected: boolean;
  publicKey: string | null;
  accountHash: string | null;
  balance: string;
  network: 'testnet' | 'mainnet';
  loading: boolean;
  error: string | null;
}

export const useCasper = (options: UseCasperOptions = {}) => {
  const { network = 'testnet', autoConnect = false } = options;
  
  const [state, setState] = useState<CasperState>({
    isConnected: false,
    publicKey: null,
    accountHash: null,
    balance: '0',
    network,
    loading: false,
    error: null,
  });

  const [casperService] = useState(() => new CasperService(network));

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const wallet = await casperService.connectWallet();
      const balance = await casperService.getAccountBalance(wallet.accountHash);
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        publicKey: wallet.publicKey,
        accountHash: wallet.accountHash,
        balance,
        loading: false,
      }));

      localStorage.setItem('casper_connected', 'true');
      localStorage.setItem('casper_publicKey', wallet.publicKey);
      
      return wallet;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  }, [casperService]);

  const disconnect = useCallback(async () => {
    setState({
      isConnected: false,
      publicKey: null,
      accountHash: null,
      balance: '0',
      network,
      loading: false,
      error: null,
    });

    localStorage.removeItem('casper_connected');
    localStorage.removeItem('casper_publicKey');
  }, [network]);

  const refreshBalance = useCallback(async () => {
    if (!state.accountHash) return;
    
    try {
      const balance = await casperService.getAccountBalance(state.accountHash);
      setState(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [state.accountHash, casperService]);

  const switchNetwork = useCallback((newNetwork: 'testnet' | 'mainnet') => {
    setState(prev => ({ ...prev, network: newNetwork }));
  }, []);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('casper_connected') === 'true';
    if (autoConnect && wasConnected) {
      connect();
    }
  }, [autoConnect, connect]);

  // Refresh balance periodically when connected
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [state.isConnected, refreshBalance]);

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    switchNetwork,
    casperService,
    formatCSPR: casperService.formatCSPR.bind(casperService),
    getExplorerUrl: casperService.getExplorerUrl.bind(casperService),
    getAccountUrl: casperService.getAccountUrl.bind(casperService),
  };
};

export default useCasper;

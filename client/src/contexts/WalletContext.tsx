import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

interface Wallet {
  publicKey: string;
  accountHash: string;
  provider?: any;
}

interface WalletContextType {
  wallet: Wallet | null;
  balance: string;
  network: 'testnet' | 'mainnet';
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  updateBalance: () => Promise<void>;
  switchNetwork: (network: 'testnet' | 'mainnet') => void;
  signMessage: (message: string) => Promise<string>;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      const savedPublicKey = localStorage.getItem('walletPublicKey');
      
      if (wasConnected === 'true' && savedPublicKey) {
        // Simulate reconnection
        setWallet({
          publicKey: savedPublicKey,
          accountHash: `account-hash-${savedPublicKey.slice(0, 10)}`,
        });
        setBalance((Math.random() * 10000 * 1e9).toString());
      }
    };

    checkExistingConnection();
  }, []);

  // Update balance periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (wallet) {
      interval = setInterval(() => {
        // Simulate balance updates
        setBalance(prev => {
          const current = parseFloat(prev);
          const change = (Math.random() - 0.5) * 1e8;
          return Math.max(0, current + change).toString();
        });
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [wallet]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPublicKey = '02' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      const connectedWallet: Wallet = {
        publicKey: mockPublicKey,
        accountHash: `account-hash-${mockPublicKey.slice(0, 20)}`,
      };
      
      setWallet(connectedWallet);
      setBalance((Math.random() * 10000 * 1e9 + 5000 * 1e9).toString());
      
      toast.success('Wallet connected successfully!');
      
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletPublicKey', connectedWallet.publicKey);
      
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setWallet(null);
      setBalance('0');
      
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletPublicKey');
      
      toast.success('Wallet disconnected');
    } catch (err) {
      toast.error('Failed to disconnect wallet');
    }
  };

  const updateBalance = async () => {
    if (!wallet?.accountHash) return;
    
    try {
      // Simulate balance fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBalance = (Math.random() * 10000 * 1e9 + 5000 * 1e9).toString();
      setBalance(newBalance);
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  const switchNetwork = (newNetwork: 'testnet' | 'mainnet') => {
    setNetwork(newNetwork);
    toast.success(`Switched to ${newNetwork} network`);
  };

  const signMessage = async (message: string) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    
    // Simulate signing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `signature-${Date.now()}`;
  };

  const value: WalletContextType = {
    wallet,
    balance,
    network,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    updateBalance,
    switchNetwork,
    signMessage,
    isConnected: !!wallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

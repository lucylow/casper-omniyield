import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useWallet } from './WalletContext';
import { addTransaction, getTransactions } from '@/services/transactionService';
import { getYieldData, getVaultStats as fetchVaultStats } from '@/services/yieldService';

interface VaultStats {
  totalAssets: string;
  totalShares: string;
  sharePrice: string;
  vaultState: number;
  totalDepositors: number;
  minDeposit: string;
  performanceFee: number;
}

interface DepositorInfo {
  shares: string;
  balance: string;
  lastDeposit: number;
}

interface YieldEvent {
  id: number;
  amount: number;
  timestamp: number;
  source: string;
  verified: boolean;
}

interface Allocation {
  chainId: number;
  chainName: string;
  amount: number;
  strategy: string;
  timestamp: number;
}

interface Strategy {
  chainId: number;
  chainName: string;
  allocation: number;
  apy: number;
  strategy: string;
  risk: string;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw';
  amount: number;
  shares: number;
  hash: string;
  timestamp: number;
  status: string;
}

interface LoadingState {
  vault: boolean;
  deposit: boolean;
  withdraw: boolean;
  yield: boolean;
  allocation: boolean;
}

interface VaultContextType {
  vaultStats: VaultStats | null;
  depositorInfo: DepositorInfo | null;
  tokenBalance: string;
  yieldHistory: YieldEvent[];
  allocations: Allocation[];
  strategies: Strategy[];
  transactions: Transaction[];
  loading: LoadingState;
  deposit: (amount: string) => Promise<any>;
  withdraw: (shares: string) => Promise<any>;
  simulateYield: () => Promise<any>;
  allocateCrossChain: (chainId: number, amount: number, strategy: string) => Promise<any>;
  loadVaultData: () => Promise<void>;
  formatCSPR: (motes: string) => string;
  calculateAPY: () => string;
}

const VaultContext = createContext<VaultContextType | null>(null);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within VaultProvider');
  }
  return context;
};

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const { wallet, isConnected } = useWallet();
  
  const [vaultStats, setVaultStats] = useState<VaultStats | null>(null);
  const [depositorInfo, setDepositorInfo] = useState<DepositorInfo | null>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [yieldHistory, setYieldHistory] = useState<YieldEvent[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    vault: false,
    deposit: false,
    withdraw: false,
    yield: false,
    allocation: false,
  });

  useEffect(() => {
    if (isConnected) {
      loadVaultData();
      const interval = setInterval(loadVaultData, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const loadVaultData = async () => {
    if (!isConnected) return;
    
    try {
      setLoading(prev => ({ ...prev, vault: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock vault stats
      setVaultStats({
        totalAssets: (Math.random() * 1000000 * 1e9 + 500000 * 1e9).toString(),
        totalShares: (Math.random() * 900000 * 1e9 + 400000 * 1e9).toString(),
        sharePrice: ((1 + Math.random() * 0.1) * 1e18).toString(),
        vaultState: 0,
        totalDepositors: Math.floor(Math.random() * 500 + 100),
        minDeposit: '1000000000',
        performanceFee: 20,
      });
      
      // Mock depositor info
      setDepositorInfo({
        shares: (Math.random() * 10000 * 1e9).toString(),
        balance: (Math.random() * 12000 * 1e9).toString(),
        lastDeposit: Date.now() - Math.random() * 86400000 * 7,
      });
      
      setTokenBalance((Math.random() * 10000 * 1e9).toString());
      
      // Mock yield history - 30 days of data
      setYieldHistory(Array.from({ length: 30 }, (_, i) => ({
        id: i,
        amount: Math.random() * 8000000000 + 500000000,
        timestamp: Date.now() - i * 86400000,
        source: ['Ethereum', 'Polygon', 'BSC', 'Casper', 'Arbitrum', 'Optimism', 'Avalanche'][i % 7],
        verified: i < 25,
      })));
      
      // Mock allocations - more chains and strategies
      setAllocations([
        { chainId: 1, chainName: 'Ethereum', amount: 4500000000000, strategy: 'Lido Staking', timestamp: Date.now() - 86400000 },
        { chainId: 137, chainName: 'Polygon', amount: 3200000000000, strategy: 'Aave Lending', timestamp: Date.now() - 172800000 },
        { chainId: 56, chainName: 'BSC', amount: 2800000000000, strategy: 'PancakeSwap LP', timestamp: Date.now() - 259200000 },
        { chainId: 0, chainName: 'Casper', amount: 1500000000000, strategy: 'Liquid Staking', timestamp: Date.now() - 345600000 },
        { chainId: 42161, chainName: 'Arbitrum', amount: 2100000000000, strategy: 'GMX Staking', timestamp: Date.now() - 432000000 },
        { chainId: 10, chainName: 'Optimism', amount: 1800000000000, strategy: 'Velodrome LP', timestamp: Date.now() - 518400000 },
        { chainId: 43114, chainName: 'Avalanche', amount: 1200000000000, strategy: 'Trader Joe LP', timestamp: Date.now() - 604800000 },
        { chainId: 250, chainName: 'Fantom', amount: 900000000000, strategy: 'SpookySwap LP', timestamp: Date.now() - 691200000 },
      ]);
      
      // Mock strategies - expanded with more options
      setStrategies([
        { chainId: 1, chainName: 'Ethereum', allocation: 25, apy: 4.2, strategy: 'Lido Staking', risk: 'Low' },
        { chainId: 137, chainName: 'Polygon', allocation: 18, apy: 5.8, strategy: 'Aave Lending', risk: 'Low' },
        { chainId: 56, chainName: 'BSC', allocation: 15, apy: 7.5, strategy: 'PancakeSwap LP', risk: 'Medium' },
        { chainId: 0, chainName: 'Casper', allocation: 12, apy: 9.2, strategy: 'Liquid Staking', risk: 'Low' },
        { chainId: 42161, chainName: 'Arbitrum', allocation: 12, apy: 8.4, strategy: 'GMX Staking', risk: 'Medium' },
        { chainId: 10, chainName: 'Optimism', allocation: 10, apy: 6.8, strategy: 'Velodrome LP', risk: 'Medium' },
        { chainId: 43114, chainName: 'Avalanche', allocation: 5, apy: 11.2, strategy: 'Trader Joe LP', risk: 'High' },
        { chainId: 250, chainName: 'Fantom', allocation: 3, apy: 14.5, strategy: 'SpookySwap LP', risk: 'High' },
      ]);
      
      // Mock transactions - more history
      const txTypes: Array<'deposit' | 'withdraw'> = ['deposit', 'withdraw'];
      const txStatuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'confirmed'];
      setTransactions(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        type: txTypes[i % 2],
        amount: (Math.random() * 5000 + 100) * 1000000000,
        shares: (Math.random() * 4500 + 90) * 1000000000,
        hash: `0x${(Date.now() - i * 3600000).toString(16)}${'a'.repeat(40)}${i.toString().padStart(4, '0')}`,
        timestamp: Date.now() - i * 3600000 * (1 + Math.random()),
        status: txStatuses[i % 5],
      })));
      
    } catch (error) {
      console.error('Failed to load vault data:', error);
      toast.error('Failed to load vault data');
    } finally {
      setLoading(prev => ({ ...prev, vault: false }));
    }
  };

  const deposit = async (amount: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setLoading(prev => ({ ...prev, deposit: true }));
    
    try {
      // Simulate deposit delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const shares = parseFloat(amount);
      const deployHash = `0x${Date.now().toString(16)}${'0'.repeat(50)}`;
      
      // Add transaction with real tracking
      const tx = await addTransaction('deposit', amount, deployHash, wallet?.isReal ?? false);
      
      toast.success(`Successfully deposited ${formatCSPR(amount)} CSPR!`);
      
      await loadVaultData();
      
      const newTx: Transaction = {
        id: transactions.length,
        type: 'deposit',
        amount: parseFloat(amount),
        shares: shares,
        hash: deployHash,
        timestamp: Date.now(),
        status: tx.status,
      };
      
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
      
      return { success: true, shares, deployHash };
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      toast.error(`Deposit failed: ${errorMsg}`);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  const withdraw = async (shares: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setLoading(prev => ({ ...prev, withdraw: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const cspr = parseFloat(shares) * 1.05; // Simulated share price appreciation
      const deployHash = `0x${Date.now().toString(16)}${'0'.repeat(50)}`;
      
      // Add transaction with real tracking
      const tx = await addTransaction('withdraw', cspr.toString(), deployHash, wallet?.isReal ?? false);
      
      toast.success(`Successfully withdrew ${formatCSPR(cspr.toString())} CSPR!`);
      
      await loadVaultData();
      
      const newTx: Transaction = {
        id: transactions.length,
        type: 'withdraw',
        amount: cspr,
        shares: parseFloat(shares),
        hash: deployHash,
        timestamp: Date.now(),
        status: tx.status,
      };
      
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
      
      return { success: true, cspr, deployHash };
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      toast.error(`Withdrawal failed: ${errorMsg}`);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const simulateYield = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setLoading(prev => ({ ...prev, yield: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Yield simulation completed!');
      
      const newYieldEvent: YieldEvent = {
        id: yieldHistory.length,
        amount: Math.random() * 1000000000,
        timestamp: Date.now(),
        source: 'Simulation',
        verified: true,
      };
      
      setYieldHistory(prev => [newYieldEvent, ...prev.slice(0, 49)]);
      
      await loadVaultData();
      
      return { success: true, deployHash: `0x${Date.now().toString(16)}` };
    } catch (error: any) {
      toast.error(`Yield simulation failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, yield: false }));
    }
  };

  const allocateCrossChain = async (chainId: number, amount: number, strategy: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setLoading(prev => ({ ...prev, allocation: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const chainNames: Record<number, string> = {
        1: 'Ethereum',
        137: 'Polygon',
        56: 'BSC',
        0: 'Casper',
      };
      
      toast.success(`Allocated ${formatCSPR(amount.toString())} CSPR to ${chainNames[chainId] || 'chain'}`);
      
      const newAllocation: Allocation = {
        chainId,
        chainName: chainNames[chainId] || 'Unknown',
        amount,
        strategy,
        timestamp: Date.now(),
      };
      
      setAllocations(prev => [newAllocation, ...prev.slice(0, 19)]);
      
      return { success: true, deployHash: `0x${Date.now().toString(16)}` };
    } catch (error: any) {
      toast.error(`Allocation failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, allocation: false }));
    }
  };

  const formatCSPR = (motes: string) => {
    const cspr = parseFloat(motes) / 1e9;
    if (cspr >= 1000000) {
      return (cspr / 1000000).toFixed(2) + 'M';
    } else if (cspr >= 1000) {
      return (cspr / 1000).toFixed(2) + 'K';
    }
    return cspr.toFixed(4);
  };

  const calculateAPY = () => {
    if (!vaultStats || !vaultStats.sharePrice) return '0.00';
    const sharePrice = parseFloat(vaultStats.sharePrice) / 1e18;
    const basePrice = 1.0;
    const increase = ((sharePrice - basePrice) / basePrice) * 100;
    return increase.toFixed(2);
  };

  const value: VaultContextType = {
    vaultStats,
    depositorInfo,
    tokenBalance,
    yieldHistory,
    allocations,
    strategies,
    transactions,
    loading,
    deposit,
    withdraw,
    simulateYield,
    allocateCrossChain,
    loadVaultData,
    formatCSPR,
    calculateAPY,
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

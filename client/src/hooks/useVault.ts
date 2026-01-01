import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from 'sonner';

interface VaultData {
  totalAssets: string;
  totalShares: string;
  sharePrice: string;
  apy: number;
  depositorShares: string;
  depositorBalance: string;
}

interface UseVaultOptions {
  refreshInterval?: number;
}

export const useVaultData = (options: UseVaultOptions = {}) => {
  const { refreshInterval = 30000 } = options;
  const { isConnected } = useWallet();
  
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultData = useCallback(async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVaultData({
        totalAssets: (Math.random() * 1000000 * 1e9 + 500000 * 1e9).toString(),
        totalShares: (Math.random() * 900000 * 1e9 + 400000 * 1e9).toString(),
        sharePrice: ((1 + Math.random() * 0.1) * 1e18).toString(),
        apy: Math.random() * 5 + 5,
        depositorShares: (Math.random() * 10000 * 1e9).toString(),
        depositorBalance: (Math.random() * 12000 * 1e9).toString(),
      });
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch vault data');
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    fetchVaultData();
    
    const interval = setInterval(fetchVaultData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchVaultData, refreshInterval]);

  const calculateShareValue = useCallback((shares: string) => {
    if (!vaultData) return '0';
    
    const shareAmount = parseFloat(shares);
    const totalAssets = parseFloat(vaultData.totalAssets);
    const totalShares = parseFloat(vaultData.totalShares);
    
    if (totalShares === 0) return '0';
    
    const value = (shareAmount * totalAssets) / totalShares;
    return value.toString();
  }, [vaultData]);

  const calculateSharesToMint = useCallback((depositAmount: string) => {
    if (!vaultData) return '0';
    
    const amount = parseFloat(depositAmount);
    const totalAssets = parseFloat(vaultData.totalAssets);
    const totalShares = parseFloat(vaultData.totalShares);
    
    if (totalAssets === 0) return depositAmount;
    
    const shares = (amount * totalShares) / totalAssets;
    return shares.toString();
  }, [vaultData]);

  return {
    vaultData,
    loading,
    error,
    refresh: fetchVaultData,
    calculateShareValue,
    calculateSharesToMint,
  };
};

export default useVaultData;

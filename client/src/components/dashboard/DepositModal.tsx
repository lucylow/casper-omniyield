import React, { useState, useEffect } from 'react';
import { useVault } from '@/contexts/VaultContext';
import { useWallet } from '@/contexts/WalletContext';
import { X, Wallet, Fuel, Percent, Info, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DepositModalProps {
  onClose: () => void;
}

const DepositModal = ({ onClose }: DepositModalProps) => {
  const { deposit, vaultStats, depositorInfo, formatCSPR, loading } = useVault();
  const { balance } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [estimatedShares, setEstimatedShares] = useState('0');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('1000000000');

  const percentages = [25, 50, 75, 100];

  useEffect(() => {
    calculateEstimatedShares();
  }, [amount, vaultStats]);

  const calculateEstimatedShares = () => {
    if (!amount || !vaultStats || parseFloat(amount) === 0) {
      setEstimatedShares('0');
      return;
    }

    try {
      const depositAmount = parseFloat(amount) * 1e9;
      const totalAssets = parseFloat(vaultStats.totalAssets || '0');
      const totalShares = parseFloat(vaultStats.totalShares || '0');

      let shares;
      if (totalShares === 0) {
        shares = depositAmount;
      } else {
        shares = (depositAmount * totalShares) / totalAssets;
      }

      setEstimatedShares((shares / 1e9).toFixed(6));
    } catch (error) {
      console.error('Error calculating shares:', error);
      setEstimatedShares('0');
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (!balance || parseFloat(balance) === 0) return;
    
    const availableBalance = parseFloat(balance) / 1e9;
    const maxAmount = availableBalance - 1;
    const calculatedAmount = (maxAmount * percentage) / 100;
    
    setAmount(Math.max(0, calculatedAmount).toFixed(4));
    setSelectedPercentage(percentage);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const depositAmount = parseFloat(amount);
    const availableBalance = parseFloat(balance) / 1e9;

    if (depositAmount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    const minDeposit = parseFloat(vaultStats?.minDeposit || '1000000000') / 1e9;
    if (depositAmount < minDeposit) {
      toast.error(`Minimum deposit is ${minDeposit} CSPR`);
      return;
    }

    try {
      const amountInMotes = Math.floor(depositAmount * 1e9).toString();
      await deposit(amountInMotes);
      onClose();
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const formatBalance = (motes: string) => {
    const cspr = parseFloat(motes) / 1e9;
    return cspr.toFixed(4);
  };

  const getPerformanceFee = () => {
    return vaultStats?.performanceFee || 20;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-card border border-[hsl(var(--border))] rounded-2xl shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Deposit CSPR</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <span className="text-xs text-muted-foreground block">Wallet Balance</span>
                <span className="font-semibold text-foreground">{formatBalance(balance)} CSPR</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-accent" />
              <div>
                <span className="text-xs text-muted-foreground block">Current Shares</span>
                <span className="font-semibold text-foreground">
                  {depositorInfo ? formatCSPR(depositorInfo.shares || '0') : '0'} oYLD
                </span>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Amount to Deposit (CSPR)</label>
              <span className="text-xs text-muted-foreground">
                Min: {formatCSPR(vaultStats?.minDeposit || '1000000000')} CSPR
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setSelectedPercentage(null);
                }}
                placeholder="0.0"
                className="w-full px-4 py-4 pr-20 bg-muted border-2 border-[hsl(var(--border))] rounded-xl text-foreground text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                step="0.0001"
                min="0"
              />
              <button
                onClick={() => handlePercentageClick(100)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-lg hover:bg-primary/30 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Quick Percentage Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {percentages.map((p) => (
              <button
                key={p}
                onClick={() => handlePercentageClick(p)}
                className={cn(
                  "py-3 rounded-lg text-sm font-semibold transition-all",
                  selectedPercentage === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-[hsl(var(--border))] text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {p}%
              </button>
            ))}
          </div>

          {/* Estimation Card */}
          <div className="p-4 bg-muted/30 border border-[hsl(var(--border))] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Shares</span>
              <span className="font-semibold text-foreground">{estimatedShares} oYLD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Performance Fee</span>
              <span className="font-semibold text-foreground">{getPerformanceFee()}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gas Estimate</span>
              <div className="flex items-center gap-1">
                <Fuel className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{formatCSPR(gasEstimate)} CSPR</span>
              </div>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-muted/50 border border-[hsl(var(--border))] rounded-lg text-muted-foreground text-sm font-semibold hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings className="w-4 h-4" />
            Advanced Options
            <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
          </button>

          {showAdvanced && (
            <div className="p-4 bg-muted/20 border border-[hsl(var(--border))] rounded-xl animate-in slide-in-from-top-2">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Custom Gas Limit (CSPR)</label>
                <input
                  type="number"
                  value={parseFloat(gasEstimate) / 1e9}
                  onChange={(e) => setGasEstimate((parseFloat(e.target.value) * 1e9).toString())}
                  className="w-full px-4 py-3 bg-muted border border-[hsl(var(--border))] rounded-lg text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.001"
                  min="0.1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[hsl(var(--border))]">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-muted border border-[hsl(var(--border))] rounded-xl text-muted-foreground font-semibold hover:bg-muted/80 hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading.deposit || !amount || parseFloat(amount) <= 0}
            className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
          >
            {loading.deposit ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Confirm Deposit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

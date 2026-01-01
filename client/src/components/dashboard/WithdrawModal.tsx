import React, { useState, useEffect } from 'react';
import { useVault } from '@/contexts/VaultContext';
import { X, ArrowUpRight, Fuel, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WithdrawModalProps {
  onClose: () => void;
}

const WithdrawModal = ({ onClose }: WithdrawModalProps) => {
  const { withdraw, vaultStats, depositorInfo, formatCSPR, loading } = useVault();
  
  const [shares, setShares] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [estimatedCSPR, setEstimatedCSPR] = useState('0');

  const percentages = [25, 50, 75, 100];

  useEffect(() => {
    calculateEstimatedCSPR();
  }, [shares, vaultStats]);

  const calculateEstimatedCSPR = () => {
    if (!shares || !vaultStats || parseFloat(shares) === 0) {
      setEstimatedCSPR('0');
      return;
    }

    try {
      const shareAmount = parseFloat(shares) * 1e9;
      const totalAssets = parseFloat(vaultStats.totalAssets || '0');
      const totalShares = parseFloat(vaultStats.totalShares || '0');

      if (totalShares === 0) {
        setEstimatedCSPR('0');
        return;
      }

      const cspr = (shareAmount * totalAssets) / totalShares;
      setEstimatedCSPR((cspr / 1e9).toFixed(6));
    } catch (error) {
      console.error('Error calculating CSPR:', error);
      setEstimatedCSPR('0');
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (!depositorInfo?.shares || parseFloat(depositorInfo.shares) === 0) return;
    
    const totalShares = parseFloat(depositorInfo.shares) / 1e9;
    const calculatedShares = (totalShares * percentage) / 100;
    
    setShares(calculatedShares.toFixed(6));
    setSelectedPercentage(percentage);
  };

  const handleWithdraw = async () => {
    if (!shares || parseFloat(shares) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const shareAmount = parseFloat(shares);
    const availableShares = parseFloat(depositorInfo?.shares || '0') / 1e9;

    if (shareAmount > availableShares) {
      toast.error('Insufficient shares');
      return;
    }

    try {
      const sharesInMotes = Math.floor(shareAmount * 1e9).toString();
      await withdraw(sharesInMotes);
      onClose();
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const availableShares = depositorInfo ? parseFloat(depositorInfo.shares) / 1e9 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-card border border-[hsl(var(--border))] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Withdraw CSPR</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Available Shares */}
          <div className="p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Shares</span>
              <span className="font-semibold text-foreground">{availableShares.toFixed(6)} oYLD</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Estimated Value</span>
              <span className="font-semibold text-foreground">
                {depositorInfo ? formatCSPR(depositorInfo.balance) : '0'} CSPR
              </span>
            </div>
          </div>

          {/* Shares Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Shares to Withdraw (oYLD)</label>
            </div>
            <div className="relative">
              <input
                type="number"
                value={shares}
                onChange={(e) => {
                  setShares(e.target.value);
                  setSelectedPercentage(null);
                }}
                placeholder="0.0"
                className="w-full px-4 py-3 pr-20 bg-muted border border-[hsl(var(--border))] rounded-xl text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                step="0.000001"
                min="0"
                max={availableShares}
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
                  "py-2 rounded-lg text-sm font-semibold transition-all",
                  selectedPercentage === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-[hsl(var(--border))] text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {p}%
              </button>
            ))}
          </div>

          {/* Estimated CSPR */}
          <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="font-semibold text-green-400">{estimatedCSPR} CSPR</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>Includes accumulated yield</span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Withdrawal Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Withdrawals may take up to 30 seconds to process. Your CSPR will be sent to your connected wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Gas Estimate */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="w-4 h-4" />
              <span>Estimated Gas</span>
            </div>
            <span className="text-foreground">~1 CSPR</span>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading.withdraw || !shares || parseFloat(shares) <= 0 || parseFloat(shares) > availableShares}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.withdraw ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Confirm Withdrawal'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;

import React, { useState } from 'react';
import { useVault } from '@/contexts/VaultContext';
import { Settings, TrendingUp, Shield, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const StrategyManager = () => {
  const { strategies, allocateCrossChain, loading } = useVault();
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'high':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getChainIcon = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return '⟠';
      case 'polygon':
        return '⬡';
      case 'bsc':
        return '⬢';
      case 'casper':
        return '◆';
      default:
        return '○';
    }
  };

  const handleRebalance = async (chainId: number) => {
    setSelectedChain(chainId);
    try {
      await allocateCrossChain(chainId, 1000000000, 'Auto Rebalance');
    } finally {
      setSelectedChain(null);
    }
  };

  if (loading.vault) {
    return (
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Strategy Manager</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Strategy Manager</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-semibold transition-all hover:bg-primary/20">
          <Settings className="w-4 h-4" />
          Configure
        </button>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy, index) => (
          <div
            key={index}
            className="p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-primary/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
                  {getChainIcon(strategy.chainName)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{strategy.chainName}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.strategy}</p>
                </div>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getRiskColor(strategy.risk))}>
                {strategy.risk} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Allocation</p>
                <p className="font-semibold text-foreground">{strategy.allocation}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">APY</p>
                <p className="font-semibold text-green-400">{strategy.apy}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Active
                </p>
              </div>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${strategy.allocation}%` }}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleRebalance(strategy.chainId)}
                disabled={loading.allocation || selectedChain === strategy.chainId}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-semibold transition-all hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedChain === strategy.chainId ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Rebalance
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-4 bg-muted border border-[hsl(var(--border))] rounded-lg text-muted-foreground text-sm font-semibold transition-all hover:bg-muted/80 hover:text-foreground">
                <TrendingUp className="w-4 h-4" />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Auto-Rebalancing Active</p>
            <p className="text-sm text-muted-foreground mt-1">
              The vault automatically rebalances allocations every 24 hours to optimize yields across chains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyManager;

import React from 'react';
import { useVault } from '@/contexts/VaultContext';
import StrategyManager from '@/components/dashboard/StrategyManager';
import AllocationChart from '@/components/dashboard/AllocationChart';
import { PieChart, TrendingUp, Shield, Zap } from 'lucide-react';

const Strategies = () => {
  const { strategies, formatCSPR, calculateAPY } = useVault();

  const chainColors: Record<string, string> = {
    Ethereum: 'bg-blue-500',
    Polygon: 'bg-purple-500',
    BSC: 'bg-yellow-500',
    Casper: 'bg-primary',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Yield Strategies</h1>
        <p className="text-muted-foreground">
          View and manage cross-chain yield allocation strategies
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Chains</span>
          </div>
          <p className="text-2xl font-bold text-foreground">4</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Avg APY</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{calculateAPY()}%</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Risk Level</span>
          </div>
          <p className="text-2xl font-bold text-foreground">Medium</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Rebalance</span>
          </div>
          <p className="text-2xl font-bold text-foreground">Auto</p>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Allocation Distribution</h2>
          <AllocationChart />
        </div>

        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Chain Strategies</h2>
          <div className="space-y-4">
            {strategies.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${chainColors[strategy.chainName] || 'bg-primary'}`} />
                  <div>
                    <p className="font-medium text-foreground">{strategy.chainName}</p>
                    <p className="text-xs text-muted-foreground">{strategy.strategy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{strategy.allocation}%</p>
                  <p className="text-xs text-green-400">{strategy.apy}% APY</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Manager */}
      <StrategyManager />
    </div>
  );
};

export default Strategies;

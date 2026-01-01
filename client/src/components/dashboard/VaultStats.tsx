import React from 'react';
import { useVault } from '@/contexts/VaultContext';
import { TrendingUp, Users, Shield, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

const VaultStats = () => {
  const { vaultStats, formatCSPR, calculateAPY, loading } = useVault();

  const stats = [
    {
      label: 'Total Value Locked',
      value: vaultStats ? formatCSPR(vaultStats.totalAssets) : '0',
      suffix: 'CSPR',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      label: 'Total Shares',
      value: vaultStats ? formatCSPR(vaultStats.totalShares) : '0',
      suffix: 'oYLD',
      icon: Shield,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      label: 'Average APY',
      value: calculateAPY(),
      suffix: '%',
      icon: Percent,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
    },
    {
      label: 'Total Depositors',
      value: vaultStats?.totalDepositors?.toString() || '0',
      suffix: '',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
    },
  ];

  return (
    <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Vault Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-muted/30 border border-[hsl(var(--border))] rounded-xl p-4 transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bgColor)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            
            {loading.vault ? (
              <div className="h-8 bg-muted rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Share Price</span>
          <span className="font-semibold text-foreground">
            ${vaultStats ? (parseFloat(vaultStats.sharePrice) / 1e18).toFixed(6) : '1.000000'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Performance Fee</span>
          <span className="font-semibold text-foreground">{vaultStats?.performanceFee || 20}%</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Min Deposit</span>
          <span className="font-semibold text-foreground">
            {vaultStats ? formatCSPR(vaultStats.minDeposit) : '1'} CSPR
          </span>
        </div>
      </div>
    </div>
  );
};

export default VaultStats;

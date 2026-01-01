import React, { useState } from 'react';
import { useVault } from '@/contexts/VaultContext';
import { useWallet } from '@/contexts/WalletContext';
import VaultStats from '@/components/dashboard/VaultStats';
import AllocationChart from '@/components/dashboard/AllocationChart';
import YieldHistory from '@/components/dashboard/YieldHistory';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import StrategyManager from '@/components/dashboard/StrategyManager';
import DepositModal from '@/components/dashboard/DepositModal';
import WithdrawModal from '@/components/dashboard/WithdrawModal';
import ConnectWallet from '@/components/ConnectWallet';
import { 
  Coins, TrendingUp, Rocket, RefreshCw, Plus, Minus, 
  Wallet, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { vaultStats, depositorInfo, loading, simulateYield, formatCSPR, calculateAPY } = useVault();
  const { wallet, isConnected, balance } = useWallet();
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleQuickYield = async () => {
    try {
      await simulateYield();
    } catch (error) {
      console.error('Yield simulation failed:', error);
    }
  };

  const getVaultStatus = () => {
    if (!vaultStats) return 'loading';
    const state = vaultStats.vaultState;
    return state === 0 ? 'active' : state === 1 ? 'paused' : 'emergency';
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-400',
    paused: 'bg-yellow-400',
    emergency: 'bg-red-400',
    loading: 'bg-muted-foreground',
  };

  // Show connect prompt but still allow viewing dashboard
  const ConnectPrompt = () => (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Connect your wallet</p>
            <p className="text-sm text-muted-foreground">Connect to deposit, withdraw, and track your portfolio</p>
          </div>
        </div>
        <ConnectWallet />
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!isConnected && <ConnectPrompt />}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Total Value Locked</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {vaultStats ? formatCSPR(vaultStats.totalAssets) : '0'} CSPR
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" />
            +{calculateAPY()}% APY
          </div>
        </div>

        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Your Shares</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {depositorInfo ? formatCSPR(depositorInfo.shares) : '0'} oYLD
          </div>
          <div className="text-sm text-muted-foreground">
            ≈ {formatCSPR(depositorInfo?.balance || '0')} CSPR
          </div>
        </div>

        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Share Price</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            ${vaultStats ? (parseFloat(vaultStats.sharePrice) / 1e18).toFixed(4) : '1.0000'}
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("w-3 h-3 rounded-full", statusColors[getVaultStatus()])} />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Vault Status</span>
          </div>
          <div className="text-3xl font-bold text-foreground capitalize mb-2">
            {getVaultStatus()}
          </div>
          <div className="text-sm text-muted-foreground">
            {vaultStats?.totalDepositors || 0} Depositors
          </div>
        </div>
      </div>

      {/* Action Buttons - Only show when connected */}
      {isConnected && (
        <div className="flex gap-5 mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            disabled={loading.deposit}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Deposit CSPR
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={loading.withdraw || !depositorInfo?.shares || parseFloat(depositorInfo.shares) === 0}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-transparent border-2 border-primary text-primary font-semibold rounded-xl transition-all hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-5 h-5" />
            Withdraw CSPR
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[hsl(var(--border))] pb-4 overflow-x-auto">
        {['overview', 'allocations', 'strategies', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <VaultStats />
              <YieldHistory />
            </div>
            <div className="space-y-8">
              <AllocationChart />
              <TransactionHistory />
            </div>
          </div>
        )}
        
        {activeTab === 'allocations' && <AllocationChart />}
        {activeTab === 'strategies' && <StrategyManager />}
        {activeTab === 'history' && <TransactionHistory />}
      </div>

      {/* Modals */}
      {showDepositModal && <DepositModal onClose={() => setShowDepositModal(false)} />}
      {showWithdrawModal && <WithdrawModal onClose={() => setShowWithdrawModal(false)} />}
    </div>
  );
};

export default Dashboard;

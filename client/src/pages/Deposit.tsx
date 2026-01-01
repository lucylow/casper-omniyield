import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useVault } from '@/contexts/VaultContext';
import ConnectWallet from '@/components/ConnectWallet';
import DepositModal from '@/components/dashboard/DepositModal';
import { Wallet, ArrowRight, Shield, Zap, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Deposit = () => {
  const { isConnected } = useWallet();
  const { vaultStats, formatCSPR, calculateAPY } = useVault();
  const [showModal, setShowModal] = useState(false);

  const benefits = [
    { icon: TrendingUp, title: 'High Yield', description: 'Up to 12% APY across chains' },
    { icon: Shield, title: 'Secure', description: 'Multi-sig protected vault' },
    { icon: Zap, title: 'Instant', description: 'Mint oYLD tokens immediately' },
    { icon: Clock, title: 'Flexible', description: 'Withdraw anytime' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Deposit CSPR & Earn Yield
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Deposit your CSPR tokens into the OmniYield vault and receive oYLD tokens representing your share. 
          Your funds are automatically allocated across multiple chains for maximum yield.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Current APY</p>
          <p className="text-2xl font-bold text-green-400">{calculateAPY()}%</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Value Locked</p>
          <p className="text-2xl font-bold text-foreground">
            {vaultStats ? formatCSPR(vaultStats.totalAssets) : '0'} CSPR
          </p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Active Depositors</p>
          <p className="text-2xl font-bold text-foreground">{vaultStats?.totalDepositors || 0}</p>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-8 mb-8">
        {isConnected ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Deposit</h2>
            <p className="text-muted-foreground mb-6">
              Your wallet is connected. Click below to deposit CSPR and receive oYLD tokens.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30"
            >
              Deposit CSPR
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your Casper wallet to start depositing and earning yield.
            </p>
            <ConnectWallet />
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-card border border-[hsl(var(--border))] rounded-xl p-4 text-center">
            <benefit.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>

      {showModal && <DepositModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Deposit;

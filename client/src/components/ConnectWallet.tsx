import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, ChevronDown, ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ConnectWallet = () => {
  const { wallet, balance, network, connectWallet, disconnectWallet, updateBalance, switchNetwork, loading } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowDropdown(false);
  };

  const copyAddress = async () => {
    if (wallet?.publicKey) {
      await navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (motes: string) => {
    const cspr = parseFloat(motes) / 1e9;
    return cspr.toFixed(4);
  };

  const openExplorer = () => {
    if (wallet?.accountHash) {
      const explorerUrl = network === 'testnet' 
        ? `https://testnet.cspr.live/account/${wallet.accountHash}`
        : `https://cspr.live/account/${wallet.accountHash}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (!wallet) {
    return (
      <button
        onClick={handleConnect}
        disabled={loading}
        className="wallet-connect-btn flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-card border border-[hsl(var(--border))] px-3 py-2 rounded-xl transition-all hover:border-primary hover:bg-primary/10 min-w-[200px]"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start flex-1">
          <span className="font-semibold text-sm text-foreground">{formatBalance(balance)} CSPR</span>
          <span className="text-xs text-muted-foreground">{formatAddress(wallet.publicKey)}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDropdown && "rotate-180")} />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute top-full mt-2 right-0 w-80 bg-card border border-[hsl(var(--border))] rounded-2xl p-5 z-50 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 pb-5 border-b border-[hsl(var(--border))] mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground flex-shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg text-foreground">{formatBalance(balance)} CSPR</p>
                <p className="text-xs text-muted-foreground break-all">{wallet.publicKey}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <button
                onClick={copyAddress}
                className="flex items-center gap-3 p-3 bg-muted/50 border border-[hsl(var(--border))] rounded-lg text-muted-foreground text-sm transition-all hover:bg-primary/10 hover:border-primary hover:text-foreground"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              <button
                onClick={openExplorer}
                className="flex items-center gap-3 p-3 bg-muted/50 border border-[hsl(var(--border))] rounded-lg text-muted-foreground text-sm transition-all hover:bg-primary/10 hover:border-primary hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </button>
              <button
                onClick={updateBalance}
                className="flex items-center gap-3 p-3 bg-muted/50 border border-[hsl(var(--border))] rounded-lg text-muted-foreground text-sm transition-all hover:bg-primary/10 hover:border-primary hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Balance
              </button>
            </div>

            <div className="mb-5">
              <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Network</span>
              <div className="flex gap-2">
                <button
                  onClick={() => switchNetwork('testnet')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm transition-all",
                    network === 'testnet'
                      ? "bg-primary/20 border border-primary text-primary"
                      : "bg-muted/50 border border-[hsl(var(--border))] text-muted-foreground hover:bg-muted"
                  )}
                >
                  Testnet
                </button>
                <button
                  onClick={() => switchNetwork('mainnet')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm transition-all",
                    network === 'mainnet'
                      ? "bg-primary/20 border border-primary text-primary"
                      : "bg-muted/50 border border-[hsl(var(--border))] text-muted-foreground hover:bg-muted"
                  )}
                >
                  Mainnet
                </button>
              </div>
            </div>

            <div className="border-t border-[hsl(var(--border))] pt-5">
              <button
                onClick={handleDisconnect}
                className="w-full py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-semibold transition-all hover:bg-destructive/20 hover:border-destructive"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectWallet;

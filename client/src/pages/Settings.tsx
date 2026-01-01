import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Settings as SettingsIcon, 
  Wallet, 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Sun,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { wallet, network, switchNetwork, isConnected, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const copyAddress = async () => {
    if (wallet?.publicKey) {
      await navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const settingsSections = [
    {
      title: 'Wallet',
      icon: Wallet,
      content: (
        <div className="space-y-4">
          {isConnected ? (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Address</p>
                  <p className="font-mono text-sm text-foreground">{wallet?.publicKey}</p>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <button
                onClick={disconnectWallet}
                className="w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
              >
                Disconnect Wallet
              </button>
            </>
          ) : (
            <p className="text-muted-foreground">No wallet connected</p>
          )}
        </div>
      ),
    },
    {
      title: 'Network',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select the Casper network to use</p>
          <div className="flex gap-3">
            <button
              onClick={() => switchNetwork('testnet')}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl font-medium transition-colors",
                network === 'testnet'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Testnet
            </button>
            <button
              onClick={() => switchNetwork('mainnet')}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl font-medium transition-colors",
                network === 'mainnet'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Mainnet
            </button>
          </div>
          <a
            href={network === 'testnet' ? 'https://testnet.cspr.live' : 'https://cspr.live'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts for transactions and yield updates</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                notifications ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  notifications ? "left-7" : "left-1"
                )}
              />
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Appearance',
      icon: theme === 'dark' ? Moon : Sun,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors",
                theme === 'dark'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors",
                theme === 'light'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p className="text-sm font-medium text-green-400">Security Status: Good</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your wallet connection is secure. Always verify transaction details before signing.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Never share your private keys</p>
            <p>• Always verify contract addresses</p>
            <p>• Use hardware wallets for large amounts</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your wallet, network, and preferences</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
            </div>
            {section.content}
          </div>
        ))}
      </div>

      {/* Version Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>OmniYield Nexus v1.0.0</p>
        <p>Built for Casper Hackathon 2026</p>
      </div>
    </div>
  );
};

export default Settings;

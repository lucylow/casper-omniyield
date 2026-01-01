import { useLocation } from 'react-router-dom';
import { Bell, Search, ExternalLink } from 'lucide-react';
import ConnectWallet from '@/components/ConnectWallet';
import { useWallet } from '@/contexts/WalletContext';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Home', description: 'Welcome to OmniYield Nexus' },
  '/dashboard': { title: 'Dashboard', description: 'Your portfolio overview' },
  '/deposit': { title: 'Deposit', description: 'Deposit CSPR & mint oYLD tokens' },
  '/strategies': { title: 'Strategies', description: 'Cross-chain yield strategies' },
  '/activity': { title: 'Activity', description: 'Protocol events & transactions' },
  '/demo': { title: 'Demo', description: 'Live demonstration' },
  '/governance': { title: 'Governance', description: 'Protocol governance & voting' },
  '/settings': { title: 'Settings', description: 'Your preferences' },
};

export function TopBar() {
  const location = useLocation();
  const { network } = useWallet();
  const pageInfo = pageTitles[location.pathname] || { title: 'OmniYield', description: '' };

  // Don't show topbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="h-16 border-b border-[hsl(var(--border))] bg-card/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Page Info */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">{pageInfo.title}</h1>
        <p className="text-xs text-muted-foreground">{pageInfo.description}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
          <span className={`w-2 h-2 rounded-full ${network === 'testnet' ? 'bg-yellow-400' : 'bg-green-400'}`} />
          <span className="text-xs font-medium text-muted-foreground capitalize">{network}</span>
        </div>

        {/* Explorer Link */}
        <a
          href={network === 'testnet' ? 'https://testnet.cspr.live' : 'https://cspr.live'}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Explorer
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Wallet */}
        <ConnectWallet />
      </div>
    </header>
  );
}

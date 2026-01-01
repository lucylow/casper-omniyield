import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Activity, 
  Settings, 
  Zap,
  Home,
  Play,
  Vote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home, description: 'Landing page' },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & balances' },
  { path: '/deposit', label: 'Deposit', icon: Wallet, description: 'Deposit & mint oYLD' },
  { path: '/strategies', label: 'Strategies', icon: PieChart, description: 'Yield allocations' },
  { path: '/activity', label: 'Activity', icon: Activity, description: 'Events & messages' },
  { path: '/demo', label: 'Demo', icon: Play, description: 'Live demo' },
  { path: '/governance', label: 'Governance', icon: Vote, description: 'Protocol controls' },
  { path: '/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-card border-r border-[hsl(var(--border))] flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-foreground">OmniYield</h1>
              <p className="text-xs text-muted-foreground">Cross-Chain Yield</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <div className="overflow-hidden">
                  <span className="font-medium text-sm">{item.label}</span>
                  {!isActive && (
                    <p className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-[hsl(var(--border))] rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[hsl(var(--border))]">
          <div className="text-xs text-muted-foreground">
            <p>Built for Casper Hackathon</p>
            <p className="text-primary">2026 Edition</p>
          </div>
        </div>
      )}
    </aside>
  );
}

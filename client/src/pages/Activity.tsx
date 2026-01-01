import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import YieldHistory from '@/components/dashboard/YieldHistory';
import { cn } from '@/lib/utils';

interface ActivityEvent {
  id: string;
  type: 'deposit' | 'withdraw' | 'yield' | 'rebalance' | 'cross-chain';
  description: string;
  amount?: string;
  timestamp: Date;
  deployHash?: string;
  chain?: string;
}

const Activity = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Simulated activity events
  useEffect(() => {
    const mockEvents: ActivityEvent[] = [
      { id: '1', type: 'deposit', description: 'DepositReceived', amount: '100 CSPR', timestamp: new Date(Date.now() - 60000), deployHash: '0x1234...5678' },
      { id: '2', type: 'rebalance', description: 'StrategyRebalanced', chain: 'Ethereum', timestamp: new Date(Date.now() - 120000) },
      { id: '3', type: 'yield', description: 'YieldClaimed', amount: '+0.5 CSPR', timestamp: new Date(Date.now() - 180000) },
      { id: '4', type: 'cross-chain', description: 'CrossChainTransfer', amount: '50 CSPR', chain: 'Polygon', timestamp: new Date(Date.now() - 240000) },
      { id: '5', type: 'withdraw', description: 'WithdrawCompleted', amount: '25 CSPR', timestamp: new Date(Date.now() - 300000), deployHash: '0xabcd...efgh' },
    ];
    setEvents(mockEvents);
  }, []);

  const typeColors: Record<string, string> = {
    deposit: 'bg-green-400/20 text-green-400',
    withdraw: 'bg-red-400/20 text-red-400',
    yield: 'bg-yellow-400/20 text-yellow-400',
    rebalance: 'bg-blue-400/20 text-blue-400',
    'cross-chain': 'bg-purple-400/20 text-purple-400',
  };

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  const refreshEvents = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Protocol Activity</h1>
          <p className="text-muted-foreground">Real-time events and transaction history</p>
        </div>
        <button
          onClick={refreshEvents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'deposit', 'withdraw', 'yield', 'rebalance', 'cross-chain'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              filter === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Live Events */}
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ActivityIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Live Events</h2>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-4">
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", typeColors[event.type])}>
                  {event.type}
                </span>
                <div>
                  <p className="font-medium text-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.chain && `${event.chain} • `}
                    {event.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {event.amount && (
                  <span className="font-semibold text-foreground">{event.amount}</span>
                )}
                {event.deployHash && (
                  <a
                    href={`https://testnet.cspr.live/deploy/${event.deployHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <YieldHistory />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Activity;

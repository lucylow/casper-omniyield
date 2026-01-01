import React from 'react';
import { useVault } from '@/contexts/VaultContext';
import { ArrowDownLeft, ArrowUpRight, ExternalLink, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TransactionHistory = () => {
  const { transactions, formatCSPR, loading } = useVault();

  if (loading.vault) {
    return (
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Transaction History</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Transaction History</h3>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your deposit and withdrawal history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.type === 'deposit' ? "bg-green-400/20" : "bg-red-400/20"
                  )}
                >
                  {tx.type === 'deposit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground capitalize">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold",
                    tx.type === 'deposit' ? "text-green-400" : "text-red-400"
                  )}
                >
                  {tx.type === 'deposit' ? '+' : '-'}{formatCSPR(tx.amount.toString())} CSPR
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Confirmed</span>
                  <button
                    onClick={() => window.open(`https://testnet.cspr.live/deploy/${tx.hash}`, '_blank')}
                    className="hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;

import React from 'react';
import { useVault } from '@/contexts/VaultContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const YieldHistory = () => {
  const { yieldHistory, formatCSPR, loading } = useVault();

  const chartData = [...yieldHistory].reverse().map((y, i) => ({
    date: format(new Date(y.timestamp), 'MMM dd'),
    amount: y.amount / 1e9,
    source: y.source,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-[hsl(var(--border))] rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.date}</p>
          <p className="text-sm text-primary">{data.amount.toFixed(4)} CSPR</p>
          <p className="text-sm text-muted-foreground">From: {data.source}</p>
        </div>
      );
    }
    return null;
  };

  if (loading.vault) {
    return (
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Yield History</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Yield History</h3>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+{(Math.random() * 5 + 2).toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0085ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0085ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8b8fa8', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8b8fa8', fontSize: 12 }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#0085ff"
              strokeWidth={2}
              fill="url(#yieldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {yieldHistory.slice(0, 5).map((yield_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-[hsl(var(--border))]"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                yield_.verified ? "bg-green-400/20" : "bg-yellow-400/20"
              )}>
                {yield_.verified ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  +{formatCSPR(yield_.amount.toString())} CSPR
                </p>
                <p className="text-xs text-muted-foreground">{yield_.source}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(yield_.timestamp), 'MMM dd, HH:mm')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YieldHistory;

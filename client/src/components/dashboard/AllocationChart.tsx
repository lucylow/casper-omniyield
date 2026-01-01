import React from 'react';
import { useVault } from '@/contexts/VaultContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0085ff', '#7928ca', '#00d4aa', '#ff6b6b'];

const AllocationChart = () => {
  const { strategies, loading } = useVault();

  const data = strategies.map((s, i) => ({
    name: s.chainName,
    value: s.allocation,
    strategy: s.strategy,
    apy: s.apy,
    color: COLORS[i % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-[hsl(var(--border))] rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.strategy}</p>
          <p className="text-sm text-primary">{data.value}% allocation</p>
          <p className="text-sm text-green-400">{data.apy}% APY</p>
        </div>
      );
    }
    return null;
  };

  if (loading.vault) {
    return (
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Cross-Chain Allocation</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Cross-Chain Allocation</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-semibold text-foreground ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationChart;

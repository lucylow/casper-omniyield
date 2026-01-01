import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const chains = [
  { name: 'Casper', apy: '8.5%', color: '#0085FF', angle: 0 },
  { name: 'Ethereum', apy: '3.5%', color: '#627EEA', angle: 90 },
  { name: 'Polygon', apy: '4.5%', color: '#8247E5', angle: 180 },
  { name: 'BSC', apy: '6.0%', color: '#F0B90B', angle: 270 },
];

const ChainNetwork = () => {
  const [activeChain, setActiveChain] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChain((prev) => (prev + 1) % chains.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px]">
      {/* Orbital rings */}
      <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />
      <div className="absolute inset-8 border border-primary/10 rounded-full" />
      <div className="absolute inset-16 border border-secondary/10 rounded-full" />

      {/* Connection beams */}
      {chains.map((chain, i) => (
        <div
          key={`beam-${i}`}
          className="absolute top-1/2 left-1/2 w-[2px] h-[120px] sm:h-[150px] lg:h-[180px] origin-top"
          style={{
            transform: `rotate(${chain.angle}deg)`,
          }}
        >
          <div
            className="w-full h-full animate-beam"
            style={{
              background: `linear-gradient(to bottom, transparent, ${chain.color}80, transparent)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        </div>
      ))}

      {/* Center node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center glow-blue">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            <span className="text-[10px] sm:text-xs font-semibold text-primary-foreground mt-1">Casper</span>
          </div>
        </div>
      </div>

      {/* Chain nodes */}
      {chains.map((chain, i) => {
        const radius = 140; // sm:175, lg:210
        const radians = (chain.angle * Math.PI) / 180;
        const x = Math.cos(radians - Math.PI / 2) * radius;
        const y = Math.sin(radians - Math.PI / 2) * radius;
        const isActive = activeChain === i;

        return (
          <div
            key={chain.name}
            className="absolute top-1/2 left-1/2 transition-all duration-500"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.1 : 1})`,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: chain.color,
                  boxShadow: isActive ? `0 0 30px ${chain.color}80` : 'none',
                }}
              >
                {chain.name[0]}
              </div>
              <div className="glass rounded-xl px-3 py-1.5 text-center">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{chain.name}</div>
                <div className="text-xs font-bold text-accent">{chain.apy} APY</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChainNetwork;

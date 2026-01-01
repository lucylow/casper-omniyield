import { Layers, TrendingUp, Shield, Zap, Percent, Globe, Star } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Multi-Chain Aggregation',
    description: 'Automatically allocate funds across Ethereum, Polygon, BSC, and Casper networks',
    stats: '4+ chains',
    color: 'from-primary to-blue-400',
    tracks: ['Main Track', 'Interoperability'],
  },
  {
    icon: TrendingUp,
    title: 'Smart Rebalancing',
    description: 'AI-powered algorithms continuously optimize allocations for maximum yield',
    stats: '24/7 optimization',
    color: 'from-accent to-emerald-400',
    tracks: ['Main Track'],
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Built on Casper Network with institutional-grade security and multi-sig protection',
    stats: '100% secure',
    color: 'from-secondary to-purple-400',
    tracks: ['Main Track'],
  },
  {
    icon: Zap,
    title: 'Instant Liquidity',
    description: 'Withdraw your funds anytime with minimal fees and no lock-up periods',
    stats: '< 30s withdrawals',
    color: 'from-red-500 to-orange-400',
    tracks: [],
  },
  {
    icon: Percent,
    title: 'Auto-Compounding',
    description: 'All yields are automatically reinvested to maximize compound growth',
    stats: 'Daily compounding',
    color: 'from-orange-500 to-yellow-400',
    tracks: [],
  },
  {
    icon: Globe,
    title: 'Cross-Chain Bridge',
    description: 'Seamless asset movement between chains using decentralized bridges',
    stats: '0 slippage',
    color: 'from-pink-500 to-rose-400',
    tracks: [],
  },
];

const techStack = [
  { name: 'Rust Smart Contracts', color: 'from-orange-600 to-orange-400' },
  { name: 'Odra Framework', color: 'from-primary to-blue-400' },
  { name: 'WebAssembly', color: 'from-purple-600 to-purple-400' },
  { name: 'Casper SDK', color: 'from-accent to-emerald-400' },
  { name: 'CSPR.click', color: 'from-red-500 to-rose-400' },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Why OmniYield Nexus Wins</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for the Casper Hackathon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our solution addresses key hackathon tracks and leverages Casper's unique capabilities
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <span className="glass rounded-lg px-3 py-1 text-xs font-semibold text-foreground">
                  {feature.stats}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              {feature.tracks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {feature.tracks.map((track) => (
                    <span
                      key={track}
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        track === 'Main Track'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-accent/20 text-accent border border-accent/30'
                      }`}
                    >
                      {track}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-8">
            Built with Casper's Tech Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="glass rounded-xl px-5 py-3 flex items-center gap-3 hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {tech.name[0]}
                </div>
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

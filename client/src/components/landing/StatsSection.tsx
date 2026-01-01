const stats = [
  { value: '$25K', label: 'Prize Pool', sublabel: 'Casper Hackathon 2026' },
  { value: '8.5%', label: 'Average APY', sublabel: 'Across all chains' },
  { value: '4+', label: 'Blockchains', sublabel: 'Simultaneous yield' },
  { value: '<1s', label: 'Withdrawals', sublabel: 'Near instant access' },
];

const StatsSection = () => {
  return (
    <section className="py-16 sm:py-20 border-y border-[hsl(var(--border))]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 sm:p-8 text-center group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 group-hover:gradient-text transition-all">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

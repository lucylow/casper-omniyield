import { ArrowRight, Play, Code, Medal, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChainNetwork from './ChainNetwork';

const HeroSection = () => {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Floating shapes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-float"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <Medal className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Casper Hackathon 2026</span>
              <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                $25K Prize
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6">
              Cross-Chain Yield
              <span className="block gradient-text">Optimization</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Deposit once on Casper, earn the highest yields across multiple blockchains. 
              OmniYield Nexus automates cross-chain allocation for maximum returns.
            </p>

            {/* Live Stats */}
            <div className="flex justify-center lg:justify-start gap-8 mb-10">
              <div>
                <div className="text-3xl font-bold text-foreground">355+</div>
                <div className="text-sm text-muted-foreground">Hackers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">24+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  10<span className="text-accent">d</span>
                </div>
                <div className="text-sm text-muted-foreground">Left</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="gap-2">
                Start Earning Yield
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={scrollToDemo}>
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
              <Button variant="ghost" size="lg" className="gap-2">
                <Code className="w-5 h-5" />
                Smart Contracts
              </Button>
            </div>

            {/* Scroll indicator */}
            <div className="hidden lg:flex items-center gap-2 mt-12 text-muted-foreground">
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span className="text-sm">Scroll to explore</span>
            </div>
          </div>

          {/* Chain Network Visualization */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up delay-200">
            <ChainNetwork />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

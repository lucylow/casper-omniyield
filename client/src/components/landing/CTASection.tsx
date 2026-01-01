import { Rocket, Github, Zap, Code, Shield, Lock, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Code, value: '2,500+', label: 'Lines of Code' },
  { icon: Shield, value: '5', label: 'Smart Contracts' },
  { icon: Zap, value: '100%', label: 'Test Coverage' },
];

const CTASection = () => {
  return (
    <section className="py-20 sm:py-28 border-t border-[hsl(var(--border))]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Ready for the Hackathon?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Join us in building the future of cross-chain DeFi on Casper Network. 
          Our complete implementation is ready for the hackathon submission.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button variant="hero" size="lg" className="gap-2">
            <Rocket className="w-5 h-5" />
            Launch Live Demo
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Github className="w-5 h-5" />
            View on GitHub
          </Button>
          <Button variant="ghost" size="lg" className="gap-2">
            <Zap className="w-5 h-5" />
            Casper Docs
          </Button>
        </div>

        {/* Footer notes */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Deployed on Casper Testnet
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Real-time On-chain Data
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Ready for Community Voting
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

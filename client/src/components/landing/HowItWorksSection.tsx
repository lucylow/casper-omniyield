import { Wallet, Coins, Link, TrendingUp, Banknote, ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Connect your Casper wallet using CSPR.click or Casper Wallet extension',
  },
  {
    number: '02',
    icon: Coins,
    title: 'Deposit CSPR',
    description: 'Deposit CSPR into the vault and receive omniYield tokens',
  },
  {
    number: '03',
    icon: Link,
    title: 'Auto-Allocation',
    description: 'Watch funds automatically allocate across multiple blockchains',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Earn Yield',
    description: 'Receive yield from staking, lending, and liquidity provision',
  },
  {
    number: '05',
    icon: Banknote,
    title: 'Withdraw Anytime',
    description: 'Withdraw your CSPR plus accumulated yields instantly',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How OmniYield Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience seamless cross-chain yield optimization in 5 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-4 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 lg:gap-0 lg:flex-col">
              {/* Step Card */}
              <div className="glass rounded-2xl p-6 w-56 text-center group hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl font-extrabold text-muted/30 mb-4">
                  {step.number}
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 group-hover:glow-blue transition-all">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center px-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-30" />
                  <ArrowRight className="w-4 h-4 text-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo CTA */}
        <div className="text-center">
          <Button variant="destructive" size="lg" className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0">
            <Rocket className="w-5 h-5" />
            Try Live Demo on Testnet
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No CSPR needed - Use testnet faucet for free tokens
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

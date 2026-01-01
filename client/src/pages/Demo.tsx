import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink, Github, FileCode, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

const Demo = () => {
  const demoSteps = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Connect your Casper wallet using the Connect Wallet button. For testnet, you can use CSPR.click or Casper Wallet extension.',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      number: '02',
      title: 'Deposit CSPR',
      description: 'Deposit your CSPR tokens into the vault. You will receive oYLD tokens representing your share of the vault.',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      number: '03',
      title: 'Watch Cross-Chain Allocation',
      description: 'The vault automatically allocates your funds across multiple chains to maximize yield.',
      icon: <Globe className="w-6 h-6" />,
    },
    {
      number: '04',
      title: 'Earn Yield',
      description: 'Earn yield from staking, lending, and liquidity provision across Ethereum, Polygon, BSC, and Casper.',
      icon: <FileCode className="w-6 h-6" />,
    },
  ];

  const features = [
    'Live deposit/withdrawal on Casper Testnet',
    'Cross-chain allocation simulation',
    'Real-time yield distribution visualization',
    'Smart contract interaction demonstration',
    'Casper Wallet integration showcase',
    'Transaction history and analytics',
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-6">
          <Play className="w-4 h-4" />
          Live Demo
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          OmniYield Nexus Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience cross-chain yield optimization in action. This demo showcases the full functionality of OmniYield Nexus on Casper Testnet.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl overflow-hidden mb-12">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Demo Video Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              Meanwhile, try the live demo by launching the app
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold transition-all hover:opacity-90"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">How to Use the Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoSteps.map((step, index) => (
            <div key={index} className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6 transition-all hover:border-primary/50">
              <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Demo Features</h3>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Resources</h3>
          <div className="space-y-4">
            <a
              href="https://github.com/omniyield"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-primary/50 group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">GitHub Repository</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://docs.casper.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-primary/50 group"
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Casper Documentation</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://testnet.cspr.live/tools/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-[hsl(var(--border))] transition-all hover:border-primary/50 group"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Testnet Faucet</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/deposit"
          className="flex items-center justify-between p-4 bg-card border border-[hsl(var(--border))] rounded-xl hover:border-primary/50 transition-all group"
        >
          <span className="font-medium text-foreground">Try Deposit</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </Link>
        <Link
          to="/strategies"
          className="flex items-center justify-between p-4 bg-card border border-[hsl(var(--border))] rounded-xl hover:border-primary/50 transition-all group"
        >
          <span className="font-medium text-foreground">View Strategies</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </Link>
        <Link
          to="/activity"
          className="flex items-center justify-between p-4 bg-card border border-[hsl(var(--border))] rounded-xl hover:border-primary/50 transition-all group"
        >
          <span className="font-medium text-foreground">See Activity</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </Link>
      </div>
    </div>
  );
};

export default Demo;

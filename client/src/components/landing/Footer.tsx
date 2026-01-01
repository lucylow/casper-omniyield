import { Zap, Twitter, Github, MessageCircle, Medal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-[hsl(var(--border))]/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">OmniYield Nexus</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Cross-Chain Yield Optimizer for Casper Network
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Project</h4>
            <div className="space-y-3">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
              <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Casper Network</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Testnet Explorer</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Testnet Faucet</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Hackathon</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Official Page</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Rules & Prizes</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Competition Tracks</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Submission Guide</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[hsl(var(--border))]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 OmniYield Nexus. Built for Casper Hackathon 2026.
          </p>
          <div className="flex items-center gap-2 text-sm text-accent">
            <Medal className="w-4 h-4" />
            <span className="font-medium">Official Hackathon Submission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

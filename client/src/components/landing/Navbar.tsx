import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-blue">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold gradient-text">OmniYield</span>
              <span className="text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-md">
                Nexus
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Features
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              How It Works
            </button>
            <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Demo
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="hero" size="sm" className="gap-2">
                Launch App
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass rounded-xl p-4 mb-4 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollTo('features')} className="text-left py-2 text-muted-foreground hover:text-foreground">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="text-left py-2 text-muted-foreground hover:text-foreground">How It Works</button>
              <Link to="/demo" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Demo</Link>
              <Link to="/dashboard" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" className="w-full gap-2">
                  Launch App
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from 'react';
import { Play, CheckCircle, X } from 'lucide-react';

const demoFeatures = [
  'Live deposit/withdrawal on Casper Testnet',
  'Cross-chain allocation simulation',
  'Real-time yield distribution',
  'Smart contract interactions',
  'Casper Wallet integration',
];

const DemoSection = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section id="demo" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Live Demo Walkthrough
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See OmniYield Nexus in action - perfect for hackathon judges
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div
              className="relative aspect-video glass rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              {/* Placeholder gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
              
              {/* Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 group-hover:glow-blue transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mt-6">
                  Click to Watch Demo
                </h3>
                <p className="text-sm text-muted-foreground mt-2 text-center px-4">
                  See how OmniYield Nexus solves cross-chain yield optimization
                </p>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors" />
            </div>
          </div>

          {/* Demo Features */}
          <div className="glass rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-foreground mb-6">
              Demo Highlights
            </h4>
            <div className="space-y-4">
              {demoFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              onClick={() => setShowVideo(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Video player placeholder</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DemoSection;

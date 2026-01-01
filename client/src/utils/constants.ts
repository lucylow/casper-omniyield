export const HACKATHON_INFO = {
  name: 'Casper Hackathon 2026',
  prizePool: '$25,000',
  submissionDeadline: '2026-01-04',
  daysLeft: 10,
  hackers: 355,
  projects: 24,
  tracks: [
    {
      name: 'Main Track',
      prizes: ['1st: $10,000', '2nd: $7,000', '3rd: $3,000'],
      description: 'Open to all project types - DeFi, NFTs, DAOs, gaming, enterprise solutions'
    },
    {
      name: 'Interoperability Track',
      prizes: ['Best Interoperability App: $2,500'],
      description: 'Projects focusing on cross-chain solutions'
    },
    {
      name: 'Liquid Staking Track',
      prizes: ['Best Liquid Staking dApp: $2,500'],
      description: 'Projects bringing liquid staking innovations'
    }
  ]
};

export const CASPER_NETWORK = {
  name: 'Casper Network',
  description: 'Enterprise-grade, proof-of-stake blockchain',
  features: [
    'Rust-based smart contracts',
    'WebAssembly execution',
    'Predictable gas fees',
    'High security',
    'Developer-friendly tooling'
  ],
  resources: {
    documentation: 'https://docs.casper.network',
    testnet: 'https://testnet.cspr.live',
    faucet: 'https://testnet.cspr.live/tools/faucet',
    wallet: 'https://cspr.click'
  }
};

export const OMNIYIELD_FEATURES = [
  {
    title: 'Cross-Chain Yield Aggregation',
    description: 'Aggregates highest yields from multiple blockchains',
    icon: '🌐',
    benefits: [
      'Access to Ethereum, Polygon, BSC yields',
      'Automatic yield comparison',
      'Optimal allocation algorithms'
    ]
  },
  {
    title: 'Smart Auto-Rebalancing',
    description: 'AI-powered allocation optimization',
    icon: '⚖️',
    benefits: [
      '24/7 portfolio monitoring',
      'Dynamic allocation adjustments',
      'Risk-adjusted returns'
    ]
  },
  {
    title: 'Enterprise Security',
    description: 'Built on Casper Network with institutional-grade security',
    icon: '🛡️',
    benefits: [
      'Multi-signature protection',
      'Time-lock withdrawals',
      'Emergency pause functionality'
    ]
  },
  {
    title: 'Instant Liquidity',
    description: 'Withdraw funds anytime with minimal fees',
    icon: '💧',
    benefits: [
      'No lock-up periods',
      '< 30 second withdrawals',
      'Low withdrawal fees'
    ]
  }
];

export const TECHNICAL_STACK = [
  {
    name: 'Rust',
    description: 'Smart contract development',
    color: '#CE422B'
  },
  {
    name: 'Odra Framework',
    description: 'Casper smart contract framework',
    color: '#0085FF'
  },
  {
    name: 'WebAssembly',
    description: 'Contract execution environment',
    color: '#654FF0'
  },
  {
    name: 'Casper SDK',
    description: 'JavaScript/TypeScript integration',
    color: '#00D4AA'
  },
  {
    name: 'CSPR.click',
    description: 'Wallet integration',
    color: '#FF6B6B'
  },
  {
    name: 'React + Vite',
    description: 'Frontend framework',
    color: '#61DAFB'
  }
];

export const DEMO_FEATURES = [
  'Live deposit/withdrawal on Casper Testnet',
  'Cross-chain allocation simulation',
  'Real-time yield distribution visualization',
  'Smart contract interaction demonstration',
  'Casper Wallet integration showcase',
  'Transaction history and analytics'
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/omniyield',
  twitter: 'https://twitter.com/omniyield',
  telegram: 'https://t.me/omniyield',
  discord: 'https://discord.gg/omniyield',
  youtube: 'https://youtube.com/omniyield'
};

export const CHAIN_DATA = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: '⟠' },
  { id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5', icon: '⬡' },
  { id: 56, name: 'BSC', symbol: 'BNB', color: '#F0B90B', icon: '⬢' },
  { id: 0, name: 'Casper', symbol: 'CSPR', color: '#0085FF', icon: '◆' },
];

export const formatters = {
  formatCSPR: (motes: string | number): string => {
    const cspr = parseFloat(motes.toString()) / 1e9;
    if (cspr >= 1000000) {
      return (cspr / 1000000).toFixed(2) + 'M';
    } else if (cspr >= 1000) {
      return (cspr / 1000).toFixed(2) + 'K';
    }
    return cspr.toFixed(4);
  },
  
  formatAddress: (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },
  
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  },
  
  formatPercent: (value: number): string => {
    return `${value.toFixed(2)}%`;
  },
  
  formatDate: (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  },
  
  formatTime: (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

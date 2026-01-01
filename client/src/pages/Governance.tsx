import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Vote, Shield, Users, Clock, ThumbsUp, ThumbsDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  endTime: Date;
  proposer: string;
}

const Governance = () => {
  const { isConnected, wallet } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  // Mock role resolution
  const getRole = (): 'user' | 'operator' | 'governor' => {
    if (!wallet?.publicKey) return 'user';
    if (wallet.publicKey.endsWith('abc')) return 'governor';
    if (wallet.publicKey.endsWith('def')) return 'operator';
    return 'user';
  };

  const role = getRole();

  const proposals: Proposal[] = [
    {
      id: 1,
      title: 'Increase Ethereum Allocation',
      description: 'Proposal to increase Ethereum chain allocation from 40% to 50%',
      status: 'active',
      votesFor: 1250000,
      votesAgainst: 450000,
      endTime: new Date(Date.now() + 86400000 * 3),
      proposer: 'casper1q...xyz',
    },
    {
      id: 2,
      title: 'Add Arbitrum Strategy',
      description: 'Integrate Arbitrum L2 for additional yield opportunities',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      endTime: new Date(Date.now() + 86400000 * 7),
      proposer: 'casper1q...abc',
    },
    {
      id: 3,
      title: 'Reduce Performance Fee',
      description: 'Lower performance fee from 20% to 15%',
      status: 'passed',
      votesFor: 2100000,
      votesAgainst: 300000,
      endTime: new Date(Date.now() - 86400000),
      proposer: 'casper1q...def',
    },
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-green-400/20 text-green-400',
    passed: 'bg-blue-400/20 text-blue-400',
    rejected: 'bg-red-400/20 text-red-400',
    pending: 'bg-yellow-400/20 text-yellow-400',
  };

  const formatVotes = (votes: number) => {
    if (votes >= 1000000) return `${(votes / 1000000).toFixed(1)}M`;
    if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
    return votes.toString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Protocol Governance</h1>
        <p className="text-muted-foreground">Participate in protocol decisions and vote on proposals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Vote className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Proposals</span>
          </div>
          <p className="text-2xl font-bold text-foreground">1</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Total Voters</span>
          </div>
          <p className="text-2xl font-bold text-foreground">342</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Your Role</span>
          </div>
          <p className="text-2xl font-bold text-foreground capitalize">{role}</p>
        </div>
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Voting Power</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{isConnected ? '1,000' : '0'}</p>
        </div>
      </div>

      {/* Role-based Actions */}
      {role === 'governor' && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-4 mb-8">
          <p className="text-sm text-primary font-medium mb-3">Governor Actions Available</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              Create Proposal
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80">
              Pause Vault
            </button>
          </div>
        </div>
      )}

      {role === 'operator' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-400 font-medium mb-3">Operator Actions Available</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:opacity-90">
            Trigger Rebalance
          </button>
        </div>
      )}

      {/* Proposals */}
      <div className="bg-card border border-[hsl(var(--border))] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Proposals</h2>
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const totalVotes = proposal.votesFor + proposal.votesAgainst;
            const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
            
            return (
              <div key={proposal.id} className="p-5 bg-muted/30 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[proposal.status])}>
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{proposal.description}</p>
                  </div>
                  {proposal.status === 'active' && isConnected && (
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30">
                        <ThumbsUp className="w-4 h-4" />
                        For
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30">
                        <ThumbsDown className="w-4 h-4" />
                        Against
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Vote Progress */}
                {totalVotes > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>For: {formatVotes(proposal.votesFor)}</span>
                      <span>Against: {formatVotes(proposal.votesAgainst)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400" 
                        style={{ width: `${forPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {proposal.status === 'active' 
                      ? `Ends ${proposal.endTime.toLocaleDateString()}`
                      : `Ended ${proposal.endTime.toLocaleDateString()}`
                    }
                  </span>
                  <span>Proposer: {proposal.proposer}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isConnected && (
        <div className="mt-8 text-center p-6 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">Connect your wallet to participate in governance</p>
        </div>
      )}
    </div>
  );
};

export default Governance;

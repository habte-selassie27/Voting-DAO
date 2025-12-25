import React from 'react';
import { Button, IconButton } from '@mui/material';
import {
  Shield,
  Add,
  LockOutlined,
  PlaylistAddCheck,
  Security,
  BarChart,
  AccessTime,
  PeopleAltOutlined,
  TrendingUp,
  KeyboardArrowDown
} from '@mui/icons-material';

const VotingPlatform = () => {
  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 md:p-12 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <div className="bg-[#003355] p-4 rounded-full mb-6">
          <Shield sx={{ fontSize: 40, color: '#2196f3' }} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy-First Voting Platform</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Vote with complete privacy using Zama's Fully Homomorphic Encryption. 
          Your choices remain encrypted throughout the entire voting process.
        </p>

        {/* Action Bar */}
        <div className="flex items-center gap-4 mt-8 bg-[#1a1a1a] p-2 rounded-xl border border-gray-800">
          <Button 
            variant="contained" 
            startIcon={<Add />}
            className="bg-[#0062ff] hover:bg-[#0052d4] capitalize py-2 px-6 rounded-lg"
          >
            Create Poll
          </Button>
          <div className="flex items-center gap-3 px-4">
            <span className="font-mono text-sm">0.042 ETH</span>
            <div className="flex items-center gap-2 bg-[#2a2a2a] py-1 px-3 rounded-full cursor-pointer hover:bg-[#333]">
              <div className="w-5 h-5 bg-red-500 rounded-full" />
              <span className="text-sm font-mono text-gray-300">0x70...8195</span>
              <KeyboardArrowDown fontSize="small" className="text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard 
          icon={<LockOutlined className="text-green-500" />}
          iconBg="bg-green-950/30"
          title="Fully Encrypted"
          desc="All votes are encrypted using FHE technology, ensuring complete privacy"
        />
        <FeatureCard 
          icon={<PlaylistAddCheck className="text-blue-400" />}
          iconBg="bg-blue-950/30"
          title="Transparent Results"
          desc="Results are computed on encrypted data without revealing individual votes"
        />
        <FeatureCard 
          icon={<Security className="text-purple-500" />}
          iconBg="bg-purple-950/30"
          title="Decentralized"
          desc="Built on blockchain technology for trustless and censorship-resistant voting"
        />
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Polls" value="3" sub="0% currently active" icon={<BarChart className="text-blue-400" />} />
        <StatCard title="Active Polls" value="0" icon={<AccessTime className="text-green-400" />} bgColor="bg-[#052e16]" />
        <StatCard title="Total Votes" value="0" icon={<PeopleAltOutlined className="text-purple-400" />} />
        <StatCard title="Completed" value="3" sub="Results available for viewing" icon={<TrendingUp className="text-orange-400" />} bgColor="bg-[#431407]" />
      </div>
    </div>
  );
};

// Sub-component for Feature Cards
const FeatureCard = ({ icon, title, desc, iconBg }) => (
  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 text-center flex flex-col items-center transition-transform hover:scale-[1.02]">
    <div className={`${iconBg} p-3 rounded-lg mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

// Sub-component for Stats
const StatCard = ({ title, value, sub, icon, bgColor = "bg-[#1a1a1a]" }) => (
  <div className={`${bgColor} p-6 rounded-2xl border border-gray-800 flex justify-between items-start relative overflow-hidden`}>
    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h4 className="text-3xl font-bold mb-2">{value}</h4>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
    <div className="bg-black/20 p-2 rounded-lg">
      {icon}
    </div>
  </div>
);

export default VotingPlatform;
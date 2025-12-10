import ConfidentialVotingABI from "../../../artifacts/contracts/ConfidentialVoting.sol/ConfidentialVoting.json";
import ProposalManagerABI from "../../../artifacts/contracts/ProposalManager.sol/ProposalManager.json";

// -------------------------------

export const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

// CHAIN / RPC SETTINGS
// -------------------------------
// export const SEPOLIA_RPC_URL =
//   import.meta.env.VITE_RPC_URL || "https://sepolia.infura.io/v3/ec140a863bce4f919d107d45e27a0319";
export const SEPOLIA_RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://rpc.sepolia.org";


export const CHAIN_ID = 11155111; // Sepolia

// -------------------------------
// FHE / RELAYER SETTINGS
// -------------------------------
export const FHEVM_RPC_URL = SEPOLIA_RPC_URL; // using same network for now

// -------------------------------
// CONTRACT ADDRESSES (FROM YOU)
// -------------------------------
export const CONFIDENTIAL_VOTING_ADDRESS =
  "0xA60DbA1e5F8267C7C704223e05A455B033037aaa";

export const PROPOSAL_MANAGER_ADDRESS =
  " 0x4123F4B3956C4b9D88f1E19879487FD3EA4DBE8F";

// Optional: If deployed
export const TALLY_ENCRYPTION_ADDRESS =
  "0x5F7Bf6c5510310AAdedD0fbc9fF2681a346f5762";





// Replace YOUR_ALCHEMY_API_KEY with your actual Alchemy key
export const PROPOSAL_MANAGER_RPC = 'https://eth-sepolia.g.alchemy.com/v2/87D1DMHZHIB9uDOlQEUXr'

export const PROPOSAL_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]






// -------------------------------
// ABIs
// -------------------------------
export const CONFIDENTIAL_VOTING_ABI = ConfidentialVotingABI.abi;
//export const PROPOSAL_MANAGER_ABI = ProposalManagerABI.abi;

// -------------------------------
// VOTE VALUES
// -------------------------------
export const VOTE_OPTIONS = {
  0: "Against",
  1: "For",
  2: "Abstain",
};

// List used in UI selectors
export const VOTE_CHOICES = [
  { label: "Against", value: 0 },
  { label: "For", value: 1 },
  { label: "Abstain", value: 2 },
];


export const CONTRACTS = {
  proposalManager: {
    address: PROPOSAL_MANAGER_ADDRESS,
    abi: PROPOSAL_MANAGER_ABI,
  },
  confidentialVoting: {
    address: CONFIDENTIAL_VOTING_ADDRESS,
    abi: CONFIDENTIAL_VOTING_ABI,
  },
};

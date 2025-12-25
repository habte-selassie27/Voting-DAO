// src/contracts/dao.js

export const DAO_ADDRESS = "0xD23F64cC51145375a6cDE8e3f53321583acd3D46";

export const DAO_ABI = [
  
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "ProposalClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "startTime",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "endTime",
          "type": "uint64"
        }
      ],
      "name": "ProposalCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "ProposalFinalized",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "closeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint64",
          "name": "startTime",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "endTime",
          "type": "uint64"
        }
      ],
      "name": "createProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "finalizeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllProposals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "startTime",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "endTime",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "finalized",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct ProposalManager.Proposal[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getProposal",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "startTime",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "endTime",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "finalized",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct ProposalManager.Proposal",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "isVotingActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposalCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "proposals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint64",
          "name": "startTime",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "endTime",
          "type": "uint64"
        },
        {
          "internalType": "bool",
          "name": "finalized",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  

  // {
  //   "inputs": [],
  //   "name": "owner",
  //   "outputs": [
  //     { "internalType": "address", "name": "", "type": "address" }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // {
  //   "inputs": [
  //     { "internalType": "string", "name": "title", "type": "string" },
  //     { "internalType": "string", "name": "description", "type": "string" }
  //   ],
  //   "name": "createProposal",
  //   "outputs": [],
  //   "stateMutability": "nonpayable",
  //   "type": "function"
  // },
  // {
  //   "inputs": [
  //     { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
  //   ],
  //   "name": "closeProposal",
  //   "outputs": [],
  //   "stateMutability": "nonpayable",
  //   "type": "function"
  // },
  // {
  //   "inputs": [],
  //   "name": "proposalCounter",
  //   "outputs": [
  //     { "internalType": "uint256", "name": "", "type": "uint256" }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // {
  //   "inputs": [
  //     { "internalType": "uint256", "name": "", "type": "uint256" }
  //   ],
  //   "name": "proposals",
  //   "outputs": [
  //     { "internalType": "uint256", "name": "id", "type": "uint256" },
  //     { "internalType": "string", "name": "title", "type": "string" },
  //     { "internalType": "string", "name": "description", "type": "string" },
  //     { "internalType": "address", "name": "creator", "type": "address" },
  //     { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
  //     { "internalType": "bool", "name": "active", "type": "bool" }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // {
  //   "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
  //   "name": "getProposal",
  //   "outputs": [
  //     {
  //       "components": [
  //         { "internalType": "uint256", "name": "id", "type": "uint256" },
  //         { "internalType": "string", "name": "title", "type": "string" },
  //         { "internalType": "string", "name": "description", "type": "string" },
  //         { "internalType": "address", "name": "creator", "type": "address" },
  //         { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
  //         { "internalType": "bool", "name": "active", "type": "bool" }
  //       ],
  //       "internalType": "struct ProposalManager.Proposal",
  //       "name": "",
  //       "type": "tuple"
  //     }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // {
  //   "inputs": [],
  //   "name": "getAllProposals",
  //   "outputs": [
  //     {
  //       "components": [
  //         { "internalType": "uint256", "name": "id", "type": "uint256" },
  //         { "internalType": "string", "name": "title", "type": "string" },
  //         { "internalType": "string", "name": "description", "type": "string" },
  //         { "internalType": "address", "name": "creator", "type": "address" },
  //         { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
  //         { "internalType": "bool", "name": "active", "type": "bool" }
  //       ],
  //       "internalType": "struct ProposalManager.Proposal[]",
  //       "name": "",
  //       "type": "tuple[]"
  //     }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // },
  // {
  //   "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
  //   "name": "transferOwnership",
  //   "outputs": [],
  //   "stateMutability": "nonpayable",
  //   "type": "function"
  // }
];


// export const DAO_ABI = [
//   {
//     "inputs": [
//       { "internalType": "string", "name": "title", "type": "string" },
//       { "internalType": "string", "name": "description", "type": "string" }
//     ],
//     "name": "createProposal",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "proposalId", "type": "uint256" }],
//     "name": "closeProposal",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "proposalCounter",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "name": "proposals",
//     "outputs": [
//       { "internalType": "uint256", "name": "id", "type": "uint256" },
//       { "internalType": "string", "name": "title", "type": "string" },
//       { "internalType": "string", "name": "description", "type": "string" },
//       { "internalType": "address", "name": "creator", "type": "address" },
//       { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
//       { "internalType": "bool", "name": "active", "type": "bool" }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
//import "@nomicfoundation/hardhat-toolbox";

//import path from "path";

const VITE_PRIVATE_KEY = process.env.VITE_PRIVATE_KEY;
const VITE_RPC_URL = process.env.VITE_RPC_URL;
const VITE_CHAIN_ID = process.env.VITE_CHAIN_ID;

if (!VITE_PRIVATE_KEY || !VITE_RPC_URL) {
  throw new Error("Set VITE_PRIVATE_KEY and VITE_RPC_URL in .env");
}

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
  },
  networks: {
    sepolia: {
      url: VITE_RPC_URL,
      accounts: [VITE_PRIVATE_KEY],
      chainId: parseInt(VITE_CHAIN_ID || "11155111", 10),
      // type: "http",
    },
  },


  // 🔥 THIS WAS MISSING (CAUSE OF YOUR ERROR)
  namedAccounts: {
    deployer: {
      default: 0,     // means: use accounts[0]
    },
  },

  
};

export default config;



// import "@fhevm/hardhat-plugin";
// import "@nomicfoundation/hardhat-chai-matchers";
// import "@nomicfoundation/hardhat-ethers";
// import "@nomicfoundation/hardhat-verify";
// import "@typechain/hardhat";
// import "hardhat-deploy";
// import "hardhat-gas-reporter";
// import type { HardhatUserConfig } from "hardhat/config";
// import { vars } from "hardhat/config";
// import "solidity-coverage";

// import "./tasks/accounts";
// import "./tasks/FHECounter";

// // Run 'npx hardhat vars setup' to see the list of variables that need to be set

// const MNEMONIC: string = vars.get("MNEMONIC", "test test test test test test test test test test test junk");
// const INFURA_API_KEY: string = vars.get("INFURA_API_KEY", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");

// const config: HardhatUserConfig = {
//   defaultNetwork: "hardhat",
//   namedAccounts: {
//     deployer: 0,
//   },
//   etherscan: {
//     apiKey: {
//       sepolia: vars.get("ETHERSCAN_API_KEY", ""),
//     },
//   },
//   gasReporter: {
//     currency: "USD",
//     enabled: process.env.REPORT_GAS ? true : false,
//     excludeContracts: [],
//   },
//   networks: {
//     hardhat: {
//       accounts: {
//         mnemonic: MNEMONIC,
//       },
//       chainId: 31337,
//     },
//     anvil: {
//       accounts: {
//         mnemonic: MNEMONIC,
//         path: "m/44'/60'/0'/0/",
//         count: 10,
//       },
//       chainId: 31337,
//       url: "http://localhost:8545",
//     },
//     sepolia: {
//       accounts: {
//         mnemonic: MNEMONIC,
//         path: "m/44'/60'/0'/0/",
//         count: 10,
//       },
//       chainId: 11155111,
//       url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
//     },
//   },
//   paths: {
//     artifacts: "./artifacts",
//     cache: "./cache",
//     sources: "./contracts",
//     tests: "./test",
//   },
//   solidity: {
//     version: "0.8.27",
//     settings: {
//       metadata: {
//         // Not including the metadata hash
//         // https://github.com/paulrberg/hardhat-template/issues/31
//         bytecodeHash: "none",
//       },
//       // Disable the optimizer when debugging
//       // https://hardhat.org/hardhat-network/#solidity-optimizer-support
//       optimizer: {
//         enabled: true,
//         runs: 800,
//       },
//       evmVersion: "cancun",
//     },
//   },
//   typechain: {
//     outDir: "types",
//     target: "ethers-v6",
//   },
// };

// export default config;

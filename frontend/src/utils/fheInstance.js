// // src/utils/fheInstance.js
// import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/web';

// let instance = null;

// export async function getFHEInstance() {
//   if (instance) return instance;

//   try {
//     // 1. Load the WASM
//     await initSDK();

//     // 2. Create the FHE instance
//     instance = await createInstance({
//       ...SepoliaConfig,
//       network: window.ethereum,
//     });

//     console.log('FHE SDK initialized:', instance);
//     return instance;
//   } catch (err) {
//     console.error('Error initializing FHE SDK:', err);
//     throw err;
//   }
// }
// src/utils/fheInstance.js

import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk';
import { ethers } from 'ethers';
import ConfidentialVotingArtifact from '../../../artifacts/contracts/ConfidentialVoting.sol/ConfidentialVoting.json';
import TallyDecryptionArtifact from '../../../artifacts/contracts/TallyDecryption.sol/TallyDecryption.json';

// FHE instance singleton
let instance = null;

/**
 * Initialize and return the FHE instance
 */
export async function getFHEInstance() {
  if (instance) return instance;

  try {
    // 1️⃣ Load the TFHE WASM
    await initSDK();

    // 2️⃣ Create FHE instance with Sepolia config + window.ethereum
    instance = await createInstance({
      ...SepoliaConfig,
      network: window.ethereum,
    });

    console.log('FHE SDK initialized:', instance);
    return instance;
  } catch (err) {
    console.error('Error initializing FHE SDK:', err);
    throw err;
  }
}

/**
 * Off-chain decryption workflow for a proposal's tally
 * @param {string} votingContractAddress - Deployed ConfidentialVoting contract
 * @param {string} decryptionContractAddress - Deployed TallyDecryption contract
 * @param {number} proposalId - ID of the proposal to decrypt
 */
export async function decryptTally(votingContractAddress, decryptionContractAddress, proposalId) {
  if (!instance) {
    instance = await getFHEInstance(); // Ensure FHE instance is initialized
  }

  // 1️⃣ Connect to Ethereum provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // 2️⃣ Contract instances
  const votingContract = new ethers.Contract(
    votingContractAddress,
    ConfidentialVotingArtifact.abi,
    signer
  );

  const decryptionContract = new ethers.Contract(
    decryptionContractAddress,
    TallyDecryptionArtifact.abi,
    signer
  );

  // 3️⃣ Get the encrypted tally from the voting contract
  const encryptedTallies = [await votingContract.encryptedTallies(proposalId)];

  // 4️⃣ Perform off-chain public decryption using FHE instance
  const results = await instance.publicDecrypt(encryptedTallies);
  const clearTally = results.clearValues[encryptedTallies[0]]; // decrypted number
  const decryptionProof = results.decryptionProof; // zero-knowledge proof for on-chain verification

  // 5️⃣ Submit the decrypted tally + proof on-chain
  const tx = await decryptionContract.finalizeTally(
    proposalId,
    Number(clearTally),
    decryptionProof,
    encryptedTallies[0]
  );

  await tx.wait();

  console.log('Tally decrypted and finalized:', clearTally.toString());
  return clearTally;
}

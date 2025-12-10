import { RelayerClient } from "@zama-fhe/relayer-sdk";
import { FHEVM_RPC_URL } from "../utils/constants.js";

const relayer = new RelayerClient({ rpc: FHEVM_RPC_URL });

/**
 * Fetches the current public key from TallyEncryption contract
 */
export const fetchPublicKey = async () => {
  try {
    const pk = await relayer.getPublicKey();
    return pk;
  } catch (err) {
    console.error("Failed to fetch FHE public key:", err);
    return null;
  }
};

/**
 * Encrypts a vote value using Relayer SDK
 * @param {number | bigint} voteValue
 */
export const encryptVote = async (voteValue) => {
  try {
    const publicKey = await fetchPublicKey();
    if (!publicKey) throw new Error("No public key available");

    const ciphertext = await relayer.encrypt(voteValue, publicKey);
    return ciphertext;
  } catch (err) {
    console.error("Vote encryption failed:", err);
    return null;
  }
};

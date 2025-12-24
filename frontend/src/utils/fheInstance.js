
let fheInstance = null;

if (!window.ethereum) {
  throw new Error("Ethereum provider not found");
}

export async function getFheInstance() {
  if (fheInstance) return fheInstance;

  // Dynamically load the UMD SDK if it doesn't exist
  if (!window.relayerSDK) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        "https://cdn.zama.org/relayer-sdk-js/0.3.0-8/relayer-sdk-js.umd.cjs";
      s.type = "text/javascript";
      s.onload = () => {
        // sometimes relayerSDK takes a tick to attach, wait a tiny bit
        setTimeout(() => {
          if (!window.relayerSDK) reject("relayerSDK not found after load");
          else resolve();
        }, 50);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Now window.relayerSDK must exist
  const { initSDK, createInstance, SepoliaConfig } = window.relayerSDK;

  if (!initSDK || !createInstance) {
    throw new Error("Relayer SDK failed to load correctly");
  }

  // Initialize the SDK
  await initSDK();

  // Create instance
  fheInstance = await createInstance({
    ...SepoliaConfig,
    // or your manual addresses & relayerUrl
    chainId: 11155111,
    relayerUrl: "https://relayer.testnet.zama.org",
    // ...other contract addresses
    network: window.ethereum,
  });

  return fheInstance;
}



/**
 * Step 2 — Publicly decrypt encrypted tally via relayer
 *
 * @param encryptedTally bytes32 handle from ConfidentialVoting.encryptedTallies
 * @returns { clearTally, proof }
 */
export async function publicDecryptTally(encryptedTally) {
  const fhe = getFheInstance();
  if (!fhe) {
    throw new Error('FHE instance not initialized');
  }

  if (
    typeof encryptedTally !== 'string' ||
    !encryptedTally.startsWith('0x') ||
    encryptedTally.length !== 66
  ) {
    throw new Error('Invalid encrypted tally handle');
  }

  try {
    /**
     * publicDecrypt returns:
     * {
     *   values: { [handle]: number },
     *   proof: bytes
     * }
     */
    const result = await fhe.publicDecrypt([encryptedTally]);

    const clearTally = Number(result.values[encryptedTally]);
    const proof = result.proof;

    console.log('[FHE] public decrypt success', {
      encryptedTally,
      clearTally,
    });

    return { clearTally, proof };
  } catch (error) {
    const msg = String(error?.message || '');
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new Error('Zama relayer temporarily unavailable');
    }
    throw error;
  }
}

/**
 * Step 3 — Finalize tally on-chain
 *
 * Calls TallyDecryption.finalizeTally(...)
 */
export async function finalizeTallyOnChain({
  tallyDecryptionContract,
  proposalId,
  clearTally,
  proof,
  encryptedTally,
}) {
  if (!tallyDecryptionContract) {
    throw new Error('TallyDecryption contract instance required');
  }

  const tx = await tallyDecryptionContract.finalizeTally(
    proposalId,
    clearTally,
    proof,
    encryptedTally
  );

  await tx.wait();

  console.log('[DAO] Tally finalized on-chain', {
    proposalId: String(proposalId),
    clearTally,
  });

  return clearTally;
}

/**
 * Full DAO flow helper:
 * 1. Read encrypted tally
 * 2. Public decrypt via relayer
 * 3. Finalize on-chain
 */
export async function decryptAndFinalizeProposal({
  votingContract,
  tallyDecryptionContract,
  proposalId,
}) {
  // Step 1: read encrypted tally
  const encryptedTally =
    await votingContract.encryptedTallies(proposalId);

  console.log('[DAO] encrypted tally', {
    proposalId: String(proposalId),
    encryptedTally,
  });

  // Step 2: public decrypt
  const { clearTally, proof } =
    await publicDecryptTally(encryptedTally);

  // Step 3: finalize on-chain
  return finalizeTallyOnChain({
    tallyDecryptionContract,
    proposalId,
    clearTally,
    proof,
    encryptedTally,
  });
}

// /* eslint-disable no-unused-vars */
// import { useState, useCallback } from "react";
// import useSWR from "swr";
// import { ethers } from "ethers";
// import { useWallet } from "../useWallet.js";

// import {
//   PROPOSAL_MANAGER_ADDRESS,
//   PROPOSAL_MANAGER_ABI,
//   CONFIDENTIAL_VOTING_ADDRESS,
//   CONFIDENTIAL_VOTING_ABI,
// } from "../utils/constants.js";

// /* -----------------------------------
//    Helpers: Get Contract
// ------------------------------------ */

// function useContract(address, abi, provider) {
//   if (!provider) return null;
//   return new ethers.Contract(address, abi, provider);
// }

// /* -----------------------------------
//    Get total number of proposals
// ------------------------------------ */

// export function useProposalCount() {
//   const { provider } = useWallet();
//   const contract = useContract(PROPOSAL_MANAGER_ADDRESS, PROPOSAL_MANAGER_ABI, provider);

//   const fetcher = async () => {
//     if (!contract) return 0;
//     const count = await contract.proposalCounter();
//     return Number(count);
//   };

//   const { data, error, isValidating } = useSWR(
//     contract ? "proposalCount" : null,
//     fetcher,
//     { refreshInterval: 3000 }
//   );

//   return {
//     count: data || 0,
//     isLoading: !data && !error,
//     isError: error,
//   };
// }

// /* -----------------------------------
//    Fetch a single proposal
// ------------------------------------ */

// export function useProposal(proposalId) {
//   const { provider } = useWallet();
//   const contract = useContract(PROPOSAL_MANAGER_ADDRESS, PROPOSAL_MANAGER_ABI, provider);

//   const fetcher = async () => {
//     if (!contract || !proposalId) return null;
//     return await contract.proposals(proposalId);
//   };

//   const { data, error } = useSWR(
//     proposalId ? `proposal-${proposalId}` : null,
//     fetcher,
//     { refreshInterval: 4000 }
//   );

//   return {
//     proposal: data,
//     isLoading: !data && !error,
//     isError: error,
//   };
// }

// /* -----------------------------------
//    Fetch all proposals
// ------------------------------------ */

// export function useAllProposals(proposalCount) {
//   const { provider } = useWallet();
//   const contract = useContract(PROPOSAL_MANAGER_ADDRESS, PROPOSAL_MANAGER_ABI, provider);

//   const fetcher = async () => {
//     if (!contract || !proposalCount || proposalCount < 1) return [];

//     let all = [];
//     for (let i = 1; i <= proposalCount; i++) {
//       const p = await contract.proposals(i);
//       all.push(p);
//     }
//     return all;
//   };

//   const { data, error } = useSWR(
//     contract && proposalCount ? `allProposals-${proposalCount}` : null,
//     fetcher,
//     { refreshInterval: 4000 }
//   );

//   return {
//     proposals: data || [],
//     isLoading: !data && !error,
//     isError: error,
//   };
// }

// /* -----------------------------------
//    Fetch encrypted tally
// ------------------------------------ */

// export function useEncryptedTally(proposalId) {
//   const { provider } = useWallet();
//   const contract = useContract(CONFIDENTIAL_VOTING_ADDRESS, CONFIDENTIAL_VOTING_ABI, provider);

//   const fetcher = async () => {
//     if (!contract || !proposalId) return null;
//     return await contract.getEncryptedTally(proposalId);
//   };

//   const { data, error } = useSWR(
//     proposalId ? `encryptedTally-${proposalId}` : null,
//     fetcher,
//     { refreshInterval: 3000 }
//   );

//   return {
//     tally: data,
//     isLoading: !data && !error,
//     isError: error,
//   };
// }

// /* -----------------------------------
//    Submit encrypted vote (write)
// ------------------------------------ */

// export function useSubmitEncryptedVote() {
//   const { provider, signer } = useWallet();
//   const contract = signer
//     ? new ethers.Contract(CONFIDENTIAL_VOTING_ADDRESS, CONFIDENTIAL_VOTING_ABI, signer)
//     : null;

//   const [txHash, setTxHash] = useState(null);
//   const [isLoading, setLoading] = useState(false);
//   const [isSuccess, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const submitVoteTx = useCallback(
//     async (proposalId, ciphertext) => {
//       if (!contract) return;

//       try {
//         setLoading(true);
//         setError(null);

//         const tx = await contract.submitEncryptedVote(proposalId, ciphertext);
//         setTxHash(tx.hash);

//         const receipt = await tx.wait();
//         setSuccess(receipt.status === 1);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [contract]
//   );

//   return { submitVoteTx, txHash, isLoading, isSuccess, error };
// }

// /* -----------------------------------
//    Create a new proposal (write)
// ------------------------------------ */

// export function useCreateProposal() {
//   const { provider, signer } = useWallet();
//   const contract = signer
//     ? new ethers.Contract(PROPOSAL_MANAGER_ADDRESS, PROPOSAL_MANAGER_ABI, signer)
//     : null;

//   const [txHash, setTxHash] = useState(null);
//   const [isLoading, setLoading] = useState(false);
//   const [isSuccess, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const createProposalTx = useCallback(
//     async (title, description) => {
//       if (!contract) return;

//       try {
//         setLoading(true);
//         setError(null);

//         const tx = await contract.createProposal(title, description);
//         setTxHash(tx.hash);

//         const receipt = await tx.wait();
//         setSuccess(receipt.status === 1);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [contract]
//   );

//   return { createProposalTx, txHash, isLoading, isSuccess, error };
// }
import { useState } from "react";
import { useEffect } from "react";
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import { useWalletClient } from "wagmi";
import { PROPOSAL_MANAGER_ADDRESS, PROPOSAL_MANAGER_ABI, CONFIDENTIAL_VOTING_ADDRESS, CONFIDENTIAL_VOTING_ABI } from "../utils/constants.js";
// useProposals.js
//import {  useWalletClient } from "wagmi";
//import { usePrepareContractWrite} from "wagmi";
//import { CONFIDENTIAL_VOTING_ADDRESS, CONFIDENTIAL_VOTING_ABI } from "../utils/constants.js";

/* -----------------------------------
   Get total number of proposals
------------------------------------ */

export function useProposalCount() {
 // const provider = useProvider();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: PROPOSAL_MANAGER_ADDRESS,
    abi: PROPOSAL_MANAGER_ABI,
    functionName: "proposalCounter",
    watch: true,               // listen for new blocks / changes
  });

  // Convert BigNumber to number
  const count = data ? Number(data) : 0;

  return {
    count,
    isLoading,
    isError,
    refetch,  // optional: let caller refetch manually if needed
  };
}

/* -----------------------------------
   Fetch a single proposal
----------------------------------- */

export function useProposal(proposalId) {
  //const provider = useProvider();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: PROPOSAL_MANAGER_ADDRESS,
    abi: PROPOSAL_MANAGER_ABI,
    functionName: "proposals",
    args: proposalId != null ? [proposalId] : undefined,
    enabled: proposalId != null,
    watch: true,
  });

  return {
    proposal: data,
    isLoading,
    isError,
    refetch,
  };
}

/* -----------------------------------
   Fetch all proposals
   Note: wagmi doesn’t have a built-in batching for dynamic number of calls.
   So we still need to manually loop — but can optionally use multiple useReadContract hooks, or combine.
----------------------------------- */

export function useAllProposals(proposalCount) {
  // If proposalCount is small and stable, you could call useReadContract in a loop.
  // For simplicity, here's a naive approach combining multiple reads via Promise.all inside a custom hook.
  //const provider = useProvider();

  const [proposals, setProposals] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  useEffect(() => {
    if (!proposalCount || proposalCount < 1) {
      setProposals([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      try {
        const reads = [];
        for (let i = 1; i <= proposalCount; i++) {
          reads.push(
            useReadContract({
              address: PROPOSAL_MANAGER_ADDRESS,
              abi: PROPOSAL_MANAGER_ABI,
              functionName: "proposals",
              args: [i],
            })
          );
        }
        const results = await Promise.all(reads);
        if (!cancelled) {
          setProposals(results);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [proposalCount]);

  return { proposals: proposals || [], isLoading, isError: isError };
}

/* -----------------------------------
   Fetch encrypted tally
----------------------------------- */

export function useEncryptedTally(proposalId) {
  //const provider = useProvider();

  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONFIDENTIAL_VOTING_ADDRESS,
    abi: CONFIDENTIAL_VOTING_ABI,
    functionName: "getEncryptedTally",
    args: proposalId != null ? [proposalId] : undefined,
    enabled: proposalId != null,
    watch: true,
  });

  return {
    tally: data,
    isLoading,
    isError,
    refetch,
  };
}




/* -----------------------------------
   Submit encrypted vote (write)
----------------------------------- */

// export function useSubmitEncryptedVote() {
//   const { address } = useAccount();
//   const walletClient = useWalletClient().data; // contains signer for writes

// const submitVoteTx = async (proposalId, ciphertext) => {
//   if (!walletClient) throw new Error("Wallet client not ready");

//   const { config } = useSimulateContract({
//     address: CONFIDENTIAL_VOTING_ADDRESS,
//     abi: CONFIDENTIAL_VOTING_ABI,
//     functionName: "submitEncryptedVote",
//     account: [proposalId, ciphertext], // explicitly use connected address
//     walletClient,     // explicitly use signer
//     // args will be passed when calling writeAsync
//   });

//   const { writeAsync, 
//     //data, isLoading, isSuccess, error
//    } = useWriteContract(config);

//  // const submitVoteTx = async (proposalId, ciphertext) => {
//     if (!writeAsync) throw new Error("Wallet not connected or signer not ready");

//     const tx = await writeAsync();
//     const receipt = await tx.wait(); // optional: wait for confirmation
//     return { txHash: tx.hash, success: receipt.status === 1, receipt };
//   };

//   return { submitVoteTx, 
//     //txHash: data?.hash, isLoading, isSuccess, error 
//   };
// }



export function useSubmitEncryptedVote() {
  // eslint-disable-next-line no-unused-vars
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const enabled = isConnected && !!walletClient; // Only prepare if wallet is ready

  const { config } = useSimulateContract({
    address: CONFIDENTIAL_VOTING_ADDRESS,
    abi: CONFIDENTIAL_VOTING_ABI,
    functionName: "submitEncryptedVote",
    args: [0, "0x00"], // placeholder
    signer: walletClient,
    enabled,
  });

  const { writeAsync } = useWriteContract(config);

  const submitVoteTx = async (proposalId, ciphertext) => {
    if (!enabled || !writeAsync) throw new Error("Wallet not ready");

    const tx = await writeAsync({ args: [proposalId, ciphertext] });
    const receipt = await tx.wait();
    return { txHash: tx.hash, success: receipt.status === 1, receipt };
  };

  return { submitVoteTx, isReady: enabled && !!writeAsync };
}


/* -----------------------------------
   Create a new proposal (write)
----------------------------------- */

export function useCreateProposal() {
  const { address } = useAccount();
  const walletClient = useWalletClient().data; // signer for writes

  const { config } = useSimulateContract({
    address: PROPOSAL_MANAGER_ADDRESS,
    abi: PROPOSAL_MANAGER_ABI,
    functionName: "createProposal",
    account: address,     // explicitly use connected address
    walletClient,         // explicitly use signer
    // args are passed dynamically when calling writeAsync
  });

  const { writeAsync, data, isLoading, isSuccess, error } = useWriteContract(config);

  const createProposalTx = async (title, description) => {
    if (!writeAsync) throw new Error("Wallet not connected or signer not ready");

    const tx = await writeAsync({ args: [title, description] });
    const receipt = await tx.wait(); // wait for transaction confirmation
    return { txHash: tx.hash, success: receipt.status === 1, receipt };
  };

  return { createProposalTx, txHash: data?.hash, isLoading, isSuccess, error };
}
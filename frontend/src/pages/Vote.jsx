// eslint-disable-next-line no-unused-vars
import { hexToBytes, padHex } from "viem";

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useProposalsList } from "../hooks/useProposalsList.js";
import { DAO_ABI, DAO_ADDRESS } from "../contracts/dao.js";
import { useAccount } from "wagmi";
import { useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VOTE_ABI, VOTE_ADDRESS } from "../contracts/vote.js";
import { useReadContract } from "wagmi";

import { getInstance } from "../utils/fhevm-v09"; // or wherever your init is



export default function Vote() {
  const { isConnected, address } = useAccount();
  const { data: proposals } = useProposalsList();

  const [selectedVotes, setSelectedVotes] = useState({}); // proposalId → voteValue
  const [loadingProposal, setLoadingProposal] = useState(null);
  const [lastTxHash, setLastTxHash] = useState(null); // track last tx hash
  const [waitingTx, setWaitingTx] = useState(null); // track tx currently waiting
  const [confirmedTx, setConfirmedTx] = useState(null); // track confirmed tx
  const [error, setError] = useState(null);

  const [proposalTxs, setProposalTxs] = useState({}); 
// structure: { [proposalId]: { waitingTx: string, confirmedTx: string | null, error: Error | null } }


  const { writeContractAsync } = useWriteContract();

  // const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
  //   hash: lastTxHash,
  //   watch: true,
  // });

  const talliesContracts = proposals?.map(p => ({
    address: VOTE_ADDRESS,
    abi: VOTE_ABI,
    functionName: "getEncryptedTally",
    args: [p.id],
  })) || [];

  const { data: tallies } = useReadContracts({
    contracts: talliesContracts,
    watch: true,
  });

  const handleVoteSelect = (proposalId, value) => {
    setSelectedVotes(prev => ({ ...prev, [proposalId]: value }));
  };

  


//   const handleSubmit = async (proposalId) => {
//   const voteOption = selectedVotes[proposalId];
//   if (voteOption === undefined) return alert("Select a vote option first!");

//   setLoadingProposal(proposalId);
//   setProposalTxs((prev) => ({ 
//     ...prev, 
//     [proposalId]: { waitingTx: null, confirmedTx: null, error: null } 
//   }));

//   try {
   
//     let voteHash = await hashVote(voteOption);

//        // ensure it is exactly 32 bytes
//       voteHash = voteHash.slice(0, 66); // keep 0x + 64 chars

//       const voteHashBytes32 = padHex(voteHash, { size: 32 });


//     if (!writeContractAsync) throw new Error("Wallet not ready");

//     const txHash = await writeContractAsync({
//       address: VOTE_ADDRESS,
//       abi: VOTE_ABI,
//       functionName: "submitEncryptedVote",
//       args: [proposalId, voteOption, voteHashBytes32],
//       gas: 3_000_000,
//     });

//     setProposalTxs((prev) => ({
//       ...prev,
//       [proposalId]: { ...prev[proposalId], waitingTx: txHash }
//     }));

//     alert(`Transaction sent! Hash: ${txHash}`);

//     // const voteCounts = await contract.read.getVoteCounts([proposalId]);
//     // console.log(voteCounts);

//     console.log("Submitting vote", { proposalId, voteOption, voteHashBytes32 });


//     console.log("Submitting vote for proposal:", proposalId);

//   } catch (err) {
//     console.error("Error submitting vote:", err);
//     setProposalTxs((prev) => ({
//       ...prev,
//       [proposalId]: { ...prev[proposalId], error: err }
//     }));
//     alert("Error submitting vote: " + (err?.shortMessage || err?.message || err));
//   }

//   setLoadingProposal(null);
// };


const handleSubmit = async (proposalId) => {
  const voteOption = selectedVotes[proposalId];
  if (voteOption === undefined) return alert("Select a vote option first!");

  setLoadingProposal(proposalId);

  try {
    // Get fhEVM instance
    const instance = await getInstance();
    
    // Create encrypted input
    const input = instance.createEncryptedInput(VOTE_ADDRESS, address);
    input.add8(voteOption); // encrypt the vote (0, 1, or 2)
    const encryptedData = await input.encrypt();

    // Submit to contract
    const txHash = await writeContractAsync({
      address: VOTE_ADDRESS,
      abi: VOTE_ABI,
      functionName: "submitEncryptedVote",
      args: [
        proposalId,
        encryptedData.handles[0],   // encrypted vote handle
        encryptedData.inputProof    // KMS proof
      ],
      gas: 3_000_000,
    });

    alert(`Vote encrypted & submitted! Hash: ${txHash}`);

  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + (err?.shortMessage || err?.message));
  }

  setLoadingProposal(null);
};

  if (!proposals) return <p className="text-gray-300">Loading proposals...</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">Active Proposals</h1>

      {proposals.length === 0 && (
        <p className="text-gray-400 text-lg">No proposals have been created yet.</p>
      )}

      {proposals.map((p, i) => {
        const tally = tallies ? tallies[i] : null;

        return (
          <div
            key={p.id}
            className="p-5 bg-gray-900 rounded-xl border border-gray-700 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-blue-300">#{p.id} — {p.title}</h2>
            <p className="text-gray-300 mb-4">{p.description}</p>

            <div className="flex gap-3 mb-3">
              <button
                onClick={() => handleVoteSelect(p.id, 0)}
                className={`px-4 py-2 rounded ${selectedVotes[p.id] === 0 ? "bg-red-600" : "bg-gray-700"}`}
              >
                Against (0)
              </button>
              <button
                onClick={() => handleVoteSelect(p.id, 1)}
                className={`px-4 py-2 rounded ${selectedVotes[p.id] === 1 ? "bg-green-600" : "bg-gray-700"}`}
              >
                For (1)
              </button>
              <button
                onClick={() => handleVoteSelect(p.id, 2)}
                className={`px-4 py-2 rounded ${selectedVotes[p.id] === 2 ? "bg-yellow-600" : "bg-gray-700"}`}
              >
                Abstain (2)
              </button>
            </div>

            <button
              onClick={() => handleSubmit(p.id)}
              className="bg-blue-600 px-4 py-2 rounded disabled:bg-gray-600"
              disabled={loadingProposal === p.id}
            >
              {loadingProposal === p.id ? "Encrypting vote…" : "Encrypt & Submit Vote"}
            </button>

<ProposalTxWatcher
  proposalId={p.id}
  txHash={proposalTxs[p.id]?.waitingTx}
  onConfirmed={(proposalId, txHash) => {
    setProposalTxs((prev) => ({
      ...prev,
      [proposalId]: {
        waitingTx: null,
        confirmedTx: txHash,
      },
    }));
    setSelectedVotes((prev) => ({ ...prev, [proposalId]: undefined }));
  }}
/>

            <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300">Encrypted Tally</h3>
              <pre className="text-gray-400 break-words">
                {tally ? JSON.stringify(tally.data) : "No votes yet"}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}



function ProposalTxWatcher({ proposalId, txHash, onConfirmed }) {
  const { isLoading: confirming, isSuccess, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      watch: true,
    });

  useEffect(() => {
    if (isSuccess && txHash) {
      onConfirmed(proposalId, txHash);
    }
  }, [isSuccess, txHash, proposalId, onConfirmed]);

  if (!txHash) return null;

  return (
    <>
      {confirming && (
        <p className="text-blue-400 mt-2">Waiting for confirmation…</p>
      )}
      {isSuccess && (
        <p className="text-green-400 mt-2">Vote confirmed!</p>
      )}
      {error && (
        <p className="text-red-400 mt-2">
          Error: {error.message || "Transaction failed"}
        </p>
      )}
    </>
  );
}





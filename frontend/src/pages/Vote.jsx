/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";


import { useWalletClient } from "wagmi";
//import { publicDecrypt } from "@zama-fhe/relayer-sdk/web";
import { useProposalsList } from "../hooks/useProposalsList.js";
import { VOTE_ABI, VOTE_ADDRESS } from "../contracts/vote.js";
import { getFheInstance } from "../utils/fheInstance.js";

export default function Vote() {

const {  address } = useAccount();


   const { data: walletClient } = useWalletClient();

  const { data: proposals } = useProposalsList();

  const [selectedVotes, setSelectedVotes] = useState({});
  const [loadingProposal, setLoadingProposal] = useState(null);
  const [proposalTxs, setProposalTxs] = useState({});
  const [fheInstance, setFheInstance] = useState(null);
  const [clearTallies, setClearTallies] = useState({});

  const { writeContractAsync } = useWriteContract();

  // Init FHE instance once
  useEffect(() => {
    getFheInstance().then(setFheInstance);
  }, []);

  /* ---------------------------------------------
     Read encrypted tallies + finalized flag
  ---------------------------------------------- */
  const contracts = proposals
    ? proposals.flatMap((p) => [
        {
          address: VOTE_ADDRESS,
          abi: VOTE_ABI,
          functionName: "encryptedTallies",
          args: [p.id],
        },
        {
          address: VOTE_ADDRESS,
          abi: VOTE_ABI,
          functionName: "isTallyFinalized",
          args: [p.id],
        },
      ])
    : [];

  const { data } = useReadContracts({ contracts, watch: true });

  const getEncryptedTally = (i) => data?.[i * 2]?.result;
  const getIsFinalized = (i) => data?.[i * 2 + 1]?.result;

  /* ---------------------------------------------
     Submit encrypted vote
  ---------------------------------------------- */
  const handleSubmit = async (proposalId) => {
    if (!fheInstance) return alert("FHE not ready");
    const voteOption = selectedVotes[proposalId];
    if (voteOption === undefined) return alert("Select a vote first");

    setLoadingProposal(proposalId);

    try {
      const input = fheInstance.createEncryptedInput(
        VOTE_ADDRESS,
        address
      );
      input.add8(voteOption);
      const encrypted = await input.encrypt();

      console.log("WHY ALWAYS ME", encrypted);

      const handleHex = `0x${Array.from(encrypted.handles[0])
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")}`;

      const proofHex = `0x${Array.from(encrypted.inputProof)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")}`;

      const txHash = await writeContractAsync({
        address: VOTE_ADDRESS,
        abi: VOTE_ABI,
        functionName: "submitEncryptedVote",
        args: [
          BigInt(proposalId), 
          handleHex, 
          proofHex
        ],
        gas: 5_000_000n,
      });

      console.log("TX HASH:",txHash);

      setProposalTxs((p) => ({
        ...p,
        //[proposalId]: { waitingTx: txHash },
        [proposalId]: txHash,
      }));
    } catch (err) {
      alert(err.message || "Vote failed");
    }

    setLoadingProposal(null);
  };


//   const handleSubmit = async (proposalId) => {
//   if (!fheInstance) return alert("FHE not ready");
//   const voteOption = selectedVotes[proposalId];
//   if (voteOption === undefined) return alert("Select a vote");

//   setLoadingProposal(proposalId);

//   try {

//     const signerAddress = walletClient?.account?.address;

//     if (!signerAddress) {
//        throw new Error("Wallet not ready");
//     }

//     console.log("Encrypting for:");
//     console.log("Contract:", VOTE_ADDRESS);
//     console.log("User:", signerAddress);
//     console.log("Chain:", fheInstance.chainId);
//     console.log("Submitting proposalId:", proposalId, typeof proposalId);


    

//     const input = fheInstance.createEncryptedInput(
//        VOTE_ADDRESS,
//        signerAddress
//     );

//     input.add8(voteOption);
//     const encrypted = await input.encrypt();

//     // const handleHex = `0x${Array.from(encrypted.handles[0])
//     //   .map(b => b.toString(16).padStart(2, "0"))
//     //   .join("")}`;

//     // const proofHex = `0x${Array.from(encrypted.inputProof)
//     //   .map(b => b.toString(16).padStart(2, "0"))
//     //   .join("")}`;

//     const txHash = await writeContractAsync({
//       address: VOTE_ADDRESS,
//       abi: VOTE_ABI,
//       functionName: "submitEncryptedVote",
//       args: [BigInt(proposalId), encrypted.handles[0], encrypted.inputProof],
//       gas: 5_000_000n,
//     });

//     // ✅ store tx hash
//     setProposalTxs(prev => ({
//       ...prev,
//       [proposalId]: txHash,
//     }));
//   } catch (err) {
//     alert(err.message || "Vote failed");
//   }

//   setLoadingProposal(null);
// };


  /* ---------------------------------------------
     Finalize + decrypt tally
  ---------------------------------------------- */
  const handleReveal = async (proposalId, encryptedTally) => {
    // 1️⃣ mark public on-chain
    await writeContractAsync({
      address: VOTE_ADDRESS,
      abi: VOTE_ABI,
      functionName: "requestTallyDecryption",
      args: [BigInt(proposalId)],
    });

    // 2️⃣ decrypt off-chain
    const clear = await fheInstance.publicDecrypt(
      encryptedTally,
      VOTE_ADDRESS
    );

    setClearTallies((p) => ({ ...p, [proposalId]: clear }));
  };

  if (!proposals) return <p>Loading proposals…</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-400">
        Active Proposals
      </h1>

      {proposals.map((p, i) => {
        const encryptedTally = getEncryptedTally(i);
        const finalized = getIsFinalized(i);
        const clear = clearTallies[p.id];

        return (
          <div key={p.id} className="p-5 bg-gray-900 rounded-xl">
            <h2 className="text-xl text-blue-300">
              #{p.id} — {p.title}
            </h2>

            {!finalized && !clear && (
              <>
                <div className="flex gap-3 my-3">
                  {[0, 1, 2].map((v) => (
                    <button
                      key={v}
                      onClick={() =>
                        setSelectedVotes((s) => ({
                          ...s,
                          [p.id]: v,
                        }))
                      }
                      className="bg-gray-700 px-3 py-2 rounded"
                    >
                      {v === 0
                        ? "Against"
                        : v === 1
                        ? "For"
                        : "Abstain"}
                    </button>
                  ))}
                </div>


<button
      disabled={!walletClient || loadingProposal === p.id}
      onClick={() => handleSubmit(p.id)}
      className="bg-blue-600 px-4 py-2 rounded disabled:bg-gray-600"
    >
      {loadingProposal === p.id
        ? "Encrypting & submitting…"
        : "Encrypt & Vote"}
    </button>

{/* ✅ tx status */}
<TxStatus txHash={proposalTxs[p.id]} />


              </>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Encrypted tally:
              </p>
              <pre className="text-xs break-words">
                {encryptedTally || "—"}
              </pre>
            </div>

            {finalized && clear !== undefined && (
              <p className="mt-3 text-green-400">
                ✅ Final tally: {clear}
              </p>
            )}

            {!finalized && encryptedTally && (
              <button
                className="mt-3 bg-purple-600 px-3 py-2 rounded"
                onClick={() =>
                  handleReveal(p.id, encryptedTally)
                }
              >
                Finalize & Reveal
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}


function TxStatus({ txHash }) {
  const enabled = Boolean(txHash);

  const { isLoading, isSuccess, isError, error } =
    useWaitForTransactionReceipt({
       hash: txHash,
       enabled // This is Critical 
    });

  if (!enabled) return null;

  if (isLoading) {
    return <p className="text-blue-400">⏳ Waiting for confirmation…</p>;
  }

  if (isSuccess) {
    return <p className="text-green-400">✅ Vote confirmed</p>;
  }

  if (isError) {
    return <p className="text-red-400">❌ {error?.message}</p>;
  }

  return null;
}

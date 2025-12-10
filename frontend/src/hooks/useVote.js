// // src/hooks/useVote.js
// import { useState } from "react";
// import { useSubmitEncryptedVote } from "./useProposals.js";

// /**
//  * Encrypts a vote via backend (FHE) and submits it on-chain via ethers.js
//  */
// export function useVote() {
//   const [status, setStatus] = useState("idle"); 
//   const [loading, setLoading] = useState(false);

//   // Our ethers.js write hook from useProposals.js
//   const {
//     submitVoteTx,
//     isLoading: txLoading,
//     isSuccess: txSuccess,
//     error: txError,
//   } = useSubmitEncryptedVote();

//   const castVote = async (proposalId, voteValue) => {
//     try {
//       setLoading(true);
//       setStatus("encrypting");

//       // 1️⃣ Encrypt vote using backend FHE endpoint
//       const res = await fetch("/api/submit-vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ proposalId, vote: voteValue }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.ciphertext) {
//         setStatus("error");
//         throw new Error(data.error || "Failed to encrypt vote");
//       }

//       // 2️⃣ Submit encrypted vote on-chain
//       setStatus("submitting");

//       await submitVoteTx(proposalId, data.ciphertext);

//       // submitVoteTx internally waits for confirmation
//       setStatus("success");

//     } catch (err) {
//       console.error("Cast vote error:", err);
//       setStatus("error");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     castVote,
//     status,
//     loading,
//     txLoading,
//     txSuccess,
//     txError,
//   };
// }

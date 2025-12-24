
import { useState, useEffect, useCallback } from "react";
import { useReadContracts, useReadContract, useWriteContract } from "wagmi";
import { DAO_ADDRESS, DAO_ABI } from "../contracts/dao.js";
import { VOTE_ADDRESS, VOTE_ABI } from "../contracts/vote.js";
import { getFheInstance, publicDecryptTally } from "../utils/fheInstance.js";
import { useMemo } from "react";

function useProposalCount() {
  const { data, isLoading, isError } = useReadContract({
    address: DAO_ADDRESS,
    abi: DAO_ABI,
    functionName: "proposalCounter",
    watch: true,
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    isError,
  };
}

export default function Results() {
  const { count, isLoading: loadingCount, isError: errorCount } = useProposalCount();
  
  //const proposalIds = Array.from({ length: count || 0 }, (_, i) => i + 1);


   // ← ADD THIS: Memoize proposalIds
  const proposalIds = useMemo(() => {
    return Array.from({ length: count || 0 }, (_, i) => i + 1);
  }, [count]);


  const [clearTallies, setClearTallies] = useState({});
  const [sdkReady, setSdkReady] = useState(false);
  const [revealing, setRevealing] = useState(null);

  const { writeContractAsync } = useWriteContract();

  // Initialize FHE SDK once
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await getFheInstance();
        if (mounted) setSdkReady(true);
      } catch (err) {
        console.error("FHE SDK init failed", err);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Read encrypted tallies
  const tallyContracts = proposalIds.map((id) => ({
    address: VOTE_ADDRESS,
    abi: VOTE_ABI,
    functionName: "getEncryptedTally",
    args: [id],
  }));

  const { data: tallyData, isLoading: loadingTallies } = useReadContracts({
    contracts: tallyContracts,
    watch: true,
  });

  // Memoized decryption function to prevent infinite loops
  const decryptTallies = useCallback(async (handles) => {
    const newTallies = {};

    for (let i = 0; i < handles.length; i++) {
      const id = proposalIds[i];
      const encryptedHandle = handles[i]?.result;

      if (!encryptedHandle || encryptedHandle === 0n || encryptedHandle === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        newTallies[id] = 0;
        continue;
      }

      let handleStr =
        typeof encryptedHandle === "bigint"
          ? "0x" + encryptedHandle.toString(16).padStart(64, "0")
          : encryptedHandle;

      try {
        const { clearTally } = await publicDecryptTally(handleStr);
        newTallies[id] = clearTally;
      } catch (err) {
        newTallies[id] = "Not revealed yet";
        console.error(err)
      }
    }

    setClearTallies(newTallies); // Single batch update!
  }, [proposalIds]);

  // Run decryption only when data is ready and stable
  useEffect(() => {
    if (!sdkReady || loadingTallies || !tallyData) return;

    decryptTallies(tallyData);
  }, [tallyData, sdkReady, loadingTallies, decryptTallies]);

  // Handle reveal
  const handleReveal = async (proposalId) => {
    setRevealing(proposalId);
    try {
      await writeContractAsync({
        address: VOTE_ADDRESS,
        abi: VOTE_ABI,
        functionName: "requestTallyDecryption",
        args: [proposalId],
      });
      alert("Results revealed! Clear tally will update shortly.");

      // Force re-decrypt after a delay
      setTimeout(() => {
        setClearTallies(prev => ({ ...prev, [proposalId]: "loading" }));
        // Re-run decryption on next data poll (watch: true will trigger it)
      }, 8000);
    } catch (err) {
      alert("Error: " + (err?.shortMessage || err?.message || "Unknown"));
    } finally {
      setRevealing(null);
    }
  };

  if (loadingCount || loadingTallies) return <p className="text-gray-400">Loading results…</p>;
  if (errorCount) return <p className="text-red-400">Error loading proposal count</p>;
  if (!count) return <p>No proposals found.</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400">Voting Results</h1>
      <p className="text-gray-500 text-sm">
        Click "Reveal Results" to make the tally publicly viewable.
      </p>

      {proposalIds.map((id, index) => {
        const encrypted = tallyData?.[index]?.result || "0x";
        const clear = clearTallies[id];
        const hasVotes = encrypted !== 0n && !encrypted.toString().match(/^0x0+$/);

        return (
          <div key={id} className="p-6 rounded-xl bg-gray-800 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-blue-300">Proposal #{id}</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleReveal(id)}
                disabled={revealing === id || !hasVotes || (typeof clear === "number")}
                className={`px-5 py-2 rounded font-medium ${
                  !hasVotes || typeof clear === "number"
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {revealing === id ? "Revealing..." : "Reveal Results"}
              </button>

              <span className="text-sm text-gray-400">
                {typeof clear === "number" && "(Revealed)"}
                {clear === "Not revealed yet" && hasVotes && "(Click to reveal)"}
                {!hasVotes && "(No votes yet)"}
              </span>
            </div>

            <div>
              <p className="font-semibold text-gray-300">Clear Total Votes:</p>
              <p className="text-3xl font-bold text-green-400">
                {clear === undefined || clear === "loading"
                  ? "Loading..."
                  : typeof clear === "number"
                  ? clear
                  : clear || "No votes"}
              </p>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500">Show encrypted handle</summary>
              <pre className="text-xs text-gray-400 break-all mt-2">
                {typeof encrypted === "bigint"
                  ? "0x" + encrypted.toString(16).padStart(64, "0")
                  : encrypted}
              </pre>
            </details>
          </div>
        );
      })}
    </div>
  );
}
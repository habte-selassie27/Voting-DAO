import { useReadContracts, useReadContract } from "wagmi";
import { DAO_ADDRESS, DAO_ABI } from "../contracts/dao.js";
import { VOTE_ADDRESS, VOTE_ABI } from "../contracts/vote.js";

// Hook: get total proposal count
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
  const proposalIds = [...Array(count || 0).keys()].map((i) => i + 1);

  // Prepare read contracts for encrypted tally and vote counts
  const contracts = proposalIds.flatMap((id) => [
    {
      address: VOTE_ADDRESS,
      abi: VOTE_ABI,
      functionName: "getEncryptedTally",
      args: [id],
    },
    {
      address: VOTE_ADDRESS,
      abi: VOTE_ABI,
      functionName: "getVoteCounts",
      args: [id],
    },
  ]);

  const { data, isLoading, isError } = useReadContracts({
    contracts,
    watch: true,
  });

  if (loadingCount || isLoading) return <p className="text-gray-400">Loading proposals…</p>;
  if (errorCount || isError) return <p className="text-red-400">Error fetching data</p>;
  if (!count) return <p>No proposals found.</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400">Voting Results (Encrypted & Status)</h1>

      {proposalIds.map((id, index) => {
        // Each proposal has two entries in `data`: encrypted tally, then vote counts
        const encrypted = data[index * 2]?.result || "0x";
        const countsRaw = data[index * 2 + 1]?.result;
        const voteCounts = countsRaw
          ? {
              Against: Number(countsRaw[0]),
              For: Number(countsRaw[1]),
              Abstain: Number(countsRaw[2]),
            }
          : { Against: 0, For: 0, Abstain: 0 };

        return (
          <div key={id} className="p-4 rounded-xl bg-gray-800 shadow-lg space-y-3">
            <h2 className="text-xl font-bold text-blue-300">Proposal #{id}</h2>

            <div>
              <p className="font-semibold">Encrypted Tally:</p>
              <pre className="text-sm text-gray-300 break-all">
                {JSON.stringify(encrypted, null, 2)}
              </pre>
            </div>

            <div>
              <p className="font-semibold">Vote Status:</p>
              <ul className="text-gray-300">
                <li>Against (0): {voteCounts.Against}</li>
                <li>For (1): {voteCounts.For}</li>
                <li>Abstain (2): {voteCounts.Abstain}</li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

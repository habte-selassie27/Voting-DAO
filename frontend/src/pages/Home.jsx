
// src/pages/Home.jsx
import ProposalCard from "../components/ProposalCard.jsx";
import ProposalSkeleton from "../components/ProposalSkeleton.jsx";
import { useAllProposals } from "../hooks/useProposals.js";

export default function Home() {
  const { proposals, loading, error } = useAllProposals();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">Active Proposals</h1>

      {error && (
        <p className="text-red-400 bg-red-900/20 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ProposalSkeleton key={i} />
          ))
        }

        {!loading && proposals.length > 0 &&
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onSelect={() => console.log("Selected:", proposal.id)}
            />
          ))
        }

        {!loading && proposals.length === 0 && (
          <p className="text-gray-400">No proposals found.</p>
        )}
      </div>
    </div>
  );
}

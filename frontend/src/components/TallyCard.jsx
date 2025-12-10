import { useReadContracts } from "wagmi";
import { VOTE_ABI, VOTE_ADDRESS } from "../contracts/vote.js";

export default function TallyCard({ proposalId }) {
  const { data: encryptedTally } = useReadContracts({
    contracts: [
      {
        address: VOTE_ADDRESS,
        abi: VOTE_ABI,
        functionName: "getEncryptedTally",
        args: [proposalId],
      },
    ],
    watch: true, // updates automatically when blockchain changes
  });

  return (
    <div className="p-4 rounded-xl bg-gray-800 shadow-lg space-y-3">
      <h2 className="text-xl font-bold text-blue-300">
        Proposal #{proposalId}
      </h2>

      <div>
        <p className="font-semibold">Encrypted Tally:</p>
        <pre className="text-sm text-gray-300 break-all">
          {encryptedTally ? JSON.stringify(encryptedTally, null, 2) : "No votes yet"}
        </pre>
      </div>
    </div>
  );
}

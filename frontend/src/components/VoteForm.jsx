import { useState } from "react";
import EncryptionStatus from "./EncryptionStatus";

export default function VoteForm({ proposalId, onSubmit }) {
  const [voteOption, setVoteOption] = useState(null);
  const [encryptStatus, setEncryptStatus] = useState("idle");

  const handleVote = async () => {
    if (voteOption === null) {
      alert("Please select a vote option.");
      return;
    }

    setEncryptStatus("encrypting");

    // encode vote (0,1,2)
    const encodedVote = BigInt(voteOption);

    // this will use the hook we create in Batch 4
    const ciphertext = await onSubmit(proposalId, encodedVote, setEncryptStatus);

    if (ciphertext) {
      setEncryptStatus("encrypted");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4 text-blue-300">
        Submit Vote (Encrypted)
      </h3>

      {/* OPTIONS */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="vote"
            value="0"
            checked={voteOption === 0}
            onChange={() => setVoteOption(0)}
          />
          Against (0)
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="vote"
            value="1"
            checked={voteOption === 1}
            onChange={() => setVoteOption(1)}
          />
          For (1)
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="vote"
            value="2"
            checked={voteOption === 2}
            onChange={() => setVoteOption(2)}
          />
          Abstain (2)
        </label>
      </div>

      {/* Encrypt + Submit Button */}
      <button
        onClick={handleVote}
        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
      >
        Encrypt & Submit Vote
      </button>

      <EncryptionStatus status={encryptStatus} />
    </div>
  );
}

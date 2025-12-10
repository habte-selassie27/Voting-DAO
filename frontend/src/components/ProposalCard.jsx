// export default function ProposalCard({ proposal, onSelect }) {
//   return (
//     <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition">
//       <h2 className="text-2xl font-semibold mb-2 text-blue-300">
//         {proposal.title}
//       </h2>

//       <p className="text-gray-300 mb-4">{proposal.description}</p>

//       <p className="text-sm text-gray-400 mb-4">
//         Created by: <span className="text-gray-300">{proposal.creator}</span>
//       </p>

//       <button
//         onClick={() => onSelect(proposal)}
//         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
//       >
//         View & Vote
//       </button>
//     </div>
//   );
// }
// src/components/ProposalCard.jsx
export default function ProposalCard({ proposal, onSelect }) {
  if (!proposal) return null;

  const { id, title, description, creator, deadline } = proposal;

  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer"
         onClick={onSelect}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">ID #{id}</span>
        <span className="text-xs bg-blue-700 px-2 py-1 rounded-md">
          Active
        </span>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>

      <p className="text-gray-300 mb-3 line-clamp-3">
        {description}
      </p>

      <div className="text-gray-500 text-sm">
        <p>Creator: {creator}</p>
        <p>Ends: {new Date(Number(deadline) * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
}

// src/components/ProposalSkeleton.jsx
export default function ProposalSkeleton() {
  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl animate-pulse">
      <div className="h-4 w-20 bg-gray-700 rounded mb-3"></div>
      <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-700 rounded mb-4"></div>

      <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
    </div>
  );
}

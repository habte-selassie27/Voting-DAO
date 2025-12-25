
// // CreateProposal.jsx
// import { useState } from "react";
// import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
// import { DAO_ABI, DAO_ADDRESS } from "../contracts/dao";
// //import error from 'wagmi'
// import { BaseError } from "wagmi";

// //import blockData from "../contracts/dao"

// //import { useReadContracts } from "wagmi";

// import { useEffect } from 'react';
// import { useAccount } from 'wagmi';
// //import { DAO_ADDRESS, DAO_ABI } from './constants'; // wherever you defined them


// export default function CreateProposal() {



//   const { chain } = useAccount();

//   useEffect(() => {
//     console.log("Connected chain id:", chain?.id);
//     console.log("DAO_ADDRESS:", DAO_ADDRESS);
//     console.log("DAO_ABI:", DAO_ABI);
//   }, [chain]); // runs whenever chain changes


//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");

// // const { data, error, isPending} = useReadContracts({
// //   contracts: [{
// //    ...blockData,
// //     functionName: 'proposals',
// //     args: ['address']
// //   }, 
  
// //    {
// //     ...blockData,
// //     functionName: 'proposalCounter',
// //     args: ['']
// //   } , 

// //   {
// //    ...blockData,
// //     functionName: 'ownerOf',
// //     args: ['']
// //   }]
// // })

// // const [ownerOf, proposals, proposalCounter] = data || []


// // if(isPending) return <div>Loading...</div>

// // if(error) {
// //   return(
// //     <div>
// //       Error: {(BaseError).shortMessage || error.message}
// //     </div>
// //   )
// // }

// // return (
// //   <>
// //   <div>Owner: {ownerOf}</div>
// //   <div>ProposalCounter: {proposalCounter.toString()}</div>
// //    <div>Proposals: {proposals.toString()}</div>
// //   </>
// // )

//   const { data: owner, error, isPending } = useReadContract({
//     address: DAO_ADDRESS,
//     abi: DAO_ABI,
//     functionName: "owner",
//   });


//   // another way to read contract data from blockchain 
// // const { data: owner1 } = useReadContract({
// //   ...blockData,
// //   functionName: 'owner',
// //   args: ['address']
// // })

// // return(
// //   <div>Owner: {owner1}</div>
// // )



//  // proposals 
// //  const { data: proposals } = useReadContract({
// //     address: DAO_ADDRESS,
// //     abi: DAO_ABI,
// //     functionName: "proposals",
// //   });



//   // proposalsCounter
//   //  const { data: proposalCounter } = useReadContract({
//   //   address: DAO_ADDRESS,
//   //   abi: DAO_ABI,
//   //   functionName: "proposalCounter",
//   // });


//   const {
//     writeContract,
//     data: hash,
//     isLoading
//   } = useWriteContract();




//   const { isLoading: confirming, isSuccess } =
//     useWaitForTransactionReceipt({ hash });

//   const submit = (e) => {
//     e.preventDefault();
//     writeContract({
//       address: DAO_ADDRESS,
//       abi: DAO_ABI,
//       functionName: "createProposal",
//       args: [title, desc]
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-900 rounded border border-gray-700 text-white">

//       <h2 className="text-xl font-bold mb-4">Create Proposal</h2>

//     {/* if(isPending) return <div>Loading...</div>  
//     if(error) return (
//       <div>
//         Error : {(BaseError).shortMessage || error.message}
//       </div>
//     ) else  */}
//       <p className="mb-3 text-gray-400">
//         <span className="text-blue-400">Owner: </span>
//         {isPending ? (
//         <span>Loading...</span>
//        ) : error ? (
//         <span className="text-red-500">
//          Error: {error?.shortMessage || error?.message || "Unknown error"}
//         </span>
//         ) : (
//         <span>{owner}</span>
//         )}
//         {/* {owner} */}
//       </p>

//       <form onSubmit={submit} className="space-y-4">
//         <input
//           className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
//           placeholder="Proposal Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <textarea
//           className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
//           placeholder="Proposal Description"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//           required
//         />

//         <button
//           disabled={isPending}
//           className="bg-blue-600 px-4 py-2 rounded disabled:bg-gray-600"
//         >
//           {isLoading ? "Signing..." : "Create Proposal"}
//         </button>
//       </form>

//       {hash && <p className="mt-2 text-yellow-400">Tx: {hash.slice(0, 12)}...</p>}
//       {confirming && <p className="text-blue-400 mt-2">Waiting for confirmation...</p>}
//       {isSuccess && <p className="text-green-400 mt-2">Proposal Created!</p>}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { DAO_ABI, DAO_ADDRESS } from "../contracts/dao";
import { useAccount } from "wagmi";


function formatDuration(seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}



export default function CreateProposal() {
  const { chain, address, isConnected } = useAccount();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startTimeOffset, setStartTimeOffset] = useState(30); // seconds from now
  const [duration, setDuration] = useState(60); // voting duration in seconds
  const [now, setNow] = useState(0);




  useEffect(() => {
    const tick = () => {
      setNow(Math.floor(Date.now() / 1000));
    };

    tick(); // run once via function, not directly inline

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
        // set immediately once
    // setNow(Math.floor(Date.now() / 1000));

  // update every second
  // const id = setInterval(() => {
  //   setNow(Math.floor(Date.now() / 1000));
  // }, 1000);

  //return () => clearInterval(id);
  //      const id = setInterval(() => {
  //   setNow(Math.floor(Date.now() / 1000));
  // }, 1000);

  // return () => clearInterval(id);
    // console.log("Connected chain id:", chain?.id);
    // console.log("DAO_ADDRESS:", DAO_ADDRESS);
    // console.log("DAO_ABI:", DAO_ABI);
  }, [chain]); // runs whenever chain changes


const startTime = now + Number(startTimeOffset);
const endTime = startTime + Number(duration);

const startsIn = startTime - now;
const endsIn = endTime - now;

const startDate = new Date(startTime * 1000);
const endDate = new Date(endTime * 1000);


  const { data: owner, error, isPending } = useReadContract({
    address: DAO_ADDRESS,
    abi: DAO_ABI,
    functionName: "owner",
  });

  const { writeContract, data: hash, isLoading } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });


  // admin only enforcing
  const isAdmin = isConnected && owner && 
  address && owner.toLowerCase() === address.toLowerCase()


  const submit = (e) => {
    e.preventDefault();

    // Compute start and end times in UNIX timestamp
    const now = Math.floor(Date.now() / 1000);
    const startTime = BigInt(now) + BigInt(parseInt(startTimeOffset)); // e.g., 30s from now
    const endTime = startTime + BigInt(parseInt(duration));    // duration in seconds

    writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: "createProposal",
      args: [title, desc, startTime, endTime],
    });
  };

  if (!isConnected) {
  return (
    <div className="p-6 bg-gray-900 rounded text-gray-400">
      🔌 Connect your wallet to continue
    </div>
  );
}

if (!isAdmin) {
  return (
    <div className="p-6 bg-gray-900 rounded text-red-400">
      ⛔ Admin access only  
      <br />
      You are not authorized to create proposals.
    </div>
  );
}


  return (
    <div className="p-6 bg-gray-900 rounded border border-gray-700 text-white max-w-xl mx-auto">
      {/* <h2 className="text-xl font-bold mb-4">Create Proposal</h2>

      <p className="mb-3 text-gray-400">
        <span className="text-blue-400">Owner: </span>
        {isPending ? (
          <span>Loading...</span>
        ) : error ? (
          <span className="text-red-500">
            Error: {error?.shortMessage || error?.message || "Unknown error"}
          </span>
        ) : (
          <span>{owner}</span>
        )}
      </p> */}

      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
  Create Proposal
  {isAdmin && (
    <span className="px-2 py-1 text-xs bg-green-600 rounded">
      ADMIN
    </span>
  )}
</h2>

<p className="mb-3 text-gray-400">
  <span className="text-blue-400">Owner: </span>

  {isPending ? (
    <span>Loading...</span>
  ) : error ? (
    <span className="text-red-500">
      Error: {error?.shortMessage || error?.message || "Unknown error"}
    </span>
  ) : (
    <>
      <span>{owner}</span>
      {isAdmin ? (
        <span className="ml-2 text-green-400 text-sm">
          (you)
        </span>
      ) : (
        <span className="ml-2 text-yellow-400 text-sm">
          (not admin)
        </span>
      )}
    </>
  )}
</p>


      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          placeholder="Proposal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          placeholder="Proposal Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />

        {/* Voting Timer Inputs */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-gray-400 text-sm mb-1">Start Time (seconds from now, min 30s)</label>
            <input
              type="number"
              min="30"
              className="p-2 bg-gray-800 border border-gray-600 rounded"
              value={startTimeOffset}
              onChange={(e) => setStartTimeOffset(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label className="text-gray-400 text-sm mb-1">Duration (seconds)</label>
            <input
              type="number"
              min="10"
              className="p-2 bg-gray-800 border border-gray-600 rounded"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded p-3 text-sm space-y-1">
  <p className="text-gray-400">🕒 Voting Preview</p>

  <div className="flex justify-between">
    <span>Voting starts in:</span>
    <span className="text-blue-400">
      {formatDuration(startsIn)}
    </span>
  </div>

  <div className="flex justify-between">
    <span>Voting ends in:</span>
    <span className="text-purple-400">
      {formatDuration(endsIn)}
    </span>
  </div>

  <hr className="border-gray-600 my-2" />

  <div>
    <span className="text-gray-400">Start time:</span>{" "}
    {startDate.toLocaleString()}
  </div>

  <div>
    <span className="text-gray-400">End time:</span>{" "}
    {endDate.toLocaleString()}
  </div>
</div>


        <button
          type="submit"
          disabled={!isAdmin || isPending || isLoading}
          className="bg-blue-600 px-4 py-2 rounded disabled:bg-gray-600"
        >
          {/* {isLoading ? "Signing..." : "Create Proposal"} */}
   {!isAdmin
    ? "Admin only"
    : isLoading
    ? "Signing..."
    : "Create Proposal"}
        </button>
      </form>

      {/* Transaction status */}
      {hash && <p className="mt-2 text-yellow-400">Tx: {hash.slice(0, 12)}...</p>}
      {confirming && <p className="text-blue-400 mt-2">Waiting for confirmation...</p>}
      {isSuccess && <p className="text-green-400 mt-2">Proposal Created!</p>}
    </div>
  );
}

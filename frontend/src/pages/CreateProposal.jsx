
// CreateProposal.jsx
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { DAO_ABI, DAO_ADDRESS } from "../contracts/dao";
//import error from 'wagmi'
import { BaseError } from "wagmi";

//import blockData from "../contracts/dao"

//import { useReadContracts } from "wagmi";

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
//import { DAO_ADDRESS, DAO_ABI } from './constants'; // wherever you defined them


export default function CreateProposal() {



  const { chain } = useAccount();

  useEffect(() => {
    console.log("Connected chain id:", chain?.id);
    console.log("DAO_ADDRESS:", DAO_ADDRESS);
    console.log("DAO_ABI:", DAO_ABI);
  }, [chain]); // runs whenever chain changes


  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

// const { data, error, isPending} = useReadContracts({
//   contracts: [{
//    ...blockData,
//     functionName: 'proposals',
//     args: ['address']
//   }, 
  
//    {
//     ...blockData,
//     functionName: 'proposalCounter',
//     args: ['']
//   } , 

//   {
//    ...blockData,
//     functionName: 'ownerOf',
//     args: ['']
//   }]
// })

// const [ownerOf, proposals, proposalCounter] = data || []


// if(isPending) return <div>Loading...</div>

// if(error) {
//   return(
//     <div>
//       Error: {(BaseError).shortMessage || error.message}
//     </div>
//   )
// }

// return (
//   <>
//   <div>Owner: {ownerOf}</div>
//   <div>ProposalCounter: {proposalCounter.toString()}</div>
//    <div>Proposals: {proposals.toString()}</div>
//   </>
// )

  const { data: owner, error, isPending } = useReadContract({
    address: DAO_ADDRESS,
    abi: DAO_ABI,
    functionName: "owner",
  });


  // another way to read contract data from blockchain 
// const { data: owner1 } = useReadContract({
//   ...blockData,
//   functionName: 'owner',
//   args: ['address']
// })

// return(
//   <div>Owner: {owner1}</div>
// )



 // proposals 
//  const { data: proposals } = useReadContract({
//     address: DAO_ADDRESS,
//     abi: DAO_ABI,
//     functionName: "proposals",
//   });



  // proposalsCounter
  //  const { data: proposalCounter } = useReadContract({
  //   address: DAO_ADDRESS,
  //   abi: DAO_ABI,
  //   functionName: "proposalCounter",
  // });


  const {
    writeContract,
    data: hash,
    isLoading
  } = useWriteContract();




  const { isLoading: confirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const submit = (e) => {
    e.preventDefault();
    writeContract({
      address: DAO_ADDRESS,
      abi: DAO_ABI,
      functionName: "createProposal",
      args: [title, desc]
    });
  };

  return (
    <div className="p-6 bg-gray-900 rounded border border-gray-700 text-white">

      <h2 className="text-xl font-bold mb-4">Create Proposal</h2>

    {/* if(isPending) return <div>Loading...</div>  
    if(error) return (
      <div>
        Error : {(BaseError).shortMessage || error.message}
      </div>
    ) else  */}
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
        {/* {owner} */}
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

        <button
          disabled={isPending}
          className="bg-blue-600 px-4 py-2 rounded disabled:bg-gray-600"
        >
          {isLoading ? "Signing..." : "Create Proposal"}
        </button>
      </form>

      {hash && <p className="mt-2 text-yellow-400">Tx: {hash.slice(0, 12)}...</p>}
      {confirming && <p className="text-blue-400 mt-2">Waiting for confirmation...</p>}
      {isSuccess && <p className="text-green-400 mt-2">Proposal Created!</p>}
    </div>
  );
}

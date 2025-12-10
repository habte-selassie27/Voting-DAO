import React from "react";
import { useAccount, useEnsName } from "wagmi";
//import { useConnect } from "wagmi";
//import Connector from "wagmi"
import { mainnet } from "wagmi/chains";

export default function Profile() {

  const { address, isConnected } = useAccount();
  const { data, error, status } = useEnsName({ 
    address,
    chainId: mainnet.id
 });

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-800 rounded text-gray-300">
        Wallet not connected.
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="p-4 bg-gray-800 rounded text-yellow-400">
        Loading ENS name...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-gray-800 rounded text-red-400">
        Error fetching ENS name: {error?.message}
      </div>
    );
  }

  return (
    
    <div className="p-4 bg-gray-900 rounded border border-gray-700">
      <h2 className="text-lg font-bold text-blue-400 mb-2">Profile</h2>

      
      {/* </WalletOptions> */}
      <p className="text-gray-300">
        <strong>Address:</strong> {address}
      </p>

      <p className="text-gray-300 mt-2">
        <strong>ENS Name:</strong>{" "}
        {data ? (
          <span className="text-green-400">{data}</span>
        ) : (
          <span className="text-gray-500 italic">No ENS name found</span>
        )}
      </p>
    </div>
  );
}



// <WalletOptions />








































// import { useAccount, useEnsName } from "wagmi";

// export function Profile (){
//     const { address } = useAccount()
//     const { data, error, status} = useEnsName({address})
//     if (status === 'pending') return <div>Loading ENS name</div>
//     if (status === 'error')
//        return <div>Error fetching ENS name: {error.message}</div>
//     return <div>ENS name: {data}</div>

//     return(
        
//     )
// }
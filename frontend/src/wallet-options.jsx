import React from "react";
//import { useAccount, useEnsName } from "wagmi";
import { useConnect } from "wagmi";
//import Connector from "wagmi"

//  export function WalletOptions(){
//     const { connectors, connect } = useConnect()
//      return connectors.map((connector) => {
//         <button key={connector.uid} onClick={() => connect({connector})}>
//             {connector.name}
//         </button>
//      })
//  } 

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex flex-col space-y-2">
      {connectors.map((connector) => (
        <button
          key={connector.id} // use id, not uid
          onClick={() => connect({ connector })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}

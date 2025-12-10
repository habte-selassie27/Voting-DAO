import React from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
//import { useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { config } from './utils/config' // your Wagmi config
import { mainnet } from 'wagmi/chains'



// const { data: ensAvatar } = useEnsAvatar({
//   name: normalizedName,
//   config,            // use your Wagmi config
//   chainId: mainnet.id // optional if config has multiple chains
// })




const normalizedName = normalize('wevm.eth')



export default function Account() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  // Fetch ENS name for connected address
  const { data: ensName } = useEnsName({
    address,  // the wallet address
    config,   // Wagmi v2 config
    blockTag: 'latest', // optional, defaults to latest
  })

  //const { data: ensName } = useEnsName({ address });
 // const { data: ensAvatar } = useEnsAvatar({ name: ensName });

const { data: ensAvatar } = useEnsAvatar({
  name: normalizedName,
  config,            // use your Wagmi config
  chainId: mainnet.id ,// optional if config has multiple chains
  assetGatewayUrls: { ipfs: 'https://cloudflare-ipfs.com' }
})


  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-800 rounded text-gray-300">
        Wallet not connected.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded border border-gray-700 flex flex-col items-start space-y-2">
      {ensAvatar && (
        <img
          alt="ENS Avatar"
          src={ensAvatar}
          className="w-12 h-12 rounded-full"
        />
      )}
      <div className="text-gray-300">
        {ensName ? `${ensName} (${address})` : address}
      </div>
      <button
        onClick={() => disconnect()}
        className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Disconnect
      </button>
    </div>
  );
}

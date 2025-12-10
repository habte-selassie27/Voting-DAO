import { createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

//import { createClient } from 'viem'

import { injected } from 'wagmi/connectors'
import { metaMask } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
//import {alchemyProvider} from '@'
//import { configureChains } from 'wagmi'
//import { chain } from 'wagmi/chains'
import { http } from 'viem'
//import { fallback } from 'wagmi'
//import { unstable_connector } from 'wagmi'



const mainnetTransport = http('https://mainnet.infura.io/v3/ec140a863bce4f919d107d45e27a0319')
const sepoliaTransport = http('https://sepolia.infura.io/v3/ec140a863bce4f919d107d45e27a0319')
     


//import { sepolia } from '@wagmi/core/chains'


// const sepoliaTransport = http('https://sepolia.infura.io/v3/ec140a863bce4f919d107d45e27a0319')

// // eslint-disable-next-line no-unused-vars
// const { chains, provider, webSocketProvider} = configureChains(
//   [sepolia],
//   [sepoliaTransport]
// )

const connector = injected({
  shimDisconnect:false,
  unstable_shimAsyncInject:2_000,
  target(){
    return {
      id: 'windowProvider', 
      name: 'Window Provider', 
      provider: window.ethereum, 
    }
  }

})


export const config = createConfig({
  chains: [sepolia , mainnet],
  // publicClient:sepoliaTransport,
  transports: {
    // [mainnet.id]: fallback([
    //     unstable_connector(injected), 
    //   // http('https://foo-bar-baz.quiknode.pro/...'), 
    //   http('https://mainnet.infura.io/v3/ec140a863bce4f919d107d45e27a031'),
    //   http('https://sepolia.infura.io/v3/ec140a863bce4f919d107d45e27a0319')  
    // ]),
     [sepolia.id]: sepoliaTransport,
     [mainnet.id]: mainnetTransport,
    
     //[seiTestnet.id]: http(),
  },
   connectors: [
    connector, 

   

    metaMask({
     dappMetadata: { 
     name: 'My Wagmi App', 
     url: 'http://localhost:5173', 
     iconUrl: 'https://example.com/favicon.ico', 
  } ,
  logging : {developerMode: true, sdk:true}
    }) ,

    walletConnect({
        projectId : "f9c560cd03c686fea5c90144d5fc93b9",
        customStoragePrefix: "wagmi",
        disableProviderPing: false, 
        metadata: { 
         name: 'Example', 
         description: 'Example website', 
         url: 'http://localhost:5173', 
     }, qrModalOptions: { 
       themeMode: 'dark', 
     }, relayUrl: 'wss://relay.walletconnect.org',
       storageOptions: {},
       showQrModal: true,
    }),
    // provider,
    // webSocketProvider

   ],
  // client({ chain }) {
  //   return createClient({ chain, transport: http() })
  // },



})
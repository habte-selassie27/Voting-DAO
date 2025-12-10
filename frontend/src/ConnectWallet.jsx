
import { useAccount, WagmiProvider } from 'wagmi'

import "./index.css";

import Account from "./account.jsx";
import { WalletOptions } from "./wallet-options.jsx";

export function ConnectWallet(){
  const { isConnected } = useAccount()
  if(isConnected) return <Account />
   return <WalletOptions />

}

import { useAccount } from "wagmi";
import Profile from "./profile";
import { ConnectWallet } from "./ConnectWallet";

export function Demo() {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? <Profile /> : <ConnectWallet />}
    </>
  );
}

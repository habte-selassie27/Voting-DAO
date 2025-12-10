// src/AuthGate.jsx
import { useAccount } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";

export function AuthGate({ children }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectWallet />;  // login screen
  }

  return children; // show dashboard
}

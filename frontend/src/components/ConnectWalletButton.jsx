// src/components/ConnectWalletButton.jsx
// import { useWallet } from "../hooks/useWallet.js";

// export default function ConnectWalletButton() {
//   const { isConnected, address, connectWallet, disconnectWallet, loading } =
//     useWallet();

//   if (loading) return <button disabled>Connecting...</button>;

//   if (!isConnected)
//     return <button onClick={connectWallet}>Connect Wallet</button>;

//   return (
//     <button onClick={disconnectWallet}>
//       {address.slice(0, 6)}…{address.slice(-4)} (Disconnect)
//     </button>
//   );
// }
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton() {
  return <ConnectButton />;
}

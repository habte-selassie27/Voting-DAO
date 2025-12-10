// // import { useState } from "react";
// // import { ethers } from "ethers";

// // export function useWallet() {
// //   const [account, setAccount] = useState(null);
// //   const [provider, setProvider] = useState(null);
// //   const [signer, setSigner] = useState(null);

// //   const connect = async () => {
// //     if (!window.ethereum) {
// //       alert("MetaMask not found!");
// //       return;
// //     }

// //     try {
// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       await provider.send("eth_requestAccounts", []);

// //       const signer = await provider.getSigner();
// //       const account = await signer.getAddress();

// //       setProvider(provider);
// //       setSigner(signer);
// //       setAccount(account);

// //       console.log("Connected:", account);
// //     } catch (err) {
// //       console.error("Connection failed:", err);
// //     }
// //   };

// //   const disconnect = () => {
// //     setAccount(null);
// //     setProvider(null);
// //     setSigner(null);
// //     console.log("Disconnected");
// //   };

// //   return {
// //     connect,
// //     disconnect,
// //     account,
// //     provider,
// //     signer,
// //     connected: !!account,
// //   };
// // }
// // src/hooks/useWalletManual.js
// import { useState } from "react";
// import { ethers } from "ethers";

// export function useWallet() {
//   const [account, setAccount] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);

//   const connect = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       // Request accounts explicitly
//       const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
//       const prov = new ethers.BrowserProvider(window.ethereum);
//       const sign = await prov.getSigner();

//       setAccount(selectedAccount);
//       setProvider(prov);
//       setSigner(sign);
//     } catch (err) {
//       console.error("Connection failed:", err);
//     }
//   };

//   const disconnect = () => {
//     setAccount(null);
//     setProvider(null);
//     setSigner(null);
//   };

//   return { account, connected: !!account, connect, disconnect, provider, signer };
// }



// src/hooks/useWalletManual.js
import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      // Request accounts manually
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      const prov = new ethers.BrowserProvider(window.ethereum); // ethers v6
      const sign = await prov.getSigner();

      setAccount(selectedAccount);
      setProvider(prov);
      setSigner(sign);
      console.log("Connected:", selectedAccount);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    console.log("Disconnected");
  };

  return { account, connected: !!account, connect, disconnect, provider, signer };
}

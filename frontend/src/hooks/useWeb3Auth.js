// // // import { useEffect, useState } from "react";
// // // import { Web3Auth } from "@web3auth/modal";
// // // import { CHAIN_NAMESPACES } from "@web3auth/base";
// // // import { ethers } from "ethers";

// // // export function useWeb3Auth() {
// // //   const [web3auth, setWeb3auth] = useState(null);
// // //   const [provider, setProvider] = useState(null);
// // //   const [account, setAccount] = useState(null);
// // //   const [connected, setConnected] = useState(false);

// // //   // Initialize Web3Auth ONCE
// // //   useEffect(() => {
// // //     const init = async () => {
// // //       try {
// // //         const w3a = new Web3Auth({
// // //           clientId: "BMPyU9PZgP0uFzMLdbz92A-ho1dMLZXgnheEpxaOFygccbpYtT4cvFZWBlMEySEK6E_eNwwUuRstj8O-1LJOvPM", // KEEP THIS!
// // //           chainConfig: {
// // //             chainNamespace: CHAIN_NAMESPACES.EIP155,
// // //             chainId: "0x1", // Ethereum Mainnet
// // //             rpcTarget: "https://rpc.ankr.com/eth",
// // //           },
// // //         });

// // //         setWeb3auth(w3a);

// // //         // Important: Initialize BEFORE calling connect()
// // //         await w3a.initModal();

// // //         if (w3a.provider) {
// // //           handleProvider(w3a.provider);
// // //         }
// // //       } catch (err) {
// // //         console.error("Web3Auth init error:", err);
// // //       }
// // //     };

// // //     init();
// // //   }, []);

// // //   // Handle provider after connect
// // //   const handleProvider = async (provider) => {
// // //     try {
// // //       const ethersProvider = new ethers.BrowserProvider(provider);
// // //       const signer = await ethersProvider.getSigner();
// // //       const address = await signer.getAddress();

// // //       setProvider(ethersProvider);
// // //       setAccount(address);
// // //       setConnected(true);
// // //     } catch (err) {
// // //       console.error("Provider error:", err);
// // //     }
// // //   };

// // //   // Connect wallet
// // //   const connect = async () => {
// // //     try {
// // //       if (!web3auth) {
// // //         console.error("Web3Auth not initialized!");
// // //         return;
// // //       }

// // //       // FIX: modal MUST be initialized before this line
// // //       const web3authProvider = await web3auth.connect();
// // //       handleProvider(web3authProvider);
// // //     } catch (err) {
// // //       console.error("Web3Auth connect failed:", err);
// // //     }
// // //   };

// // //   // Disconnect
// // //   const disconnect = async () => {
// // //     if (!web3auth) return;
// // //     await web3auth.logout();
// // //     setProvider(null);
// // //     setAccount(null);
// // //     setConnected(false);
// // //   };

// // //   return {
// // //     account,
// // //     connected,
// // //     connect,
// // //     disconnect,
// // //   };
// // // }
// // // src/useWeb3Auth.js
// // import { useEffect, useState } from "react";
// // import { Web3Auth } from "@web3auth/modal";
// // import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// // import { ethers } from "ethers";

// // export function useWeb3Auth() {
// //   const [web3auth, setWeb3auth] = useState(null);
// //   const [provider, setProvider] = useState(null);
// //   const [account, setAccount] = useState(null);

// //   const clientId = "BMPyU9PZgP0uFzMLdbz92A-ho1dMLZXgnheEpxaOFygccbpYtT4cvFZWBlMEySEK6E_eNwwUuRstj8O-1LJOvPM"; // Replace this

// //   useEffect(() => {
// //     async function init() {
// //       try {
// //         const privateKeyProvider = new EthereumPrivateKeyProvider({
// //           config: {
// //             chainConfig: {
// //               chainId: "0x1",
// //               rpcTarget: "https://rpc.ankr.com/eth",
// //             },
// //           },
// //         });

// //         const w3a = new Web3Auth({
// //           clientId,
// //           web3AuthNetwork: "sapphire_devnet",
// //           privateKeyProvider,
// //         });

// //         setWeb3auth(w3a);

// //         await w3a.initModal(); // VALID IN MODAL v3

// //         if (w3a.provider) {
// //           setProvider(w3a.provider);
// //           await getAccount(w3a.provider);
// //         }
// //       } catch (err) {
// //         console.error("Web3Auth init error:", err);
// //       }
// //     }
// //     init();
// //   }, []);

// //   async function connect() {
// //     try {
// //       if (!web3auth) return alert("Web3Auth not ready");

// //       const p = await web3auth.connect();
// //       setProvider(p);
// //       await getAccount(p);
// //     } catch (err) {
// //       console.error("Web3Auth connect failed:", err);
// //     }
// //   }

// //   async function disconnect() {
// //     if (!web3auth) return;
// //     await web3auth.logout();
// //     setProvider(null);
// //     setAccount(null);
// //   }

// //   async function getAccount(p) {
// //     const ethersProvider = new ethers.BrowserProvider(p);
// //     const signer = await ethersProvider.getSigner();
// //     const addr = await signer.getAddress();
// //     setAccount(addr);
// //   }

// //   return {
// //     provider,
// //     account,
// //     connected: !!account,
// //     connect,
// //     disconnect,
// //   };
// // }
// // src/useWeb3Auth.js
// import { useEffect, useState } from "react";
// import { Web3Auth } from "@web3auth/modal";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { CHAIN_NAMESPACES } from "@web3auth/base";
// import { ethers } from "ethers";

// const clientId = "BMPyU9PZgP0uFzMLdbz92A-ho1dMLZXgnheEpxaOFygccbpYtT4cvFZWBlMEySEK6E_eNwwUuRstj8O-1LJOvPM"; // Replace!

// export function useWeb3Auth() {
//   const [web3auth, setWeb3auth] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const privateKeyProvider = new EthereumPrivateKeyProvider({
//           config: {
//             chainConfig: {
//               chainNamespace: CHAIN_NAMESPACES.EIP155,
//               chainId: "0x1", // Ethereum Mainnet
//               rpcTarget: "https://rpc.ankr.com/eth",
//             },
//           },
//         });

//         const w3a = new Web3Auth({
//           clientId,
//           web3AuthNetwork: "sapphire_devnet",
//           privateKeyProvider,
//         });

//         await w3a.initModal();

//         setWeb3auth(w3a);

//         if (w3a.provider) {
//           setProvider(w3a.provider);
//           await loadAccount(w3a.provider);
//         }
//       } catch (error) {
//         console.error("Web3Auth init error:", error);
//       }
//     };

//     init();
//   }, []);

//   const loadAccount = async (web3Provider) => {
//     const ethersProvider = new ethers.BrowserProvider(web3Provider);
//     const signer = await ethersProvider.getSigner();
//     const addr = await signer.getAddress();
//     setAccount(addr);
//   };

//   const connect = async () => {
//     try {
//       if (!web3auth) return;

//       const web3provider = await web3auth.connect();
//       setProvider(web3provider);

//       await loadAccount(web3provider);
//     } catch (error) {
//       console.error("Web3Auth connect failed:", error);
//     }
//   };

//   const disconnect = async () => {
//     if (!web3auth) return;
//     await web3auth.logout();
//     setProvider(null);
//     setAccount(null);
//   };

//   return {
//     connect,
//     disconnect,
//     provider,
//     account,
//     connected: !!account,
//   };
// }

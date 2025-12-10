// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Vote from "./pages/Vote.jsx";
import Results from "./pages/Results.jsx";
import CreateProposal from "./pages/CreateProposal.jsx";


import { getFHEInstance } from "./utils/fheInstance";


import { useAccount, useDisconnect } from "wagmi";


//            mekele

export default function App() {
  //const { account, connected, connect, disconnect } = useWeb3Auth();



  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();


const [sdkReady, setSdkReady] = useState(false);

useEffect(()=> {
  const initFHE = async () => {
      try {
        await getFHEInstance();
        setSdkReady(true);
      } catch (err) {
        console.error(err);
      }
    };
    initFHE();
}, [])

 if (!sdkReady) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading FHE SDK...</div>;
  }

  return (
   
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* NAVBAR */}
        <nav className="border-b border-gray-800 p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">Confidential DAO</Link>

          <div className="space-x-4 flex items-center">
            <Link className="hover:text-blue-400" to="/">Home</Link>
            <Link className="hover:text-blue-400" to="/vote">Vote</Link>
            <Link className="hover:text-blue-400" to="/results">Results</Link>
            <Link className="hover:text-blue-400" to="/create">Create Proposal</Link>
{isConnected && (
  <span className="bg-green-600 text-white px-3 py-1 rounded">
    {address.slice(0, 6)}...{address.slice(-4)}
  </span>
)}

<button
  onClick={() => disconnect()}
  className={`px-4 py-2 rounded text-white ${
    isConnected ? "bg-red-600" : "bg-blue-600"
  }`}
>
  {isConnected ? "Disconnect" : "Connect"}
</button>


            {/* <button
              onClick={connected ? disconnect : connect}
              className={`px-4 py-2 rounded text-white ${connected ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {connected ? "Disconnect Wallet" : "Connect Wallet"}
            </button>

            {connected && (
              <span className="bg-green-500 text-white px-4 py-2 rounded">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            )} */}
          </div>
        </nav>

        {/* ROUTES */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/results" element={<Results />} />
            <Route path="/create" element={<CreateProposal />} />
          </Routes>
        </div>
      </div>
    
  );
}



// src/hooks/useContractData.js
import useSWR from "swr";
import { ethers } from "ethers";

export function useContractData(contractAddress, abi, provider, methodName, args = []) {
  const fetcher = async () => {
    if (!provider) return null;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return await contract[methodName](...args);
  };

  const { data, error, mutate } = useSWR(
    provider ? [contractAddress, methodName, ...args] : null,
    fetcher,
    { refreshInterval: 5000 } // auto-refresh every 5s
  );

  return { data, error, mutate };
}

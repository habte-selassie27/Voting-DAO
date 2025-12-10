import { useReadContract } from "wagmi";
import { DAO_ADDRESS, DAO_ABI } from "../contracts/dao";

export function useProposalsList() {
  return useReadContract({
    address: DAO_ADDRESS,
    abi: DAO_ABI,
    functionName: "getAllProposals",
  });
}

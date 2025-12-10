import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy"; // This extends the HRE types automatically

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts(); // gets deployer from config

  console.log("Deploying contracts with:", deployer);

  const deployedProposalManager = await deploy("ProposalManager", {
    from: deployer,
    log: true,
  });
  console.log(`ProposalManager contract deployed at:`, deployedProposalManager.address);

  const deployedConfidentialVoting = await deploy("ConfidentialVoting", {
    from: deployer,
    log: true,
  });
  console.log(`ConfidentialVoting contract deployed at:`, deployedConfidentialVoting.address);

  const deployedTallyDecryption = await deploy("TallyDecryption", {
    from: deployer,
    log: true,
  });
  console.log(`TallyDecryption contract deployed at:`, deployedTallyDecryption.address);
};

export default func;
func.id = "deploy_proposal_confidential";
func.tags = ["ProposalManager", "ConfidentialVoting", "TallyDecryption"];

const { ethers } = require("hardhat");

async function main() {
  const TruthCheckStorage = await ethers.getContractFactory("TruthCheckStorage");
  const contract = await TruthCheckStorage.deploy();
  await contract.waitForDeployment();

  console.log(`✅ Contract deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

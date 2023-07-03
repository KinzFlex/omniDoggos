const hre = require("hardhat");

// async function main() {

//   const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
//   const nftMarketplace = await NFTMarketplace.deploy();

//   await nftMarketplace.deployed();

//   console.log("NFTMarketplace deployed to:", nftMarketplace.address);
// }
// async function main() {

//   const MintContract = await hre.ethers.getContractFactory("mint_contract");
//   const mintContract = await MintContract.deploy();

//   await mintContract.deployed();

//   console.log("Mint contract deployed to:", mintContract.address);
// }

async function main() {
  const MintContract = await hre.ethers.getContractFactory("mintContract");
  const mintContract = await MintContract.deploy();

  await mintContract.deployed();

  console.log("Mint contract deployed to:", mintContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

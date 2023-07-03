# SqueezeCollectorsDapp

## Step by step Project Setup

1. Step (Project Setup): npm install
2. Step (Install Metamask Wallet): https://metamask.io/download/
3. Step (Get Private Key): Metamask Wallet -> Accountdetails -> Export Private Key
4. Step (Create .secret file): Paste private key
5. Step (Start local network): npx hardhat node
6. Step (Import Testnet Accounts): Use pivate key of testnet accounts to import into metamask
7. Step (Done): Project should be runnning, if not below are common errors

## Start local environment:

1. Start local frontend server (port 8080)
   `npm run dev`
2. Start local server (execute in javascript debug terminal for debugging)
   `cd server && npm run test`

## Smart Contract Deployment:

1. The smart contract file is in the contracts folder "mintContract.sol".
2. After changes in the smart contract the contract has do be newly deployed and can not be updated.
3. To deploy the contract use:
   npx hardhat run scripts/deploy.js --network localhost
4. If successful we get an address in the terminal.
5. That address has to be pasted into the context/constants.js file.
6. If changes have be made to the smart contract we havee to replace the old mintContract.json file in the context folder with the newly created contract file in artifacts/contracts/mintContract.sol.

### Common Errors:

1. Nonce to low -> Delete Metasmask account history -> Settings -> Advanced -> Delete Activities
2. Wrong Network -> Delete Metasmask account history
3. Account address is not a contract -> Deploy smart contract newly

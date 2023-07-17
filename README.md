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

1. The smart contract file is in the contracts folder "omniDoggos.sol".
2. After changes in the smart contract the contract has do be newly deployed and can not be updated.
3. We have to deploy 2 contracts minimum to test the omnichain features. To deploy the contract use:
   npx hardhat --network arbitrum-goerli deploy --tags omniDoggos or  npx hardhat --network goerli deploy --tags omniDoggos or ...
4. We have to set the allowances in both contracts to interact with each other:
   npx hardhat --network goerli setTrustedRemote --target-network arbitrum-goerli --contract omniDoggos
   and vice versa
5. We have to set the Minimum Gas for the Destination Chain so the tokens can arrive on this chain
   npx hardhat --network goerli setMinDstGas --target-network arbitrum-goerli --contract omniDoggos --packet-type 1 --min-gas 100000
   and vice versa

### Common Errors:

1. Nonce to low -> Delete Metasmask account history -> Settings -> Advanced -> Delete Activities
2. Wrong Network -> Delete Metasmask account history
3. Account address is not a contract -> Deploy smart contract newly

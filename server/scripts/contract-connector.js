const Contract = require("web3-eth-contract");
require("dotenv").config();
var CONSTANTS = require("./constants");
const CONTRACT_ABI = CONSTANTS.CONTRACT_ABI;
const CONTRACT = process.env.CONTRACT_ADDRESS;
const DB_CONNECTOR = require("../db/db-connector");

// set provider for all later instances to use
Contract.setProvider(process.env.CONTRACT_URL || "http://localhost:8545/");

var contract = new Contract(CONTRACT_ABI, CONTRACT);

module.exports = {
  /**
   * Call contract getMinted() add fetch all holders
   */
  fetchHoldersFromContract() {
    contract.methods
      .getMinted()
      .call()
      .then((aMinted) => {
        this.saveScoresOfHolders(aMinted);
      });
  },
  /**
   * Comulate all Holders scores (two minted entires b< one addr -> score 2)
   * call addScoreToHolder() in db-connector for each address
   */
  saveScoresOfHolders(aMinted) {
    const oScoreValues = {};
    for (const oMint of aMinted) {
      if (oScoreValues[oMint.buyer]) {
        oScoreValues[oMint.buyer] += 1;
      } else {
        oScoreValues[oMint.buyer] = 1;
      }
    }
    for (const sAddress in oScoreValues) {
      if (Object.hasOwnProperty.call(oScoreValues, sAddress)) {
        const iScore = oScoreValues[sAddress];
        DB_CONNECTOR.addScoreToHolder(sAddress, iScore);
      }
    }
  },
};

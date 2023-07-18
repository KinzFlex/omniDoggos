const Contract = require("web3-eth-contract");
require("dotenv").config();
var CONSTANTS = require("./constants");
const CONTRACT_ABI = CONSTANTS.CONTRACT_ABI;

module.exports = {
  initContract(CONTRACT_URL, CONTRACT_ADDRESS) {
    Contract.setProvider(CONTRACT_URL || "http://localhost:8545/");
    this.contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  },

  getAllAddressAndNFTIDS(b) {
    return b
      ? {
          1: [11, 21],
          2: [31, 41, 51],
        }
      : {
          1: [1, 2],
          2: [3, 4, 5],
        };
  },
  /**
   * Call contract getMinted() add fetch all holders
   */
  /* fetchHoldersFromContract() {
    this.contract.methods
      .getMinted()
      .call()
      .then((aMinted) => {});
  }, */
};

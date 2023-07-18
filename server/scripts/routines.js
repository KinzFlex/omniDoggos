require("dotenv").config();
var dbConnector = require("../db/db-connector");
const ARBITRUM_WORKER = require("./contract-connector");

const ETHEREUM_WORKER = require("./contract-connector");
ARBITRUM_WORKER.initContract(
  process.env.ARBITRUM_URL,
  process.env.ARBITRUM_ADDRESS
);
ETHEREUM_WORKER.initContract(
  process.env.ETHEREUM_URL,
  process.env.ETHEREUM_ADDRESS
);

module.exports = {
  async calculateRankChange() {
    const newScores = await dbConnector.getScoreboard("score");
    const oldScores = await dbConnector.getScoreboard("oldScore");

    for (let i = 0; i < newScores.length; i++) {
      const newScore = newScores[i];
      const oldScoreIndex = oldScores.findIndex(
        (oldScore) => oldScore.addr === newScore.addr
      );
      const rankChange = oldScoreIndex - i;
      try {
        await dbConnector.updateRankChangeByAddr(
          newScore.addr,
          rankChange,
          newScore.score
        );
      } catch (error) {
        console.error(error);
      }
    }
  },

  async calculateNewBonusScore() {
    // fetch allAddrAndNFTIDs from contract
    const oArbHolders = ARBITRUM_WORKER.getAllAddressAndNFTIDS();
    const oEthHolders = ETHEREUM_WORKER.getAllAddressAndNFTIDS(true);
    // Update Arb NFTs
    for (const sAddr in oArbHolders) {
      const aNfts = oArbHolders[sAddr];
      for (const iNft of aNfts) {
        // check new chain -> rise bonus
        await dbConnector.updateChainCheckByNftId(iNft, "chainARB");
      }
    }

    // Update Ethereum Holder
    for (const sAddr in oEthHolders) {
      const aNfts = oEthHolders[sAddr];
      for (const iNft of aNfts) {
        // check new chain -> rise bonus
        await dbConnector.updateChainCheckByNftId(iNft, "chainETH");
      }
    }
    const oAllHolders = this.concatHolders(oArbHolders, oEthHolders);
    for (const sAddr in oAllHolders) {
      const aNftIds = oAllHolders[sAddr];
      let iHolderScore = 0;
      for (const iNftId of aNftIds) {
        iHolderScore += await dbConnector.calculateBonusOfNftById(iNftId);
      }
    }
    //save new score of addr locally
    // update scoreboard
  },

  concatHolders(oArbHolders, oEthHolders) {
    const oHolders = {};
    for (const sAddr in oArbHolders) {
      oHolders[sAddr] = oHolders[sAddr] || [];
      oHolders[sAddr] = oHolders[sAddr].concat(oArbHolders[sAddr]);
    }
    for (const sAddr in oEthHolders) {
      oHolders[sAddr] = oHolders[sAddr] || [];
      oHolders[sAddr] = oHolders[sAddr].concat(oEthHolders[sAddr]);
    }
    return oHolders;
  },
};

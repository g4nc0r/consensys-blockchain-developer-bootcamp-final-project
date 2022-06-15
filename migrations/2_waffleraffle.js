const WaffleRaffle = artifacts.require("WaffleRaffle");

module.exports = function (deployer) {
  deployer.deploy(WaffleRaffle);
};

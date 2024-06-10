const PriceTransfer = artifacts.require("funds");

module.exports = function (deployer) {
  deployer.deploy(PriceTransfer);
};

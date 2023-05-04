var CourseBlock = artifacts.require("./CourseBlock.sol");
var CourseBlockFlatened = artifacts.require("./CourseBlockFlatened.sol");

module.exports = function(deployer) {
  deployer.deploy(CourseBlock);
  deployer.deploy(CourseBlockFlatened);
};

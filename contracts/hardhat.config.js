require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  defaultNetwork: "optimism",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    optimism: {
      url: process.env.OPTIMISM_GOERLI_RPC_URL ?? "https://goerli.optimism.io",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

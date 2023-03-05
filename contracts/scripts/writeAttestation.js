const hre = require("hardhat");
const { assestationABI } = require("./abi");
require("dotenv").config();

const CONTRACT_ADDRESS = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";

function encodeRawKey(rawKey) {
  if (rawKey.length < 32) return hre.ethers.utils.formatBytes32String(rawKey);

  const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(rawKey));
  return hash.slice(0, 64) + "ff";
}

async function main() {
  const AttestationStation = await hre.ethers.getContractFactory(
    "AttestationStation"
  );
  const attestationStation = AttestationStation.attach(CONTRACT_ADDRESS);

  const aboutAddr = "0x9c12939390052919aF3155f41Bf4160Fd3666A6f";
  const attendedKey = encodeRawKey("trustsight.trust");
  const subscoreKey1 = encodeRawKey("trustsight.defi.tokenomics");
  const subscoreKey2 = encodeRawKey("trustsight.defi.liquidity");
  const subscoreKey3 = encodeRawKey("trustsight.defi.governance");
  const subscoreKey4 = encodeRawKey("trustsight.defi.innovative");

  const attestation = {
    about: aboutAddr,
    key: attendedKey,
    val: 422,
  };
  const attestation1 = {
    about: aboutAddr,
    key: subscoreKey1,
    val: 455,
  };
  const attestation2 = {
    about: aboutAddr,
    key: subscoreKey2,
    val: 467,
  };
  const attestation3 = {
    about: aboutAddr,
    key: subscoreKey3,
    val: 401,
  };
  const attestation4 = {
    about: aboutAddr,
    key: subscoreKey4,
    val: 421,
  };

  const tx = await attestationStation.attest([
    attestation,
    attestation1,
    attestation2,
    attestation3,
    attestation4,
  ]);

  const receipt = await tx.wait();

  console.log("receipt: ", JSON.stringify(receipt, null, 2));
}

function attestationKey() {
  const goatAddr = "0x00000000000000000000000000000000000060A7";
  const attendedKey = encodeRawKey("trustsight.score");
  const attestation = {
    about: goatAddr,
    key: attendedKey,
    val: 1,
  };
  console.log(attendedKey);
}

async function addAttestation() {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.OPTIMISM_GOERLI_RPC_URL
  );
  const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY5, provider);
  const AttestationStation = await hre.ethers.getContractFactory(
    "AttestationStation"
  );
  const attestationStation = AttestationStation.attach(CONTRACT_ADDRESS);

  const aboutAddr = "0x9c12939390052919aF3155f41Bf4160Fd3666A6f";
  const attendedKey = encodeRawKey("trustsight.trust");

  const attestation = {
    about: aboutAddr,
    key: attendedKey,
    val: 500,
  };

  const tx = await attestationStation.connect(wallet).attest([attestation]);
  const receipt = await tx.wait();

  console.log("receipt: ", JSON.stringify(receipt, null, 2));
}

// attestationKey();
// main();
addAttestation();

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

  const goatAddr = "0x00000000000000000000000000000000000060A7";
  const attendedKey = encodeRawKey("trustsight.score");

  const attestation = {
    about: goatAddr,
    key: attendedKey,
    val: 1,
  };

  const tx = await attestationStation.attest([attestation]);
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

// attestationKey();
main();

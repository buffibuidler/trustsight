const hre = require("hardhat");
const fs = require("fs");

const CONTRACT_ADDRESS = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";
const CREATOR_ADDRESS = "0x15AE58Fd3570e74EBe89fDBc897d31f9a6945377";
const ABOUT_ADDRESS = "0x9c12939390052919aF3155f41Bf4160Fd3666A6f";

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

  const trustKey = encodeRawKey(`trustsight.trust`);

  const eventFilter = attestationStation.filters.AttestationCreated();
  const eventFilterByCreator =
    attestationStation.filters.AttestationCreated(CREATOR_ADDRESS);
  const eventFilterByRecipient = attestationStation.filters.AttestationCreated(
    null,
    ABOUT_ADDRESS
  );
  const eventFilterByKey = attestationStation.filters.AttestationCreated(
    null,
    null,
    trustKey
  );

  const pairEvent = attestationStation.filters.AttestationCreated(
    CREATOR_ADDRESS,
    ABOUT_ADDRESS
  );

  // console.log(contract.filters.AttestationCreated(creatorAddress))
  // Get a list of all the events that match the filter criteria
  attestationStation
    .queryFilter(pairEvent, 3451375)
    .then((events) => {
      // save data as a JSON file
      fs.writeFile("./result.json", JSON.stringify(events), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      console.log(`Found ${events.length} events:`);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

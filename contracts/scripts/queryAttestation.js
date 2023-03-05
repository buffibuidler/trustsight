const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";
const CREATOR_ADDRESS = "0x15AE58Fd3570e74EBe89fDBc897d31f9a6945377";

async function main() {
  const AttestationStation = await hre.ethers.getContractFactory(
    "AttestationStation"
  );
  const attestationStation = AttestationStation.attach(CONTRACT_ADDRESS);

  const eventFilter = attestationStation.filters.AttestationCreated();
  const eventFilterByCreator =
    attestationStation.filters.AttestationCreated(CREATOR_ADDRESS);
  const eventFilterByRecipient = attestationStation.filters.AttestationCreated(
    null,
    creatorAddress
  );
  const eventFilterByKey = attestationStation.filters.AttestationCreated(
    null,
    null,
    "0x747275737473696768742e73636f726500000000000000000000000000000000"
  );

  // console.log(contract.filters.AttestationCreated(creatorAddress))
  // Get a list of all the events that match the filter criteria
  attestationStation
    .queryFilter(eventFilterByKey, 3451375)
    .then((events) => {
      for (const event of events) {
        console.log(event);
      }
      console.log(`Found ${events.length} events:`);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

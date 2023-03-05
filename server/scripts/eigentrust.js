const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";
const CREATOR_ADDRESS = "0x15AE58Fd3570e74EBe89fDBc897d31f9a6945377";
const ABOUT_ADDRESS = "0x9c12939390052919aF3155f41Bf4160Fd3666A6f";

function createPool() {
  return {
    trustPool: {},
    initialTrust: {},
    certainty: 0.001,
    max: 200,
    alpha: 0.95,
  };
}

function encodeRawKey(rawKey) {
  if (rawKey.length < 32) return hre.ethers.utils.formatBytes32String(rawKey);

  const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(rawKey));
  return hash.slice(0, 64) + "ff";
}

function addTrust(pool, creator, recipient, score) {
  if (!creator in pool.trustPool) {
    pool.trustPool[creator] = {};
  }
  pool.trustPool[creator][recipient] = score;
}

function initialTrust(pool, recipient, score) {
  pool.initialTrust[recipient] = score;
}

function computeTrust(pool) {
  if (Object.keys(pool.initialTrust).length === 0) {
    return {};
  }

  let prevIteration = pool.initialTrust;

  for (let i = 0; i < pool.max; i++) {
    let currIteration = computeIteration(pool, prevIteration);
    let d = avgD(prevIteration, currIteration);
    prevIteration = currIteration;
    if (d < pool.certainty) {
      break;
    }
  }
}

function computeIteration(pool, prevIteration) {
  const t1 = {};
  Object.entries(prevIteration).forEach(([creator, score1]) => {
    Object.entries(pool.trustPool).forEach(([recipient, score2]) => {
      if (creator != recipient) {
        t1[recipient] += score1 * score2;
      }
    });
  });

  let highestTrustScore = 0;
  Object.entries(t1).forEach(([_, score]) => {
    if (score > highestTrustScore) {
      highestTrustScore = score;
    }
  });

  Object.entries(t1).forEach(([key, score]) => {
    t1[key] =
      (score / highestTrustScore) * pool.alpha +
      (1 - pool.alpha) * pool.initialTrust[key];
  });

  return t1;
}

function avgD(prevIteration, currIteration) {
  let d = 0;

  Object.entries(currIteration).forEach(([key, score]) => {
    d += Math.abs(score - prevIteration[key]);
  });

  d = d / Object.entries(prevIteration).length;

  return d;
}

async function main() {
  /*
   *
   */
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

  const trustEvent = attestationStation.filters.AttestationCreated(
    null,
    null,
    trustKey
  );

  // console.log(contract.filters.AttestationCreated(creatorAddress))
  // Get a list of all the events that match the filter criteria
  attestationStation
    .queryFilter(trustEvent, 3451375)
    .then(async (events) => {
      events.forEach(({ args }) => {
        const creator = args[0];
        const recipient = args[1];
        const encodedValue = args[3];
        const decodedValue = Number(encodedValue);
        const pool = createPool();
        addTrust(pool, creator, recipient, decodedValue);
      });
      initialTrust(pool, recipient, decodedValue);
      const outputPool = computeTrust(pool);

      for (let i = 0; i < Object.entries(outputPool.trustPool).length; i++) {
        const [key, value] = Object.entries(outputPool.trustPool)[i];
        await addAttestation(key, value);
      }
      console.log(`Updated ${events.length} scores`);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

async function addAttestation(recipient, score) {
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
    about: recipient,
    key: attendedKey,
    val: score,
  };

  const tx = await attestationStation.connect(wallet).attest([attestation]);
  const receipt = await tx.wait();

  console.log("receipt: ", JSON.stringify(receipt, null, 2));
}

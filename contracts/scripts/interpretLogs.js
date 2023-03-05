const hre = require("hardhat");
const fs = require("fs");

function interpretLogs() {
  fs.readFile("result.json", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const events = JSON.parse(data);

    const valueMap = {};

    events.forEach(({ args }) => {
      const encodedKey = args[2];
      const encodedValue = args[3];
      const decodedValue = Number(encodedValue);
      //   const decodedValue = hre.ethers.utils.toUtf8String(encodedValue);
      console.log("decode: ", decodedValue);

      valueMap[encodedKey] = decodedValue;
    });

    fs.writeFile("decoded.json", JSON.stringify(valueMap), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

interpretLogs();

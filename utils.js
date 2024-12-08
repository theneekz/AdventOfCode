const fs = require("fs");

const getInput = (directory, filename = "/input.txt") => {
  return fs.readFileSync(directory + filename, "utf8");
};

const getInputArray = (directory, filename = "/input.txt") => {
  const input = getInput(directory, filename);
  return input.split("\n");
};

const print = (input, space = 2, asText = false) => {
  if (asText) {
    console.log("\n");
    console.log(input.map((cols) => cols.join("")).join("\n"));
    console.log("\n");
  } else {
    console.log(JSON.stringify(input, null, space));
  }
};

const arrayEquals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const deepClone = (input) => JSON.parse(JSON.stringify(input));

module.exports = { getInputArray, getInput, print, arrayEquals, deepClone };

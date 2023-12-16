const fs = require("fs");

const getInput = (directory, filename = "/input.txt") => {
  const input = fs.readFileSync(directory + filename, "utf8");
  return input;
};

const getInputArray = (directory, filename = "/input.txt") => {
  const input = getInput(directory, filename);
  const inputArr = input.split("\n");
  return inputArr;
};

const print = (input, space = 2) => {
  console.log(JSON.stringify(input, null, space));
};

module.exports = { getInputArray, getInput, print };

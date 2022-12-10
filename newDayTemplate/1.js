/*

*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/test1.txt");

}

console.log(main());

console.log("Time", Date.now() - start, "ms");

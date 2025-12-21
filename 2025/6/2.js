/*
--- Part Two ---
The big cephalopods come back to check on how things are going. When they see that your grand total doesn't match the one expected by the worksheet, they realize they forgot to explain how to read cephalopod math.

Cephalopod math is written right-to-left in columns. Each number is given in its own column, with the most significant digit at the top and the least significant digit at the bottom. (Problems are still separated with a column consisting only of spaces, and the symbol at the bottom of the problem is still the operator to use.)

Here's the example worksheet again:

123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +
Reading the problems right-to-left one column at a time, the problems are now quite different:

The rightmost problem is 4 + 431 + 623 = 1058
The second problem from the right is 175 * 581 * 32 = 3253600
The third problem from the right is 8 + 248 + 369 = 625
Finally, the leftmost problem is 356 * 24 * 1 = 8544
Now, the grand total is 1058 + 3253600 + 625 + 8544 = 3263827.

Solve the problems on the math worksheet again. What is the grand total found by adding together all of the answers to the individual problems?

Your puzzle answer was 9029931401920.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((line) =>
    line.split("")
  );

  const separatorIndexes = [-1];

  for (let i = 0; i < input[0].length; i++) {
    let allEmpty = true;
    for (let j = 0; j < input.length; j++) {
      if (input[j][i] !== " ") {
        allEmpty = false;
      }
    }
    if (allEmpty) {
      separatorIndexes.push(i);
    }
  }

  let total = 0;
  let nums = [];
  let operand = "";
  for (let i = input[0].length - 1; i >= -1; i--) {
    if (separatorIndexes.includes(i)) {
      let colResult = 0;
      if (operand === "+") {
        colResult = nums.reduce((a, b) => a + b, 0);
      } else if (operand === "*") {
        colResult = nums.reduce((a, b) => a * b, 1);
      }
      total += colResult;
      nums = [];
      operand = "";
      continue;
    }

    let currentNumStr = "";
    for (let j = 0; j < input.length; j++) {
      let current = input[j][i];
      if (j !== input.length - 1 && current !== " ") {
        currentNumStr += current;
      }
      if (j == input.length - 1 && current !== " ") {
        operand = current;
      }
    }
    if (currentNumStr) {
      nums.push(Number(currentNumStr));
    }
  }

  return total;
}

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 21 ms

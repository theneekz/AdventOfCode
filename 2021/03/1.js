/*
--- Day 3: Binary Diagnostic ---
The submarine has been making some odd creaking noises, so you ask it to produce a diagnostic report just in case.

The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine. The first parameter to check is the power consumption.

You need to use the binary numbers in the diagnostic report to generate two new binary numbers (called the gamma rate and the epsilon rate). The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report. For example, given the following diagnostic report:

00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.

The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.

The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.

So, the gamma rate is the binary number 10110, or 22 in decimal.

The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.

Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)
*/

const { getInputArray } = require("../../utils");
//nested array of binary input, split into digits
const inputArray = getInputArray(__dirname).map((x) =>
  x.split("").map((i) => parseInt(i, 10))
);
//initial state for keeping count of zeros and ones for each digit of each input (12 digits each)
let initialState = [];
for (let i = 0; i < 12; i++) {
  initialState.push({ zero: 0, one: 0 });
}

const output = inputArray.reduce((prev, curr, inputIndex) => {
  const isLastNumber = inputIndex === inputArray.length - 1;
  curr.forEach((digit, digitIndex) => {
    //count the 0s and 1s
    digit ? (prev[digitIndex].one += 1) : (prev[digitIndex].zero += 1);

    if (isLastNumber) {
      //replace the count obj with the gamma and epsilon digit
      const zeroIsGamma = prev[digitIndex].zero > prev[digitIndex].one;
      prev[digitIndex] = {
        gamma: zeroIsGamma ? 0 : 1,
        epsilon: zeroIsGamma ? 1 : 0,
      };
    }
  });

  if (isLastNumber) {
    let gamma = "";
    let epsilon = "";
    //add to variables as strings to concat
    prev.forEach((obj) => {
      gamma += obj.gamma;
      epsilon += obj.epsilon;
    });
    //parseInt with base 2 to convert from binary to decimal
    return parseInt(gamma, 2) * parseInt(epsilon, 2);
  }

  return prev;
}, initialState);

console.log(output); //3912944

/*
--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?

Your puzzle answer was 53539.
 */

const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt");

  const map = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  return input.reduce((p, c) => {
    const regex = /(?=((\d)|one|two|three|four|five|six|seven|eight|nine))/gm;
    const group = c.matchAll(regex);
    const digits = [];
    for (const match of group) {
      digits.push(match[1]);
    }
    const [first, last] = [digits[0], digits[digits.length - 1]];
    const calibration = Number(`${map[first] || first}${map[last] || last}`);
    return p + calibration;
  }, 0);
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

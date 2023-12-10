/*
--- Part Two ---
Of course, it would be nice to have even more history included in your report. Surely it's safe to just extrapolate backwards as well, right?

For each history, repeat the process of finding differences until the sequence of differences is entirely zero. Then, rather than adding a zero to the end and filling in the next values of each previous sequence, you should instead add a zero to the beginning of your sequence of zeroes, then fill in new first values for each previous sequence.

In particular, here is what the third example history looks like when extrapolating back in time:

5  10  13  16  21  30  45
  5   3   3   5   9  15
   -2   0   2   4   6
      2   2   2   2
        0   0   0
Adding the new values on the left side of each sequence from bottom to top eventually reveals the new left-most history value: 5.

Doing this for the remaining example data above results in previous values of -3 for the first history and 0 for the second history. Adding all three new values together produces 2.

Analyze your OASIS report again, this time extrapolating the previous value for each history. What is the sum of these extrapolated values?

3064 too high
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  let input = getInputArray(__dirname);
  input = input.map((line) => line.split(" ").map((x) => Number(x)));
  const missingValues = [];
  for (const line of input) {
    const pattern = findPrevInPattern(line)[0];
    missingValues.push(line[0] - pattern);
  }
  return missingValues.reduce((a, b) => a + b, 0);
}

const findPrevInPattern = (arr) => {
  if (arr.filter((x) => !!x).length === 0) return arr;
  const diffs = [];

  for (let i = 1; i < arr.length; i++) {
    const diff = arr[i] - arr[i - 1];
    diffs.push(diff);
  }

  const diffOfDiffs = findPrevInPattern(diffs);
  const prev = diffs[0] - diffOfDiffs[0];

  return [prev, ...diffs];
};

console.log(main());

console.log("Time", Date.now() - start, "ms");

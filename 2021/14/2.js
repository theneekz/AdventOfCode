/*
--- Part Two ---
The resulting polymer isn't nearly strong enough to reinforce the submarine. You'll need to run more steps of the pair insertion process; a total of 40 steps should do it.

In the above example, the most common element is B (occurring 2192039569602 times) and the least common element is H (occurring 3849876073 times); subtracting these produces 2188189693529.

Apply 40 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?
*/

const { getInput, getInputArray, print } = require("../../utils");
const input = getInput(__dirname);
const start = Date.now();
const steps = 40;
let [poly, rules] = input.split("\n\n");
rules = rules.split("\n");
rules = rules.reduce((p, c) => {
  const [key, val] = c.split(" -> ");
  p[key] = val;
  return p;
}, {});

let finalCounts = {};
poly = poly.split("");
poly.forEach((letter) =>
  finalCounts[letter] ? (finalCounts[letter] += 1) : (finalCounts[letter] = 1)
);

// initialize memo
let memo = poly.reduce((p, c, i) => {
  if (i < poly.length - 1) {
    let key = c + poly[i + 1];
    p[key] ? (p[key] += 1) : (p[key] = 1);
  }
  return p;
}, {});

const step = (i) => {
  const entries = Object.entries(memo);
  // loop through object with current count of each pair of letters
  for (const [key, val] of entries) {
    if (val !== 0) {
      //all of the pairs are going to split
      memo[key] -= val;
      //get new polymer for pair
      let newLetter = rules[key];
      let [preceding, following] = key.split("");
      //make two new pairs using the new letter
      let childA = preceding + newLetter;
      let childB = newLetter + following;
      //if they exist on memo, incrememnt, else add them to the memo
      memo[childA] ? (memo[childA] += val) : (memo[childA] = val);
      memo[childB] ? (memo[childB] += val) : (memo[childB] = val);
      //since only the new letter would be added to the poly string, increment finalCounts here
      finalCounts[newLetter]
        ? (finalCounts[newLetter] += val)
        : (finalCounts[newLetter] = val);
    }
  }
};

for (let i = 0; i < steps; i++) {
  step(i);
}

const entries = Object.entries(finalCounts);

const sortedCounts = Object.values(finalCounts).sort((a, b) => a - b);

console.log(sortedCounts[sortedCounts.length - 1] - sortedCounts[0]); //4807056953866

console.log("Time", Date.now() - start, "ms"); //11

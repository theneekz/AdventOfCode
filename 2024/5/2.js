/*
--- Part Two ---
While the Elves get to work printing the correctly-ordered updates, you have a little time to fix the rest of them.

For each of the incorrectly-ordered updates, use the page ordering rules to put the page numbers in the right order. For the above example, here are the three incorrectly-ordered updates and their correct orderings:

75,97,47,61,53 becomes 97,75,47,61,53.
61,13,29 becomes 61,29,13.
97,13,75,29,47 becomes 97,75,47,29,13.
After taking only the incorrectly-ordered updates and ordering them correctly, their middle page numbers are 47, 29, and 47. Adding these together produces 123.

Find the updates which are not in the correct order. What do you get if you add up the middle page numbers after correctly ordering just those updates?
 */
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInput(__dirname, "/input.txt");
  const [rawRules, allUpdates] = input.split("\n\n").map((x) => x.split("\n"));
  const rules = rawRules.map((x) => x.split("|").map(Number));
  let result = 0;

  for (const line of allUpdates) {
    const update = line.split(",").map(Number);
    const filteredRules = rules.filter(
      ([a, b]) => update.includes(a) && update.includes(b)
    );
    // Build a "key" of what the correct order should be
    let key = [];
    let queue = [...filteredRules];
    // Will end up leaving one in the queue to avoid pain
    while (queue.length > 1) {
      // Find the lowest/leftmost number remaining in the queue by scoring each remaining number
      let tempKey = {};
      for (const [l, r] of queue) {
        tempKey[r] = !tempKey[r] ? 1 : tempKey[r]++;
        if (!tempKey[l]) {
          tempKey[l] = 0;
        }
      }
      const lowestScore = Number(
        Object.entries(tempKey).filter(([val, score]) => score === 0)[0][0]
      );
      key.push(lowestScore);
      // Remove any rules containing the lowest scored number
      queue = queue.filter((rule) => !rule.includes(lowestScore));
    }
    // Finally insert the last pair, already ordered
    key.push(queue[0][0], queue[0][1]);

    const isValid = JSON.stringify(key) == JSON.stringify(update);
    if (!isValid) {
      result += key[Math.round((key.length - 1) / 2)];
    }
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

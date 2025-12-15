/*
--- Part Two ---
The Elves start bringing their spoiled inventory to the trash chute at the back of the kitchen.

So that they can stop bugging you when they get new inventory, the Elves would like to know all of the IDs that the fresh ingredient ID ranges consider to be fresh. An ingredient ID is still considered fresh if it is in any range.

Now, the second section of the database (the available ingredient IDs) is irrelevant. Here are the fresh ingredient ID ranges from the above example:

3-5
10-14
16-20
12-18
The ingredient IDs that these ranges consider to be fresh are 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, and 20. So, in this example, the fresh ingredient ID ranges consider a total of 14 ingredient IDs to be fresh.

Process the database file again. How many ingredient IDs are considered to be fresh according to the fresh ingredient ID ranges?

Your puzzle answer was 366181852921027.
*/
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  let [freshIdRanges, unusedAllIds] = getInput(__dirname, "/input.txt")
    .split("\n\n")
    .map((x) => x.split("\n"));
  freshIdRanges = freshIdRanges
    .map((range) => range.split("-").map(Number))
    .sort((a, b) => a[0] - b[0]);

  let allFreshIds = [];

  for (let [currentMin, currentMax] of freshIdRanges) {
    let current = {
      min: currentMin,
      max: currentMax,
    };

    if (!allFreshIds.length) {
      allFreshIds.push(current);
      continue;
    }

    let skip = false;
    for (let i = 0; i < allFreshIds.length; i++) {
      let { min, max } = allFreshIds[i];

      // Min is within another range but max is out
      if (currentMin >= min && currentMin <= max && currentMax > max) {
        allFreshIds[i].max = currentMax;
        skip = true;
      }
      // Max is within another range but min is out
      else if (currentMin < min && currentMax >= min && currentMax <= max) {
        allFreshIds[i].min = currentMin;
        skip = true;
      }
      // Entire range is consumed by another
      else if (currentMin >= min && currentMax <= max) {
        skip = true;
        break;
        // Range exceeds both ends
      } else if (currentMin < min && currentMax > max) {
        console.error({ current, min, max });
        throw Error("range exceeds both ends");
      }
    }

    if (!skip) {
      allFreshIds.push(current);
    }
  }

  return allFreshIds.reduce((p, c, i) => {
    return p + (c.max - c.min) + 1;
  }, 0);
}

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 6ms

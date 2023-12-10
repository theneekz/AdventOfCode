/*
--- Part Two ---
The sandstorm is upon you and you aren't any closer to escaping the wasteland. You had the camel follow the instructions, but you've barely left your starting position. It's going to take significantly more steps to escape!

What if the map isn't for people - what if the map is for ghosts? Are ghosts even bound by the laws of spacetime? Only one way to find out.

After examining the maps a bit longer, your attention is drawn to a curious fact: the number of nodes with names ending in A is equal to the number ending in Z! If you were a ghost, you'd probably just start at every node that ends with A and follow all of the paths at the same time until they all simultaneously end up at nodes that end with Z.

For example:

LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
Here, there are two starting nodes, 11A and 22A (because they both end with A). As you follow each left/right instruction, use that instruction to simultaneously navigate away from both nodes you're currently on. Repeat this process until all of the nodes you're currently on end with Z. (If only some of the nodes you're on end with Z, they act like any other node and you continue as normal.) In this example, you would proceed as follows:

Step 0: You are at 11A and 22A.
Step 1: You choose all of the left paths, leading you to 11B and 22B.
Step 2: You choose all of the right paths, leading you to 11Z and 22C.
Step 3: You choose all of the left paths, leading you to 11B and 22Z.
Step 4: You choose all of the right paths, leading you to 11Z and 22B.
Step 5: You choose all of the left paths, leading you to 11B and 22C.
Step 6: You choose all of the right paths, leading you to 11Z and 22Z.
So, in this example, you end up entirely on nodes that end in Z after 6 steps.

Simultaneously start on every node that ends with A. How many steps does it take before you're only on nodes that end with Z?

23977527174353
*/

const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname);

  const instructions = input[0].split("");
  const [STARTS, map] = getStartingNodesAndMap(input.slice(2));
  let currents = [...STARTS];
  let steps = [];

  for (let i = 0; i < currents.length; i++) {
    let current = currents[i];
    let j = -1;
    let step = 0;

    while (!hasEnded(current)) {
      step++;
      j++;
      if (j === instructions.length) j = 0;
      const direction = instructions[j];
      current = map[current][direction];
    }
    steps.push(step);
  }

  return leastCommonMultipleArray(steps);
}

function getStartingNodesAndMap(input) {
  const starts = [];

  const map = input.reduce((p, c, i) => {
    const [node, L, R] = c.match(/(\w){3}/g);
    if (node.charAt(2) === "A") starts.push(node);

    p[node] = { L, R };
    return p;
  }, {});

  return [starts, map];
}

function hasEnded(a) {
  return a.includes("Z");
}

const leastCommonMultipleArray = (a) => a.reduce(leastCommonMultiple, 1);

const leastCommonMultiple = (a, b) => (a * b) / euclid(a, b);

const euclid = (a, b) => {
  const remainder = a % b;
  if (remainder === 0) return b;
  return euclid(b, remainder);
};

console.log(main());

console.log("Time", Date.now() - start, "ms");

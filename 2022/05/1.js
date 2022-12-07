/*
--- Day 5: Supply Stacks ---
The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]
[N] [C]
[Z] [M] [P]
 1   2   3
In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3
Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3
Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3
The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?

Your puzzle answer was FCVRLMVQP.

--- Part Two ---
As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]
[N] [C]
[Z] [M] [P]
 1   2   3
Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]
[N] [C]
[Z] [M] [P]
 1   2   3
However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3
Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3
Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3
In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?

Your puzzle answer was RWLWGJGFD.
*/
const { getInput } = require("../../utils");
const input = getInput(__dirname);
const start = Date.now();

const main = () => {
  // Separate graph of stacks and instructions
  const [stacks, instructions] = input.split("\n\n");
  // Convert stacks to be a map of arrays
  const stackMap = createStackMap(stacks);
  // For each instruction
  instructions.split("\n").forEach((row) => {
    // Get crate quantity, stack start, and stack end
    let [quantity, start, end] = parseInstruction(row);
    // Move crates
    move(quantity, stackMap[start], stackMap[end]);
  });
  // Combine top crates into string
  const result = getTopCratesOnly(stackMap);
  console.log(result);
};

// Creates obj whose keys will be stack numbers and values will be arrays of crates
function createStackMap(stacks) {
  // {
  //   1: [Z, N],
  //   2: [M, C, D],
  //   3: [P]
  // }
  const stackMap = {};
  const inputRows = stacks.split("\n");
  // For every row in the stack input, besides the last one that is only stack numbers
  for (let i = 0; i < inputRows.length - 1; i++) {
    const row = inputRows[i]; // "[N] [C]"
    // We know that stack 1 is index 1, stack 2 is index 5, and stack 3 is index 9, etc
    for (
      let crateIndex = 1, stack = 1;
      crateIndex < row.length;
      crateIndex += 4, stack++
    ) {
      // The character at this index could be blank or be a crate letter
      const crate = row[crateIndex].trim();
      // Create the array for the current stack if it doesn't already exist
      if (!stackMap[stack]) stackMap[stack] = [];
      // If there is a crate add it to the beginning of the stack
      if (crate) stackMap[stack].unshift(crate);
    }
  }
  return stackMap;
}

// Convert a string instruction into a quantity, start stack and end stack
// "move 1 from 2 to 1" -> [1, "2", "1"]
function parseInstruction(str) {
  let [quantity, startAndEnd] = str.split(" from "); // ['move 1', '2 to 1']
  // Convert quantity to integer
  quantity = Number(quantity.slice(5));
  const [start, end] = startAndEnd.split(" to ");
  return [quantity, start, end];
}

// Move n number of crates from start array to end array
function move(quantity, start, end) {
  // Remove n number of crates from the end of the array
  const pickedUpCrates = start.splice(-1 * quantity);
  // Crane can only move one by one
  end.push(...pickedUpCrates.reverse()); // for part 1
  // Crane can move more than one
  // end.push(...pickedUpCrates); // for part 2
}

function getTopCratesOnly(stackMap) {
  let result = "";
  // Stack numbers start at 1
  for (let i = 1; i <= Object.keys(stackMap).length; i++) {
    // Access the last element of each stack and add to result
    result += stackMap[i.toString()].pop();
  }
  return result;
}

main();
console.log("Time", Date.now() - start, "ms");

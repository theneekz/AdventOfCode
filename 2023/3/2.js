/*
--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?

Your puzzle answer was 87287096.
*/

const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  let input = getInputArray(__dirname);
  input = input.map((line) => line.split(""));

  let gears = {};

  for (let y = 0; y < input.length; y++) {
    const line = input[y];

    for (let start = 0; start < line.length; start++) {
      let char = line[start];

      if (!isNum(char)) continue;

      let fullNumber = char;
      let end = start + 1;

      while (isNum(line[end])) {
        fullNumber += line[end];
        end++;
      }

      const left = start > 0 ? start - 1 : 0;
      // right is 1 further than it should be for easier slicing
      const right = end === line.length - 1 ? end : end + 1;
      if (y > 0) {
        // Check up
        const lineAbove = input[y - 1];
        const adjacentAbove = lineAbove.slice(left, right);
        const gearIndices = getGearIndices(adjacentAbove, left);
        if (gearIndices !== null) {
          addToGearsMap(fullNumber, gears, y - 1, gearIndices);
        }
      }

      if (y < input.length - 1) {
        // Check down
        const lineBelow = input[y + 1];
        const adjacentBelow = lineBelow.slice(left, right);
        const gearIndices = getGearIndices(adjacentBelow, left);
        if (gearIndices !== null) {
          addToGearsMap(fullNumber, gears, y + 1, gearIndices);
        }
      }

      if (left > 0) {
        // Check left
        const charLeft = line[start - 1];
        if (isGear(charLeft)) {
          addToGearsMap(fullNumber, gears, y, [left]);
        }
      }

      if (right > end) {
        // Check right using "end", as right is only meant for easy slices above
        const charRight = line[end];
        if (isGear(charRight)) {
          addToGearsMap(fullNumber, gears, y, [end]);
        }
      }
      start = end;
    }
  }

  return Object.values(gears).reduce((p, c) => {
    if (c.length == 1) return p;
    const gearRatio = c.reduce((i, j) => i * j, 1);
    return p + gearRatio;
  }, 0);
}

const isNum = (n) => /[0-9]/g.test(n);

const isGear = (n) => n === "*";

const getGearIndices = (a, startingX) => {
  let currentGearIndex = a.indexOf("*");
  if (currentGearIndex === -1) return null;

  const indices = [];

  while (currentGearIndex !== -1) {
    indices.push(currentGearIndex + startingX);
    currentGearIndex = a.indexOf("*", currentGearIndex + 1);
  }

  return indices;
};

const addToGearsMap = (fullNumber, gears, y, xArray) => {
  xArray.forEach((x) => {
    const coords = JSON.stringify([x, y]);
    gears[coords]?.push(Number(fullNumber)) ||
      (gears[coords] = [Number(fullNumber)]);
  });
};

console.log(main());

console.log("Time", Date.now() - start, "ms");

/*
--- Part Two ---
It seems like the individual flashes aren't bright enough to navigate. However, you might have a better option: the flashes seem to be synchronizing!

In the example above, the first time all octopuses flash simultaneously is step 195:

After step 193:
5877777777
8877777777
7777777777
7777777777
7777777777
7777777777
7777777777
7777777777
7777777777
7777777777

After step 194:
6988888888
9988888888
8888888888
8888888888
8888888888
8888888888
8888888888
8888888888
8888888888
8888888888

After step 195:
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
If you can calculate the exact moments when the octopuses will all flash simultaneously, you should be able to navigate through the cavern. What is the first step during which all octopuses flash?
*/

const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname);
const start = Date.now();

let grid = input.map((row) => row.split("").map((x) => Number(x)));

const arrayDeepClone = (arr) => {
  let result = [];
  for (const row of arr) {
    let rowCopy = [];
    for (const col of row) {
      rowCopy.push([col]);
    }
    result.push([...row]);
  }
  return result;
};
let lastGrid = arrayDeepClone(grid);
let flashes = 0;

const step = () => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0 && lastGrid[row][col] !== 0) {
        continue;
      }
      grid[row][col]++;
      if (grid[row][col] > 9) {
        handleFlash(row, col);
      }
    }
  }
  lastGrid = arrayDeepClone(grid);
};

const handleFlash = (row, col) => {
  flashes++;
  grid[row][col] = 0;
  //above neighbors
  handleAbsorbFlash(row - 1, col - 1);
  handleAbsorbFlash(row - 1, col);
  handleAbsorbFlash(row - 1, col + 1);
  //side neighbors
  handleAbsorbFlash(row, col - 1);
  handleAbsorbFlash(row, col + 1);
  //bottom neighbors
  handleAbsorbFlash(row + 1, col - 1);
  handleAbsorbFlash(row + 1, col);
  handleAbsorbFlash(row + 1, col + 1);
};

const handleAbsorbFlash = (row, col) => {
  if (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
    if (grid[row][col] === 0 && lastGrid[row][col] !== 0) {
      return;
    }
    grid[row][col]++;

    if (grid[row][col] > 9) {
      handleFlash(row, col);
    }
  }
};

let steps = 0;

//when all octupi flash
while (flashes !== 100) {
  flashes = 0;
  step();
  steps++;
}

console.log("steps:", steps); //210

console.log("Time:", Date.now() - start, "ms"); //13

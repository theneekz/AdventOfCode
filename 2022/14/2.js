/*
--- Part Two ---
You realize you misread the scan. There isn't an endless void at the bottom of the scan - there's floor, and you're standing on it!

You don't have time to scan the floor, so assume the floor is an infinite horizontal line with a y coordinate equal to two plus the highest y coordinate of any point in your scan.

In the example above, the highest y coordinate of any point is 9, and so the floor is at y=11. (This is as if your scan contained one extra rock path like -infinity,11 -> infinity,11.) With the added floor, the example above now looks like this:

        ...........+........
        ....................
        ....................
        ....................
        .........#...##.....
        .........#...#......
        .......###...#......
        .............#......
        .............#......
        .....#########......
        ....................
<-- etc #################### etc -->
To find somewhere safe to stand, you'll need to simulate falling sand until a unit of sand comes to rest at 500,0, blocking the source entirely and stopping the flow of sand into the cave. In the example above, the situation finally looks like this after 93 units of sand come to rest:

............o............
...........ooo...........
..........ooooo..........
.........ooooooo.........
........oo#ooo##o........
.......ooo#ooo#ooo.......
......oo###ooo#oooo......
.....oooo.oooo#ooooo.....
....oooooooooo#oooooo....
...ooo#########ooooooo...
..ooooo.......ooooooooo..
#########################
Using your scan, simulate the falling sand until the source of the sand becomes blocked. How many units of sand come to rest?

Your puzzle answer was 24589.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const inputArr = getInputArray(__dirname, "/input.txt");
  const cave = getCave(inputArr);
  const sandCount = cave.fillCave();
  return sandCount;
}

function getCave(arrayOfRockRangeStrings) {
  // Convert strings to rock coordinates
  const rocks = arrayOfRockRangeStrings.reduce(getRocks, []);
  // Create the cave using rock coordinates
  const cave = new Cave(rocks);
  return cave;
}

function getRocks(allRockCoords, line) {
  let results = [];
  const stringCoordsQueue = line.split(" -> ");
  let startingCoord = stringCoordsQueue.shift();
  while (stringCoordsQueue.length > 0) {
    // Build rock barrier from startingCoord to endingCoord
    let endingCoord = stringCoordsQueue[0];
    let [x1, y1] = convertCoordStringToArray(startingCoord);
    let [x2, y2] = convertCoordStringToArray(endingCoord);
    const isHorizontal = x1 !== x2;
    if (isHorizontal) {
      for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
        results.push([i, y1]);
      }
    } else {
      for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
        results.push([x1, i]);
      }
    }
    // Pop off the next coord
    startingCoord = stringCoordsQueue.shift();
  }
  // No remaining rocks for the line, return accumlulated coords and the current ones
  return [...allRockCoords, ...results];
}

function convertCoordStringToArray(str) {
  let [x, y] = str.split(",");
  return [Number(x), Number(y)];
}

class Cave {
  constructor(rockFormations) {
    this.rockCoords = rockFormations;
    this.matrix = this.makeMatrix(rockFormations);
    this.isFullOfSand = false;
    this.restingSandCount = 0;
    this.minX;
    this.maxX;
    this.maxY;
  }
  makeMatrix(rocks) {
    let matrix = [[]];
    let minX = Infinity;
    let maxX = 500;
    let maxY = 0;
    for (const coord of rocks) {
      const [x, y] = coord;
      // If x is out of range
      while (x >= matrix[0].length) {
        // Add column to every row
        for (const row of matrix) {
          row.push(".");
        }
      }
      // If y is out of range
      while (y >= matrix.length) {
        const row = new Array(matrix[0].length);
        // Add blank row to bottom
        matrix.push(row.fill("."));
      }
      // Place rock barrier
      matrix[y][x] = "#";
      // Update values
      minX = Math.min(x, minX);
      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
    }
    // Where sand always falls
    matrix[0][500] = "+";
    // Save mins and maxes
    this.minX = minX;
    this.maxX = maxX;
    // New rule for part 2, floor is two below the maxY
    this.maxY = maxY + 2;
    // Add blank row and then a rock row to bottom
    matrix.push(new Array(matrix[0].length).fill("."));
    matrix.push(new Array(matrix[0].length).fill("#"));
    return matrix;
  }
  addColumn() {
    for (let rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
      const row = this.matrix[rowIndex];
      if (rowIndex === this.matrix.length - 1) {
        row.push("#");
      } else {
        row.push(".");
      }
    }
  }
  printCave() {
    // Using mins and maxes only print relevant area of cave matrix
    let result = "";
    for (let y = 0; y <= this.maxY; y++) {
      let row = "";
      for (let x = this.minX; x <= this.maxX; x++) {
        row += this.matrix[y][x];
      }
      row += "\n";
      result += row;
    }
    console.log(result);
  }
  fillCave() {
    // While cave is not full, drop sand
    while (!this.isFullOfSand) {
      this.dropSand();
    }
    return this.restingSandCount;
  }
  dropSand() {
    // Do not drop more sand if cave is already full
    if (this.isFullOfSand) return;
    // Sand always drops from 500,0
    let [x, y] = [500, 0];
    let sandIsAtRest = false;
    while (!sandIsAtRest) {
      // Cave expands infinitely now apparently
      if (x + 1 > this.maxX) {
        this.addColumn();
        this.maxX = x + 1;
      }
      if (this.matrix[y + 1][x] === ".") {
        // Sand can go straight down
        y++;
      } else if (this.matrix[y + 1][x - 1] === ".") {
        // Sand can go down and left
        y++;
        x--;
      } else if (this.matrix[y + 1][x + 1] === ".") {
        // Sand can go down and right
        y++;
        x++;
      } else {
        // Sand is at rest in range
        sandIsAtRest = true;
      }
      if (x < this.minX) {
        // Expand for printing purposes
        this.minX = x - 2;
      }
    }
    // Place the sand in the matrix and update count
    this.matrix[y][x] = "o";
    this.restingSandCount++;
    if (x === 500 && y === 0) {
      this.isFullOfSand = true;
    }
  }
}

console.log(main());
console.log("Time", Date.now() - start, "ms");

module.exports = { getCave };

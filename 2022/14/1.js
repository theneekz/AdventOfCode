/*
--- Day 14: Regolith Reservoir ---
The distress signal leads you to a giant waterfall! Actually, hang on - the signal seems like it's coming from the waterfall itself, and that doesn't make any sense. However, you do notice a little path that leads behind the waterfall.

Correction: the distress signal leads you behind a giant waterfall! There seems to be a large cave system here, and the signal definitely leads further inside.

As you begin to make your way deeper underground, you feel the ground rumble for a moment. Sand begins pouring into the cave! If you don't quickly figure out where the sand is going, you could quickly become trapped!

Fortunately, your familiarity with analyzing the path of falling material will come in handy here. You scan a two-dimensional vertical slice of the cave above you (your puzzle input) and discover that it is mostly air with structures made of rock.

Your scan traces the path of each solid rock structure and reports the x,y coordinates that form the shape of the path, where x represents distance to the right and y represents distance down. Each path appears as a single line of text in your scan. After the first point of each path, each point indicates the end of a straight horizontal or vertical line to be drawn from the previous point. For example:

498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
This scan means that there are two paths of rock; the first path consists of two straight lines, and the second path consists of three straight lines. (Specifically, the first path consists of a line of rock from 498,4 through 498,6 and another line of rock from 498,6 through 496,6.)

The sand is pouring into the cave from point 500,0.

Drawing rock as #, air as ., and the source of the sand as +, this becomes:


  4     5  5
  9     0  0
  4     0  3
0 ......+...
1 ..........
2 ..........
3 ..........
4 ....#...##
5 ....#...#.
6 ..###...#.
7 ........#.
8 ........#.
9 #########.
Sand is produced one unit at a time, and the next unit of sand is not produced until the previous unit of sand comes to rest. A unit of sand is large enough to fill one tile of air in your scan.

A unit of sand always falls down one step if possible. If the tile immediately below is blocked (by rock or sand), the unit of sand attempts to instead move diagonally one step down and to the left. If that tile is blocked, the unit of sand attempts to instead move diagonally one step down and to the right. Sand keeps moving as long as it is able to do so, at each step trying to move down, then down-left, then down-right. If all three possible destinations are blocked, the unit of sand comes to rest and no longer moves, at which point the next unit of sand is created back at the source.

So, drawing sand that has come to rest as o, the first unit of sand simply falls straight down and then stops:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
......o.#.
#########.
The second unit of sand then falls straight down, lands on the first one, and then comes to rest to its left:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
.....oo.#.
#########.
After a total of five units of sand have come to rest, they form this pattern:

......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
......o.#.
....oooo#.
#########.
After a total of 22 units of sand:

......+...
..........
......o...
.....ooo..
....#ooo##
....#ooo#.
..###ooo#.
....oooo#.
...ooooo#.
#########.
Finally, only two more units of sand can possibly come to rest:

......+...
..........
......o...
.....ooo..
....#ooo##
...o#ooo#.
..###ooo#.
....oooo#.
.o.ooooo#.
#########.
Once all 24 units of sand shown above have come to rest, all further sand flows out the bottom, falling into the endless void. Just for fun, the path any new sand takes before falling forever is shown here with ~:

.......+...
.......~...
......~o...
.....~ooo..
....~#ooo##
...~o#ooo#.
..~###ooo#.
..~..oooo#.
.~o.ooooo#.
~#########.
~..........
~..........
~..........
Using your scan, simulate the falling sand. How many units of sand come to rest before sand starts flowing into the abyss below?
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
      let distance = Math.abs(x1 - x2);
      results.push([x1, y1]);
      while (distance > 0) {
        x1 > x2 ? x1-- : x1++;
        results.push([x1, y1]);
        distance--;
      }
    } else {
      let distance = Math.abs(y1 - y2);
      results.push([x1, y1]);
      while (distance > 0) {
        y1 > y2 ? y1-- : y1++;
        results.push([x1, y1]);
        distance--;
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
    this.maxY = maxY;
    return matrix;
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
      const sandWouldDropOutOfRange = y + 1 > this.maxY || x + 1 > this.maxX;
      if (sandWouldDropOutOfRange) {
        // Cave is full, do not place sand
        this.isFullOfSand = true;
        return;
      } else if (this.matrix[y + 1][x] === ".") {
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
    }
    // Place the sand in the matrix and update count
    this.matrix[y][x] = "o";
    this.restingSandCount++;
  }
}

console.log(main());
console.log("Time", Date.now() - start, "ms");

module.exports = { getCave };

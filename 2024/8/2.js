/*
--- Part Two ---
Watching over your shoulder as you work, one of The Historians asks if you took the effects of resonant harmonics into your calculations.

Whoops!

After updating your model, it turns out that an antinode occurs at any grid position exactly in line with at least two antennas of the same frequency, regardless of distance. This means that some of the new antinodes will occur at the position of each antenna (unless that antenna is the only one of its frequency).

So, these three T-frequency antennas now create many antinodes:

T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........
In fact, the three T-frequency antennas are all exactly in line with two antennas, so they are all also antinodes! This brings the total number of antinodes in the above example to 9.

The original example now has 34 antinodes, including the antinodes that appear on every antenna:

##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##
Calculate the impact of the signal using this updated model. How many unique locations within the bounds of the map contain an antinode?

Your puzzle answer was 1285.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((l) => l.split(""));
  const allChars = [...new Set(input.flat(1).filter((x) => x != "."))];
  let allAntinodes = {};
  for (const char of allChars) {
    allAntinodes = { ...allAntinodes, ...getAntinodesForChar(char, input) };
  }

  return Object.keys(allAntinodes).length;
}

const getAntinodesForChar = (char, input) => {
  const antennas = getCoordsForChar(char, input);
  let antinodes = {};
  for (let i = 0; i < antennas.length - 1; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      antinodes = {
        ...antinodes,
        ...getAntinodesForPair(antennas[i], antennas[j], input),
      };
    }
  }
  return antinodes;
};

const getCoordsForChar = (char, input) => {
  let coords = [];
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === char) {
        coords.push([row, col]);
      }
    }
  }
  return coords;
};

const getAntinodesForPair = (coordA, coordB, input) => {
  let antinodes = {};
  const rowDiff = coordA[0] - coordB[0];
  const colDiff = coordA[1] - coordB[1];

  // Starting at A include all antinodes opposite from B until out of bounds
  let y = coordA[0];
  let x = coordA[1];
  while (coordIsInBounds(y, x, input)) {
    antinodes[[y, x]] = true;
    y += rowDiff;
    x += colDiff;
  }

  // Repeat for B in opposite direction of A
  y = coordB[0];
  x = coordB[1];
  while (coordIsInBounds(y, x, input)) {
    antinodes[[y, x]] = true;
    y -= rowDiff;
    x -= colDiff;
  }

  return antinodes;
};

const coordIsInBounds = (y, x, input) => input[y]?.[x];

console.log(main());

console.log("Time", Date.now() - start, "ms");

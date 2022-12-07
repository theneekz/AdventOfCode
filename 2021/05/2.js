/*
--- Part Two ---
Unfortunately, considering only horizontal and vertical lines doesn't give you the full picture; you need to also consider diagonal lines.

Because of the limits of the hydrothermal vent mapping system, the lines in your list will only ever be horizontal, vertical, or a diagonal line at exactly 45 degrees. In other words:

An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.
Considering all lines from the above example would now produce the following diagram:

1.1....11.
.111...2..
..2.1.111.
...1.2.2..
.112313211
...1.2....
..1...1...
.1.....1..
1.......1.
222111....
You still need to determine the number of points where at least two lines overlap. In the above example, this is still anywhere in the diagram with a 2 or larger - now a total of 12 points.

Consider all of the lines. At how many points do at least two lines overlap?
*/
const { getInput } = require("../../utils");
const input = getInput(__dirname);
const inputArr = input
  .split("\n")
  .map((raw) =>
    raw
      .split(" -> ")
      .map((strCoords) => strCoords.split(",").map((x) => parseInt(x, 10)))
  );
//store width & height of output
let outputWidth = 0;
let outputHeight = 0;

//find output height and width, order points from left to right
const filteredInput = inputArr.map((set) => {
  const [[x1, y1], [x2, y2]] = set;
  const isX1greater = x1 > x2;
  const [greaterX, smallerX] = isX1greater ? [x1, x2] : [x2, x1];
  const [greaterY, smallerY] = y1 > y2 ? [y1, y2] : [y2, y1];

  //if the current graph doesn't have enough width, add to each row
  if (greaterX > outputWidth) {
    outputWidth = greaterX;
  }
  //if the current graph doesn't have enough height, add rows
  if (greaterY > outputHeight) {
    outputHeight = greaterY;
  }

  //reorder points so that the lower x comes first
  return isX1greater
    ? [
        [x2, y2],
        [x1, y1],
      ]
    : [
        [x1, y1],
        [x2, y2],
      ];
});

//make the output graph using the coords
const makeOutput = () => {
  let result = [];
  for (let i = 0; i <= outputHeight; i++) {
    let row = [];
    for (let j = 0; j <= outputWidth; j++) {
      row.push(0);
    }
    result.push(row);
  }
  return result;
};

const output = makeOutput();

//makes array of points for a line, given the two endpoints
const makeLine = ([[x1, y1], [x2, y2]]) => {
  const [greaterX, smallerX] = x1 > x2 ? [x1, x2] : [x2, x1];
  const [greaterY, smallerY] = y1 > y2 ? [y1, y2] : [y2, y1];
  let points = [];
  const yDiff = y2 - y1;
  const xDiff = x2 - x1;
  if (xDiff === 0) {
    //is a vertical line
    for (let i = smallerY; i <= greaterY; i++) {
      points.push([x1, i]);
    }
  } else if (yDiff === 0) {
    //is a horizontal line
    for (let i = smallerX; i <= greaterX; i++) {
      points.push([i, y1]);
    }
  } else {
    let y = y1;
    for (let x = x1; x <= x2; x++) {
      points.push([x, y]);
      if (y1 < y2) {
        //for positive slopes
        y++;
      } else {
        //for negative slopes
        y--;
      }
    }
  }
  return points;
};

//keep track of how many intersections are made
let intersections = 0;

//loop through coords
filteredInput.forEach((set, i) => {
  //make array of points for line
  const line = makeLine(set);
  //traverse through line and increment where line lies on graph
  for (const [x, y] of line) {
    output[y][x] += 1;
    if (output[y][x] === 2) {
      intersections++;
    }
  }
});

console.log({ intersections }); //20666

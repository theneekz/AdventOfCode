/*
--- Day 5: Hydrothermal Venture ---
You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds, so it would be best to avoid them if possible.

They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents (your puzzle input) for you to review. For example:

0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 where x1,y1 are the coordinates of one end the line segment and x2,y2 are the coordinates of the other end. These line segments include the points at both ends. In other words:

An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

So, the horizontal and vertical lines from the above list would produce the following diagram:

.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....
In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position is shown as the number of lines which cover that point or . if no line covers that point. The top-left pair of 1s, for example, comes from 2,2 -> 2,1; the very bottom row is formed by the overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.

To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.

Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
*/
const { getInput, print } = require("../../utils");
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

//filter input to only be vertical/horizontal
const filteredInput = inputArr.filter((set) => {
  const [[x1, y1], [x2, y2]] = set;
  if (x1 === x2 || y1 === y2) {
    //if the current graph doesn't have enough width, add to each row
    if (x1 > outputWidth) {
      outputWidth = x1;
    }
    if (x2 > outputWidth) {
      outputWidth = x2;
    }
    //if the current graph doesn't have enough height, add rows
    if (y1 > outputHeight) {
      outputHeight = y1;
    }
    if (y2 > outputHeight) {
      outputHeight = y2;
    }

    return true;
  }
  return false;
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

const makeArrayOfIndexes = (big, small) => {
  if (big === small) {
    return [big];
  }
  return Array.from(Array(big - small + 1), (x, i) => small + i);
};

//keep track of how many intersections are made
let intersections = 0;

//loop through coords
filteredInput.forEach((set, i) => {
  console.log(i, "out of", filteredInput.length - 1);
  //get length/height of current line
  const [[x1, y1], [x2, y2]] = set;
  const [greaterX, smallerX] = x1 > x2 ? [x1, x2] : [x2, x1];
  const [greaterY, smallerY] = y1 > y2 ? [y1, y2] : [y2, y1];
  //get all x indexes that line covers
  const allX = makeArrayOfIndexes(greaterX, smallerX);
  //get all y indexes that line covers
  const allY = makeArrayOfIndexes(greaterY, smallerY);

  //traverse through graph and increment where line lies
  for (let y = 0; y < output.length; y++) {
    for (let x = 0; x < output[0].length; x++) {
      if (allX.includes(x) && allY.includes(y)) {
        output[y][x] += 1;
        if (output[y][x] === 2) {
          intersections++;
        }
      }
    }
  }
});

console.log(intersections); //6856 (VERY SLOW)

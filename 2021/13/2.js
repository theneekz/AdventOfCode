/*
--- Part Two ---
Finish folding the transparent paper according to the instructions. The manual says the code is always eight capital letters.

What code do you use to activate the infrared thermal imaging camera system?
*/

const { getInput, getInputArray, print } = require("../../utils");
const start = Date.now();
const [inputCoordsStr, foldingDirectionsStr] = getInput(
  __dirname
  // "/test.txt"
).split("\n\n");

let inputCoords = inputCoordsStr
  .split("\n")
  .map((str) => str.split(",").map((x) => Number(x)));
const foldingDirections = foldingDirectionsStr.split("\n");

for (const foldingDirection of foldingDirections) {
  const [foldAxis, foldLineStr] = foldingDirection.slice(11).split("=");
  const foldLine = Number(foldLineStr);

  let afterFold = inputCoords.map(([x, y]) => {
    if (foldAxis === "y" && y > foldLine) {
      const newPoint = [x, foldLine - (y - foldLine)];
      return newPoint;
    } else if (foldAxis === "x" && x > foldLine) {
      const newPoint = [foldLine - (x - foldLine), y];
      return newPoint;
    }
    return [x, y];
  });

  const points = {};

  afterFold = afterFold.filter(([x, y]) => {
    if (!points[`${x},${y}`]) {
      points[`${x},${y}`] = true;
      return foldAxis === "y" ? y < foldLine : x < foldLine;
    } else {
      return false;
    }
  });
  inputCoords = [...afterFold];
}

console.log(inputCoords); //PGHRKLKL (see graph)
console.log("Time", Date.now() - start, "ms"); //16

/*
--- Part Two ---
Next, you need to find the largest basins so you know what areas are most important to avoid.

A basin is all locations that eventually flow downward to a single low point. Therefore, every low point has a basin, although some basins are very small. Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.

The size of a basin is the number of locations within the basin, including the low point. The example above has four basins.

The top-left basin, size 3:

2199943210
3987894921
9856789892
8767896789
9899965678
The top-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
The middle basin, size 14:

2199943210
3987894921
9856789892
8767896789
9899965678
The bottom-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
Find the three largest basins and multiply their sizes together. In the above example, this is 9 * 14 * 9 = 1134.

What do you get if you multiply together the sizes of the three largest basins?
*/

const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname).map((x) =>
  x.split("").map((i) => Number(i))
);

let start = Date.now();

let basins = [
  /* ex:
   {
     lowPoint: 1,
     size: 3
   }
  */
];

//find low points
for (let row = 0; row < input.length; row++) {
  for (let col = 0; col < input[row].length; col++) {
    const currentDepth = input[row][col];
    const currentCoor = `${row},${col}`;

    const findNeighbors = (thisCoor) => {
      let top, right, bottom, left;
      //[row, col]
      let [r, c] = thisCoor.split(",").map((x) => Number(x));
      //check neighbor above
      if (r > 0) {
        top = `${r - 1},${c}`;
      }
      //check neighbor right
      if (c < input[r].length - 1) {
        right = `${r},${c + 1}`;
      }
      //check neighbor below
      if (r < input.length - 1) {
        bottom = `${r + 1},${c}`;
      }
      //check neighbor left
      if (c > 0) {
        left = `${r},${c - 1}`;
      }
      return [top, right, bottom, left];
    };

    const [top, right, bottom, left] = findNeighbors(currentCoor);

    const getIntsForCoord = (strCoord) => {
      return strCoord.split(",").map((x) => Number(x));
    };

    const getDepth = (strCoord) => {
      if (!strCoord) {
        return null;
      }
      //[row, col]
      let [r, c] = getIntsForCoord(strCoord);
      //depth
      let d = input[r][c];
      return d;
    };

    const isCoordALessThan = (coordA, coordB) => {
      if (!coordB) {
        return true;
      }
      let depthA = getDepth(coordA);
      let depthB = getDepth(coordB);
      return depthA < depthB;
    };

    const isLowPoint =
      isCoordALessThan(currentCoor, top) &&
      isCoordALessThan(currentCoor, right) &&
      isCoordALessThan(currentCoor, bottom) &&
      isCoordALessThan(currentCoor, left);

    if (isLowPoint) {
      //find size of basin
      let basinCoords = [currentCoor];

      //recursively find size using each neighbor
      const getBasinNeighbors = (neighborArr) => {
        neighborArr.forEach((coord) => {
          let d = getDepth(coord);

          if (coord && d && d !== 9) {
            const alreadyInBasin = basinCoords.indexOf(coord) > -1;
            if (!alreadyInBasin) {
              basinCoords.push(coord);
            }
            const neighborsOfNeighbor = findNeighbors(coord).filter((x) => {
              const indexOfCoord = basinCoords.indexOf(x);
              const isPresent = indexOfCoord > -1;
              //don't recheck neighbors if already present, else runs infinitely
              return !isPresent;
            });

            getBasinNeighbors(neighborsOfNeighbor);
          }
        });
      };

      getBasinNeighbors([top, right, bottom, left]);

      basins.push({
        lowPoint: currentDepth,
        size: basinCoords.length,
      });
    }
  }
}
//find top three largest basins
const result = basins.reduce((prev, curr, i) => {
  //first three iterations
  if (prev.length < 3) {
    return [...prev, curr.size].sort((a, b) => b - a);
  }
  let newTopThree = [...prev, curr.size].sort((a, b) => b - a).slice(0, 3);

  //last iteration
  if (i === basins.length - 1) {
    return newTopThree.reduce((p, c) => p * c, 1);
  }

  return newTopThree;
}, []);

console.log(result); //1047744
console.log("Time:", Date.now() - start, "ms");

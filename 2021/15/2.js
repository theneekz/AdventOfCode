const Heap = require("heap");
const { getInput, getInputArray, print } = require("../../utils");
const smallInput = getInputArray(__dirname).map((row) =>
  row.split("").map((n) => Number(n))
);
let input = [];
const incrementRule = (num) => (num > 9 ? num % 9 || 1 : num);

smallInput.forEach((row, rowIndex) => {
  let rowLen = row.length;
  let colLen = smallInput.length;
  for (let j = 0; j < 5; j++) {
    let newRow = [];
    row.forEach((col, colIndex) => {
      for (let i = 0; i < 5; i++) {
        newRow[colIndex + i * rowLen] = incrementRule(col + i + j);
      }
    });
    input[rowIndex + j * colLen] = newRow;
  }
});

const start = Date.now();

// Dijkstra's shortest path algo: https://youtu.be/pVfj6mxhdMw

/*
Let distance of start coord from start coord = input[0][0]
Let distance of all other coords from start = infinity

While all coords have not been visited,
  Visit the unvisited coords with the smallest known distance from the start
  For the current coord, examine the unvisited neighbors
  For the current coord, calc distance of each neighbor from start
  If the calc dist of a coord is less than the known dist, update
  Update the prev coord if the dist is updated
  Add the current coord to the list of visited vertices
*/

//helper for turning coordinates into a string/back to an array to be stored/read
//as keys from an object
const f = (coord) => {
  if (typeof coord === "string") {
    return JSON.parse(coord);
  } else {
    return JSON.stringify(coord);
  }
};

let visited = [];
let unvisited = [];
let lookup = {};
let heap = new Heap((a, b) => a.distanceFromStart - b.distanceFromStart);

console.time("setup");
input.forEach((row, rowIndex) => {
  row.forEach((col, colIndex) => {
    const coordArr = [rowIndex, colIndex];
    const coordStr = f(coordArr);
    const isStart = coordStr === "[0,0]";

    unvisited.push(f([rowIndex, colIndex]));
    let defaultObj = {
      visited: false,
      distanceFromStart: isStart ? 0 : Infinity,
      prevCoord: null,
      position: coordArr,
    };

    lookup[coordStr] = {
      ...defaultObj,
    };
    if (isStart) {
      heap.push({ ...defaultObj });
    }
  });
});
console.timeEnd("setup");

const getUnvisitedShortestLength = () => {
  return heap.pop();
};

const hasCoordBeenVisited = (coord) => {
  if (typeof coord !== "string") {
    coord = f(coord);
  }
  return lookup[coord].visited;
};

const getNeighbors = (coord, allowVisited = false) => {
  if (typeof coord === "string") {
    coord = f(coord);
  }
  let [row, col] = coord;
  let neighbors = [];
  if (row !== 0) {
    let neighborUp = [row - 1, col];
    if (!hasCoordBeenVisited(neighborUp)) {
      neighbors.push(neighborUp);
    }
  }
  if (row !== input.length - 1) {
    let neighborDown = [row + 1, col];
    if (!hasCoordBeenVisited(neighborDown)) {
      neighbors.push(neighborDown);
    }
  }
  if (col !== 0) {
    let neighborLeft = [row, col - 1];
    if (!hasCoordBeenVisited(neighborLeft)) {
      neighbors.push(neighborLeft);
    }
  }
  if (col !== input.length - 1) {
    let neighborRight = [row, col + 1];
    if (!hasCoordBeenVisited(neighborRight)) {
      neighbors.push(neighborRight);
    }
  }
  return neighbors;
};

const updateDistanceForNeighbor = (coord, distanceToAdd, prev) => {
  if (typeof coord !== "string") {
    coord = f(coord);
  }
  let { distanceFromStart, position } = lookup[coord];
  let [row, col] = position;
  let newDistance = input[row][col];
  let newTotal = newDistance + distanceToAdd;
  if (newTotal < distanceFromStart) {
    lookup[coord].distanceFromStart = newTotal;
    lookup[coord].prevCoord = prev;
    heap.push(lookup[coord]);
    // heap.heapify();
  }
};
let i = 0;
while (unvisited.length) {
  console.log("visiting", i++, "out of", 500 * 500);
  const current = getUnvisitedShortestLength();
  const { distanceFromStart, position } = current;
  // console.log("current:", position);
  const coordStr = f(position);
  const neighbors = getNeighbors(position);

  neighbors.forEach((neighbor) => {
    updateDistanceForNeighbor(neighbor, distanceFromStart, coordStr);
  });

  const indexOfCurrent = unvisited.indexOf(coordStr);
  unvisited.splice(indexOfCurrent, 1);
  lookup[coordStr].visited = true;
  visited.push(coordStr);
}

console.log(lookup["[499,499]"].distanceFromStart); //2874
console.log("Time", Date.now() - start, "ms"); //61897 ms

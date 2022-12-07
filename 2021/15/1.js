/*
--- Day 15: Chiton ---
You've almost reached the exit of the cave, but the walls are getting closer together. Your submarine can barely still fit, though; the main problem is that the walls of the cave are covered in chitons, and it would be best not to bump any of them.

The cavern is large, but has a very low ceiling, restricting your motion to two dimensions. The shape of the cavern resembles a square; a quick scan of chiton density produces a map of risk level throughout the cave (your puzzle input). For example:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
You start in the top left position, your destination is the bottom right position, and you cannot move diagonally. The number at each position is its risk level; to determine the total risk of an entire path, add up the risk levels of each position you enter (that is, don't count the risk level of your starting position unless you enter it; leaving it adds no risk to your total).

Your goal is to find a path with the lowest total risk. In this example, a path with the lowest total risk is highlighted here:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
The total risk of this path is 40 (the starting position is never entered, so its risk is not counted).

What is the lowest total risk of any path from the top left to the bottom right?
*/
const Heap = require("heap");
const { getInput, getInputArray, print } = require("../../utils");
const input = getInputArray(__dirname).map((x) =>
  x.split("").map((n) => Number(n))
);
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

while (unvisited.length) {
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

console.log(lookup["[99,99]"].distanceFromStart); //562
console.log("Time", Date.now() - start, "ms"); //182 ms

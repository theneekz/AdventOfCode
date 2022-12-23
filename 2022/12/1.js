/*
--- Day 12: Hill Climbing Algorithm ---
You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.

Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)

For example:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
Here, you start in the top-left corner; your goal is near the middle. You could start by moving down or right, but eventually you'll need to head toward the e at the bottom. From there, you can spiral around to the goal:

v..v<<<<
>v.vv<<^
.>vv>E^^
..v>>>^^
..>>>>>^
In the above diagram, the symbols indicate whether the path exits each square moving up (^), down (v), left (<), or right (>). The location that should get the best signal is still E, and . marks unvisited squares.

This path reaches the goal in 31 steps, the fewest possible.

What is the fewest steps required to move from your current position to the location that should get the best signal?

Your puzzle answer was 408.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((line) =>
    line.split("")
  );

  const graph = new WeightedGraph();

  let start, end;

  input.forEach((rowArr, row) => {
    rowArr.forEach((height, col) => {
      const val = convert([row, col]);
      if (height === "S") start = val;
      if (height === "E") end = val;

      const currentHeight = getHeight(height);

      //neighbors
      const up = input[row - 1]?.[col] || null;
      const down = input[row + 1]?.[col] || null;
      const left = input[row]?.[col - 1] || null;
      const right = input[row]?.[col + 1] || null;
      if (
        up &&
        (currentHeight >= getHeight(up) || currentHeight + 1 == getHeight(up))
      ) {
        "up", convert([row - 1, col]);
        graph.addEdge(val, convert([row - 1, col]));
      }
      if (
        down &&
        (currentHeight >= getHeight(down) ||
          currentHeight + 1 == getHeight(down))
      ) {
        "down", convert([row + 1, col]);
        graph.addEdge(val, convert([row + 1, col]));
      }
      if (
        left &&
        (currentHeight >= getHeight(left) ||
          currentHeight + 1 == getHeight(left))
      ) {
        "left", convert([row, col - 1]);
        graph.addEdge(val, convert([row, col - 1]));
      }
      if (
        right &&
        (currentHeight >= getHeight(right) ||
          currentHeight + 1 == getHeight(right))
      ) {
        "right", convert([row, col + 1]);
        graph.addEdge(val, convert([row, col + 1]));
      }
    });
  });
  // The length is all the coords visited, not the path
  return graph.shortestPath(start, end).length - 1;
}

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(v) {
    if (!this.adjacencyList[v]) this.adjacencyList[v] = [];
  }
  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList[v1].push(v2); // This path is unidirectional
  }
  shortestPath(startCoord, endCoord) {
    // queue of coords to visit
    let queue = [startCoord];
    // object of visitied coords
    let visitedCoords = { [startCoord]: true };
    // object of coord & predecessors for a coord
    let predecessors = {};
    while (queue.length) {
      let current = queue.shift();
      const currentNeighbors = this.adjacencyList[current];
      for (const neighbor of currentNeighbors) {
        if (visitedCoords[neighbor]) {
          continue;
        }
        visitedCoords[neighbor] = true;
        // Found the end to be one of the current node's neighbors
        if (neighbor === endCoord) {
          let result = [neighbor];
          while (current !== startCoord) {
            result.push(current);
            current = predecessors[current];
          }
          result.push(current); // at this point current should be the start coord
          return result;
        }
        // Didn't find the end so we set the predecessor of this neighbor to be the current neighbor
        predecessors[neighbor] = current;
        // Come back to the neighbor later in the queue to check if it leads to the end
        queue.push(neighbor);
      }
    }
  }
}

function getHeight(char) {
  if (char === "S") return "a".charCodeAt();
  if (char === "E") return "z".charCodeAt();
  return char?.charCodeAt();
}

function convert(x) {
  return JSON.stringify(x);
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

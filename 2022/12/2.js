/*
--- Part Two ---
As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic, though; perhaps you can find a better starting point.

To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E. However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path from any square at elevation a to the square marked E.

Again consider the example from above:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
Now, there are six choices for starting position (five marked a, plus the square marked S that counts as being at elevation a). If you start at the bottom-left square, you can reach the goal most quickly:

...v<<<<
...vv<<^
...v>E^^
.>v>>>^^
>^>>>>>^
This path reaches the goal in only 29 steps, the fewest possible.

What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?

Your puzzle answer was 399.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((line) =>
    line.split("")
  );

  const graph = new WeightedGraph();
  let possibleStarts = []; // part 2
  let end;

  input.forEach((rowArr, row) => {
    rowArr.forEach((height, col) => {
      const val = convert([row, col]);
      if (height === "S" || height === "a") possibleStarts.push(val); // part 2
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
        graph.addEdge(val, convert([row - 1, col]));
      }
      if (
        down &&
        (currentHeight >= getHeight(down) ||
          currentHeight + 1 == getHeight(down))
      ) {
        graph.addEdge(val, convert([row + 1, col]));
      }
      if (
        left &&
        (currentHeight >= getHeight(left) ||
          currentHeight + 1 == getHeight(left))
      ) {
        graph.addEdge(val, convert([row, col - 1]));
      }
      if (
        right &&
        (currentHeight >= getHeight(right) ||
          currentHeight + 1 == getHeight(right))
      ) {
        graph.addEdge(val, convert([row, col + 1]));
      }
    });
  });
  let min = Infinity;
  for (const start of possibleStarts) {
    min = Math.min(
      // replace the min when a shorter path is found, some don't have a path at all
      (graph.shortestPath(start, end)?.length || Infinity) - 1,
      min
    );
  }
  return min;
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
    this.adjacencyList[v1].push(v2);
  }
  shortestPath(startCoord, endCoord) {
    // queue of coords that will be visited
    let queue = [startCoord];
    // object of coord, boolean pairs for visitied coords
    let visitedCoords = { [startCoord]: true };
    // object of coord, array pairs for the current shortest predecessors for a coord
    let predecessors = {};
    while (queue.length) {
      let current = queue.shift();
      let currentNeighbors = this.adjacencyList[current];
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
          result.push(current); // at this point should be the start
          // result.reverse();

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

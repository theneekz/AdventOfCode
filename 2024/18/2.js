/*
--- Part Two ---
The Historians aren't as used to moving around in this pixelated universe as you are. You're afraid they're not going to be fast enough to make it to the exit before the path is completely blocked.

To determine how fast everyone needs to go, you need to determine the first byte that will cut off the path to the exit.

In the above example, after the byte at 1,1 falls, there is still a path to the exit:

O..#OOO
O##OO#O
O#OO#OO
OOO#OO#
###OO##
.##O###
#.#OOOO
However, after adding the very next byte (at 6,1), there is no longer a path to the exit:

...#...
.##..##
.#..#..
...#..#
###..##
.##.###
#.#....
So, in this example, the coordinates of the first byte that prevents the exit from being reachable are 6,1.

Simulate more of the bytes that are about to corrupt your memory space. What are the coordinates of the first byte that will prevent the exit from being reachable from your starting position? (Provide the answer as two integers separated by a comma with no other characters.)

Your puzzle answer was 20,64.

Slow solution - Time 15892 ms
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((x) =>
    x.split(",").map((num) => Number(num))
  );

  for (let i = 0; i < input.length; i++) {
    const maze = buildMaze(71, i, input);
    const minSteps = findPath(maze);

    if (minSteps == "ya goofed") {
      return input[i - 1].join(",");
    }
  }

  return "uh oh";
}

const buildMaze = (mazeSize, byteCount, input) => {
  const maze = Array.from({ length: mazeSize }).map((_) =>
    Array.from({ length: mazeSize }).fill(".")
  );
  for (let i = 0; i < byteCount; i++) {
    const [x, y] = input[i];
    maze[y][x] = "#";
  }
  return maze;
};

const findPath = (input) => {
  const end = input.length - 1 + "," + (input.length - 1);
  const queue = [new Node({ coord: [0, 0], distance: 0, input })];
  const visited = {};

  while (queue.length) {
    const current = queue.shift();

    if (visited[current.getName()]) {
      continue;
    }

    visited[current.getName()] = true;

    for (const coord of current.getNeighbors()) {
      const distance = current.distance + 1;
      const neighbor = new Node({ coord, distance, input });

      if (neighbor.getName() === end) {
        return distance;
      }

      if (!visited[neighbor.getName()]) {
        queue.push(neighbor);
      }
    }
  }
  return "ya goofed";
};

class Node {
  distance = 0;
  coord = [];
  input = [];
  constructor({ coord, distance, input }) {
    this.coord = coord;
    this.distance = distance;
    this.input = input;
  }

  getNeighbors = () => {
    const [x, y] = this.coord;
    return [
      [x, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ].filter(this.isValidCoord);
  };

  isValidCoord = ([x, y]) => this.input[y]?.[x] === ".";

  getName = () => this.coord.join(",");
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

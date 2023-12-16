/*
--- Day 10: Pipe Maze ---
You use the hang glider to ride the hot air from Desert Island all the way up to the floating metal island. This island is surprisingly cold and there definitely aren't any thermals to glide on, so you leave your hang glider behind.

You wander around for a while, but you don't find any people or animals. However, you do occasionally find signposts labeled "Hot Springs" pointing in a seemingly consistent direction; maybe you can find someone at the hot springs and ask them where the desert-machine parts are made.

The landscape here is alien; even the flowers and trees are made of metal. As you stop to admire some metal grass, you notice something metallic scurry away in your peripheral vision and jump into a big pipe! It didn't look like any animal you've ever seen; if you want a better look, you'll need to get ahead of it.

Scanning the area, you discover that the entire field you're standing on is densely packed with pipes; it was hard to tell at first because they're the same metallic silver color as the "ground". You make a quick sketch of all of the surface pipes you can see (your puzzle input).

The pipes are arranged in a two-dimensional grid of tiles:

| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
Based on the acoustics of the animal's scurrying, you're confident the pipe that contains the animal is one large, continuous loop.

For example, here is a square loop of pipe:

.....
.F-7.
.|.|.
.L-J.
.....
If the animal had entered this loop in the northwest corner, the sketch would instead look like this:

.....
.S-7.
.|.|.
.L-J.
.....
In the above diagram, the S tile is still a 90-degree F bend: you can tell because of how the adjacent pipes connect to it.

Unfortunately, there are also many pipes that aren't connected to the loop! This sketch shows the same loop as above:

-L|F7
7S-7|
L|7||
-L-J|
L|-JF
In the above diagram, you can still figure out which pipes form the main loop: they're the ones connected to S, pipes those pipes connect to, pipes those pipes connect to, and so on. Every pipe in the main loop connects to its two neighbors (including S, which will have exactly two pipes connecting to it, and which is assumed to connect back to those two pipes).

Here is a sketch that contains a slightly more complex main loop:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...
Here's the same example sketch with the extra, non-main-loop pipe tiles also shown:

7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
If you want to get out ahead of the animal, you should find the tile in the loop that is farthest from the starting position. Because the animal is in the pipe, it doesn't make sense to measure this by direct distance. Instead, you need to find the tile that would take the longest number of steps along the loop to reach from the starting point - regardless of which way around the loop the animal went.

In the first example with the square loop:

.....
.S-7.
.|.|.
.L-J.
.....
You can count the distance each tile in the loop is from the starting point like this:

.....
.012.
.1.3.
.234.
.....
In this example, the farthest point from the start is 4 steps away.

Here's the more complex loop again:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...
Here are the distances for each tile on that loop:

..45.
.236.
01.78
14567
23...
Find the single giant loop starting at S. How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?

Your puzzle answer was 6738.
*/
const { getInputArray, print } = require("../../utils");
const start = Date.now();

function main() {
  // const input = getInputArray(__dirname, "/test1.txt");
  const input = getInputArray(__dirname);
  let grid = input.map((line) => line.split(""));
  grid = addBuffer(grid);
  let key = makeBlankGrid(grid.length, grid[0].length);
  const start = findStart(grid);

  key[start[1]][start[0]] = 0;

  const connections = {
    [start]: {
      dist: 0,
      neighbors: [],
      char: "S",
      coord: start,
    },
  };

  let queue = [{ x: start[0], y: start[1], d: 0 }];

  while (queue.length) {
    let current = queue.shift();
    let { x, y, d } = current;
    const prev = [x, y];

    const n = y - 1;
    const s = y + 1;
    const w = x - 1;
    const e = x + 1;

    // check up
    const up = [x, n];
    if (compass["N"].includes(grid[n][x]) && !connections[up]) {
      const dist = d + 1;
      const char = grid[n][x];
      connections[prev].neighbors.push(up);
      connections[up] = { dist, char, neighbors: [prev], coord: up };
      queue.push({ x, y: n, d: dist });
      key[n][x] = dist;
    }

    // check down
    const down = [x, s];
    if (compass["S"].includes(grid[s][x]) && !connections[down]) {
      const dist = d + 1;
      const char = grid[s][x];
      connections[prev].neighbors.push(down);
      connections[down] = { dist, char, neighbors: [prev], coord: down };
      queue.push({ x, y: s, d: dist });
      key[s][x] = dist;
    }

    // check left
    const left = [w, y];
    if (compass["W"].includes(grid[y][w]) && !connections[left]) {
      const dist = d + 1;
      const char = grid[y][w];
      connections[prev].neighbors.push(left);
      connections[left] = { dist, char, neighbors: [prev], coord: left };
      queue.push({ x: w, y, d: dist });
      key[y][w] = dist;
    }

    // check right
    const right = [e, y];
    if (compass["E"].includes(grid[y][e]) && !connections[right]) {
      const dist = d + 1;
      const char = grid[y][e];
      connections[prev].neighbors.push(right);
      connections[right] = { dist, char, neighbors: [prev], coord: right };
      queue.push({ x: e, y, d: dist });
      key[y][e] = dist;
    }
  }

  return Object.values(connections).reduce((p, c) => Math.max(p, c.dist), 0);

  printKey(key);
}

const compass = {
  N: ["F", "7", "|"],
  S: ["L", "J", "|"],
  E: ["J", "7", "-"],
  W: ["F", "L", "-"],
};

const findStart = (grid) => {
  let x = 0;
  let y = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        x = j;
        y = i;
      }
    }
  }
  return [x, y];
};

const addBuffer = (grid) => {
  grid = grid.map((line) => [".", ...line, "."]);
  const n = grid[0].length;
  const blankRow = new Array(n).fill(".");
  grid = [blankRow, ...grid, blankRow];
  return grid;
};

const makeBlankGrid = (y, x) => {
  let blank = [];
  for (let i = 0; i < y; i++) {
    let row = [];
    for (let j = 0; j < x; j++) {
      row.push(".");
    }
    blank.push(row);
  }
  return blank;
};

const printKey = (key) => {
  let result = "";
  for (const row of key) {
    result += row.join("") + "\n";
  }
  console.log(result);
};

console.log(main());

console.log("Time", Date.now() - start, "ms");

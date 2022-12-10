/*
--- Day 8: Treetop Tree House ---
The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

30373
25512
65332
33549
35390
Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:

The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
The top-middle 5 is visible from the top and right.
The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
The left-middle 5 is visible, but only from the right.
The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
The right-middle 3 is visible from the right.
In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

Consider your map; how many trees are visible from outside the grid?

Your puzzle answer was 1672.
*/
const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname, "/input.txt");
const start = Date.now();

function main() {
  let totalVisibleTrees = 0;
  const inputArr = input.map((str) => str.split("").map((x) => Number(x)));

  // Loop through each row of input
  for (let i = 0; i < inputArr.length; i++) {
    // Loop through each tree of row
    for (let j = 0; j < inputArr[i].length; j++) {
      totalVisibleTrees += isTreeVisible(inputArr, j, i);
    }
  }

  return totalVisibleTrees;
}

// Checks for visibility in all directions
function isTreeVisible(grid, x, y) {
  const isEdge =
    x === 0 || x === grid[0].length - 1 || y === 0 || y === grid.length - 1;
  if (isEdge) return true;

  const treeHeight = grid[y][x];

  // Check horizontal
  const isVisibleRight =
    grid[y].slice(x + 1).filter((n) => n >= treeHeight).length === 0;
  if (isVisibleRight) return true;
  const isVisibleLeft =
    grid[y].slice(0, x).filter((n) => n >= treeHeight).length === 0;
  if (isVisibleLeft) return true;

  // Check vertical
  let isVisibleUp = true;
  for (let i = y - 1; i >= 0; i--) {
    const currentTree = grid[i][x];
    if (currentTree >= treeHeight) {
      isVisibleUp = false;
      break;
    }
  }
  if (isVisibleUp) return true;

  let isVisibleDown = true;
  for (let i = y + 1; i < grid.length; i++) {
    const currentTree = grid[i][x];
    if (currentTree >= treeHeight) {
      isVisibleDown = false;
      break;
    }
  }
  if (isVisibleDown) return true;
  return false;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

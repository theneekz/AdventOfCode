/*
--- Part Two ---
Content with the amount of tree cover available, the Elves just need to know the best spot to build their tree house: they would like to be able to see a lot of trees.

To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

The Elves don't care about distant trees taller than those found by the rules above; the proposed tree house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

In the example above, consider the middle 5 in the second row:

30373
25512
65332
33549
35390
Looking up, its view is not blocked; it can see 1 tree (of height 3).
Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
Looking right, its view is not blocked; it can see 2 trees.
Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).
A tree's scenic score is found by multiplying together its viewing distance in each of the four directions. For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

30373
25512
65332
33549
35390
Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
Looking left, its view is not blocked; it can see 2 trees.
Looking down, its view is also not blocked; it can see 1 tree.
Looking right, its view is blocked at 2 trees (by a massive tree of height 9).
This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

Consider each tree on your map. What is the highest scenic score possible for any tree?
*/
const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname, "/input.txt");
const start = Date.now();

function main() {
  let maxTreeScore = 0;
  const inputArr = input.map((str) => str.split("").map((x) => Number(x)));

  // Loop through each row of input
  for (let i = 0; i < inputArr.length; i++) {
    // Loop through each tree of row
    for (let j = 0; j < inputArr[i].length; j++) {
      maxTreeScore = Math.max(maxTreeScore, getTreeScore(inputArr, j, i));
    }
  }

  return maxTreeScore;
}

// Checks for visibility in all directions
function getTreeScore(grid, x, y) {
  const treeHeight = grid[y][x];

  // Check horizontal
  let rightScore = 0;
  for (let i = x + 1; i < grid[y].length; i++) {
    rightScore++;
    const currentTree = grid[y][i];
    if (currentTree >= treeHeight) {
      break;
    }
  }
  let leftScore = 0;
  for (let i = x - 1; i >= 0; i--) {
    leftScore++;
    const currentTree = grid[y][i];
    if (currentTree >= treeHeight) {
      break;
    }
  }

  // Check vertical
  let upScore = 0;
  for (let i = y - 1; i >= 0; i--) {
    upScore++;
    const currentTree = grid[i][x];
    if (currentTree >= treeHeight) {
      break;
    }
  }

  let downScore = 0;
  for (let i = y + 1; i < grid.length; i++) {
    downScore++;
    const currentTree = grid[i][x];
    if (currentTree >= treeHeight) {
      break;
    }
  }

  return rightScore * leftScore * upScore * downScore;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

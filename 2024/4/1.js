/*
--- Day 4: Ceres Search ---
"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:


..X...
.SAMX.
.A..A.
XMAS.S
.X....
The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
Take a look at the little Elf's word search. How many times does XMAS appear?

Your puzzle answer was 2358.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((row) =>
    row.split("")
  );
  let result = 0;

  const isXmas = (...a) => a.join("") == "XMAS";

  // Iterate through each row
  for (let row = 0; row < input.length; row++) {
    // Iterate through each col of row
    for (let col = 0; col < input[row].length; col++) {
      // Check for matches where X starts at input[row][col]
      // If x >= 3 check W
      const checkW = col >= 3;
      // If x <= row.length - 4 check E
      const checkE = col <= input[row].length - 4;
      // If y >= 3 check N
      const checkN = row >= 3;
      // If y <= input.length - 4 check S
      const checkS = row <= input.length - 4;

      // Check W, NW, N, NE, E, SE, S, SW,
      if (checkW) {
        result += isXmas(
          input[row][col],
          input[row][col - 1],
          input[row][col - 2],
          input[row][col - 3]
        );
      }
      if (checkW && checkN) {
        result += isXmas(
          input[row][col],
          input[row - 1][col - 1],
          input[row - 2][col - 2],
          input[row - 3][col - 3]
        );
      }
      if (checkN) {
        result += isXmas(
          input[row][col],
          input[row - 1][col],
          input[row - 2][col],
          input[row - 3][col]
        );
      }
      if (checkE && checkN) {
        result += isXmas(
          input[row][col],
          input[row - 1][col + 1],
          input[row - 2][col + 2],
          input[row - 3][col + 3]
        );
      }
      if (checkE) {
        result += isXmas(
          input[row][col],
          input[row][col + 1],
          input[row][col + 2],
          input[row][col + 3]
        );
      }
      if (checkE && checkS) {
        result += isXmas(
          input[row][col],
          input[row + 1][col + 1],
          input[row + 2][col + 2],
          input[row + 3][col + 3]
        );
      }
      if (checkS) {
        result += isXmas(
          input[row][col],
          input[row + 1][col],
          input[row + 2][col],
          input[row + 3][col]
        );
      }
      if (checkW && checkS) {
        result += isXmas(
          input[row][col],
          input[row + 1][col - 1],
          input[row + 2][col - 2],
          input[row + 3][col - 3]
        );
      }
    }
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

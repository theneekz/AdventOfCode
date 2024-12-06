/*
--- Part Two ---
The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S
Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

Your puzzle answer was 1737.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((row) =>
    row.split("")
  );
  let result = 0;

  const isMas = (...a) => {
    return a.join("") == "MAS";
  };
  // Iterate through each row
  for (let row = 0; row < input.length; row++) {
    // Iterate through each col of row
    for (let col = 0; col < input[row].length; col++) {
      // Check for matches where A starts at input[row][col]
      if (
        !(
          row > 0 &&
          row < input.length - 1 &&
          col > 0 &&
          col < input[row].length - 1
        )
      )
        continue;

      const checkNW = isMas(
        input[row - 1][col - 1],
        input[row][col],
        input[row + 1][col + 1]
      );

      const checkNE = isMas(
        input[row - 1][col + 1],
        input[row][col],
        input[row + 1][col - 1]
      );

      const checkSE = isMas(
        input[row + 1][col + 1],
        input[row][col],
        input[row - 1][col - 1]
      );

      const checkSW = isMas(
        input[row + 1][col - 1],
        input[row][col],
        input[row - 1][col + 1]
      );

      const isXmas =
        (checkNE && checkNW) ||
        (checkNE && checkSE) ||
        (checkNW && checkSW) ||
        (checkSE && checkSW);

      result += isXmas;
    }
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

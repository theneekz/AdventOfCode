/*
--- Part Two ---
On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time counting its arms, the safe thing to do is to figure out which board will win last and choose that one. That way, no matter which boards it picks, it will win for sure.

In the above example, the second board is the last to win, which happens after 13 is eventually called and its middle column is completely marked. If you were to keep playing until this point, the second board would have a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?
*/

const { getInput } = require("../../utils");
const input = getInput(__dirname);
const inputArray = input.split("\n\n");
//get called bingo numbers
const bingoInput = inputArray[0].split(",").map((x) => parseInt(x, 10));
//get bingo boards
let bingoBoards = inputArray.slice(1).map((board) => {
  board = board.split("\n");
  return board.map((row) => {
    return row
      .split(" ")
      .filter((x) => x !== "")
      .map((x) => parseInt(x, 10));
  });
});
//holds finished boards
const winners = [];

//loop through bingoInput numbers
for (let i = 0; i < bingoInput.length; i++) {
  const lastCalled = bingoInput[i];

  //mark each number on each board with x

  //loop through boards
  bingoBoards = bingoBoards.map((currentBoard) => {
    if (!currentBoard) return null;
    //loop through rows
    return currentBoard.map((row) => {
      //filter row for current bingoInput number, replacing for 'x'
      return row.map((x) => {
        return x === lastCalled ? "x" : x;
      });
    });
  });

  //check for bingo
  const findWinners = () => {
    //loop through boards
    for (let boardIndex = 0; boardIndex < bingoBoards.length; boardIndex++) {
      const boardToCheck = bingoBoards[boardIndex];
      if (!boardToCheck) continue;
      //initialize 5 arrays to hold column 'x's
      const columnsWithXs = [[], [], [], [], []];
      //loop through rows
      for (const row of boardToCheck) {
        //check if row is all 'x's
        if (row.filter((x) => x === "x").length === 5) {
          //if so save winning board
          winners.push(boardToCheck);
          bingoBoards[boardIndex] = null;
          break;
        }
        //push any 'x' into column array
        for (let col = 0; col < row.length; col++) {
          const isLastRow = col === 4;
          if (row[col] === "x") {
            columnsWithXs[col].push("x");
          }
          if (isLastRow) {
            //on final row/col, check if any column arrays are winners
            if (
              columnsWithXs.filter(
                (col) => col.filter((x) => x === "x").length === 5
              ).length === 1
            ) {
              //if so save winning board
              winners.push(boardToCheck);
              bingoBoards[boardIndex] = null;
              break;
            }
          }
        }
      }
    }
  };

  findWinners();

  //if all are won
  if (winners.length === bingoBoards.length) {
    //get last winner
    const winner = winners.pop();
    //calculate sum of remaining numbers on winning board
    const sum = winner.reduce((prev, current) => {
      return (
        prev +
        current.reduce((p, c) => {
          if (typeof c === "number") {
            return p + c;
          }
          return p;
        }, 0)
      );
    }, 0);
    console.log(sum); //246
    console.log(lastCalled); //20
    console.log(sum * lastCalled); //4920
    return;
  }
}

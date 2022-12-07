/*
--- Day 4: Giant Squid ---
You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.

Maybe it wants to play bingo?

Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)

The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:

7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows (shown here adjacent to each other to save space):

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
Finally, 24 is drawn:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).

The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.

To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?
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

//loop through bingoInput numbers
for (let i = 0; i < bingoInput.length; i++) {
  const lastCalled = bingoInput[i];

  //mark each number on each board with x

  //loop through boards
  bingoBoards = bingoBoards.map((currentBoard) => {
    //loop through rows
    return currentBoard.map((row) => {
      //filter row for current bingoInput number, replacing for 'x'
      return row.map((x) => {
        return x === lastCalled ? "x" : x;
      });
    });
  });

  //check for bingo
  const findWinner = () => {
    //loop through boards
    for (let boardIndex = 0; boardIndex < bingoBoards.length; boardIndex++) {
      const boardToCheck = bingoBoards[boardIndex];
      //initialize 5 arrays to hold column 'x's
      const columnsWithXs = [[], [], [], [], []];
      //loop through rows
      for (const row of boardToCheck) {
        //check if row is all 'x's
        if (row.filter((x) => x === "x").length === 5) {
          //if so return winning board
          return boardToCheck;
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
              //if so return winning board
              return boardToCheck;
            }
          }
        }
      }
    }
    return null;
  };

  const winner = findWinner();
  //if there is a winner
  if (winner) {
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
    console.log(sum); //782
    console.log(lastCalled); //42
    console.log(sum * lastCalled); //32844
    return;
  }
}

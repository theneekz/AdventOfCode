const fs = require('fs');
// const input = fs.readFileSync('test.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input
  .split('\n')
  .slice(0, -1)
  .map((parent) => {
    return parent.split('');
  });

let boardChanged = true;

const makeBoard = () => {
  let nextBoard = [];
  for (let row = 0; row < inputArr.length; row++) {
    let rowArr = [];
    for (let col = 0; col < inputArr[0].length; col++) {
      rowArr.push('');
    }
    nextBoard.push(rowArr);
  }
  return nextBoard;
};

const step = (prevBoard, nextBoard) => {
  boardChanged = false;
  for (let i = 0; i < prevBoard.length; i++) {
    for (let j = 0; j < prevBoard[0].length; j++) {
      //FIND OCCUPIED NEIGHBORS
      let allNeighbors = [];
      //row above
      if (i > 0) {
        allNeighbors.push(prevBoard[i - 1][j - 1]);
        allNeighbors.push(prevBoard[i - 1][j]);
        allNeighbors.push(prevBoard[i - 1][j + 1]);
      }
      //row below
      if (i < prevBoard.length - 1) {
        allNeighbors.push(prevBoard[i + 1][j - 1]);
        allNeighbors.push(prevBoard[i + 1][j]);
        allNeighbors.push(prevBoard[i + 1][j + 1]);
      }
      //left and right
      if (j > 0) allNeighbors.push(prevBoard[i][j - 1]);
      if (j < prevBoard[0].length - 1) allNeighbors.push(prevBoard[i][j + 1]);
      //take out any undefined
      let filteredResult = allNeighbors.filter((x) => x !== undefined);
      let adjacentTaken = 0;
      filteredResult.forEach((seat) => {
        if (seat === '#') adjacentTaken++;
      });

      //RULES
      let current = prevBoard[i][j];
      if (current === '#' && adjacentTaken > 3) {
        /*becomes empty*/
        nextBoard[i][j] = 'L';
        boardChanged = true;
      } else if (current === 'L' && adjacentTaken === 0) {
        /*becomes taken*/
        nextBoard[i][j] = '#';
        boardChanged = true;
      } else {
        /* stays the same */
        nextBoard[i][j] = current;
      }
    }
  }
};

let finalBoard = [...inputArr];

while (boardChanged) {
  let blankBoard = makeBoard();
  step(finalBoard, blankBoard);
  finalBoard = [...blankBoard];
}

let endOccupied = 0;

finalBoard.flat().forEach((seat) => {
  if (seat === '#') endOccupied++;
});

console.log(endOccupied);

const fs = require('fs');
//const input = fs.readFileSync('test.txt', 'utf-8');
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

      const findUpperLeft = (x, y, arr) => {
        if (x === 0 || y === 0) return;
        while (x > 0 && y > 0) {
          if (arr[x - 1][y - 1] && arr[x - 1][y - 1] !== '.') {
            return arr[x - 1][y - 1];
          } else {
            x -= 1;
            y -= 1;
          }
        }
        return '.';
      };
      const findUp = (x, y, arr) => {
        if (x === 0) return;
        while (x > 0) {
          if (arr[x - 1] && arr[x - 1][y] !== '.') {
            return arr[x - 1][y];
          } else {
            x -= 1;
          }
        }
        return '.';
      };
      const findUpperRight = (x, y, arr) => {
        if (x === 0 || j === arr[0].length - 1) return;
        while (x > 0 && y < arr[0].length) {
          if (arr[x - 1] && arr[x - 1][y + 1] !== '.') {
            return arr[x - 1][y + 1];
          } else {
            x -= 1;
            y += 1;
          }
        }
        return '.';
      };
      allNeighbors.push(findUpperLeft(i, j, prevBoard));
      allNeighbors.push(findUp(i, j, prevBoard));
      allNeighbors.push(findUpperRight(i, j, prevBoard));

      //row below
      const findLowerLeft = (x, y, arr) => {
        if (x === arr.length - 1 || j === 0) return;
        while (x < arr.length && y > 0) {
          if (arr[x + 1] && arr[x + 1][y - 1] !== '.') {
            return arr[x + 1][y - 1];
          } else {
            x += 1;
            y -= 1;
          }
        }
        return '.';
      };
      const findLow = (x, y, arr) => {
        if (x === arr.length - 1) return;
        while (x < arr.length) {
          if (arr[x + 1] && arr[x + 1][y] !== '.') {
            return arr[x + 1][y];
          } else {
            x += 1;
          }
        }
        return '.';
      };
      const findLowerRight = (x, y, arr) => {
        if (x === arr.length - 1 || j === arr[0].length - 1) return;
        while (x < arr.length && y < arr[0].length) {
          if (arr[x + 1] && arr[x + 1][y + 1] !== '.') {
            return arr[x + 1][y + 1];
          } else {
            x += 1;
            y += 1;
          }
        }
        return '.';
      };
      allNeighbors.push(findLowerLeft(i, j, prevBoard));
      allNeighbors.push(findLow(i, j, prevBoard));
      allNeighbors.push(findLowerRight(i, j, prevBoard));

      //left and right
      const findLeft = (x, y, arr) => {
        if (y === 0) return;
        while (y > 0) {
          if (arr[x][y - 1] && arr[x][y - 1] !== '.') {
            return arr[x][y - 1];
          } else {
            y -= 1;
          }
        }
        return '.';
      };
      allNeighbors.push(findLeft(i, j, prevBoard));

      const findRight = (x, y, arr) => {
        if (y === arr[0].length - 1) return;
        while (y < arr[0].length) {
          if (arr[x][y + 1] && arr[x][y + 1] !== '.') {
            return arr[x][y + 1];
          } else {
            y += 1;
          }
        }
        return '.';
      };
      allNeighbors.push(findRight(i, j, prevBoard));

      //take out any undefined
      let filteredResult = allNeighbors.filter((x) => x !== undefined);
      //if (i === 2 && j === 0) console.log(allNeighbors);
      let adjacentTaken = 0;
      filteredResult.forEach((seat) => {
        if (seat === '#') adjacentTaken++;
      });

      //RULES
      let current = prevBoard[i][j];
      if (current === '#' && adjacentTaken > 4) {
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

let txtOutput = '';
let finalBoard = [...inputArr];

while (boardChanged) {
  let blankBoard = makeBoard();
  finalBoard.forEach((row) => {
    row.forEach((col) => {
      txtOutput += col;
    });
    txtOutput += '\n';
  });
  txtOutput += '\n-----\n';
  step(finalBoard, blankBoard);
  finalBoard = [...blankBoard];
}

fs.writeFileSync('output.txt', txtOutput);

let endOccupied = 0;

finalBoard.flat().forEach((seat) => {
  if (seat === '#') endOccupied++;
});

console.log(endOccupied);

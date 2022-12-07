const fs = require('fs');
//const input = fs.readFileSync('test.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);

let directions = ['N', 'E', 'S', 'W'];
//direction[current]
let current = 1;
//right + north
let totalNorth = 0;
let totalEast = 0;

//let line = 'L900';
inputArr.forEach((line) => {
  let action = line.slice(0, 1);
  let value = parseInt(line.slice(1), 10);
  switch (action) {
    case 'N':
      totalNorth += value;
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    case 'E':
      totalEast += value;
      console.log(action, value, { current }, { totalEast }, { totalEast });
      break;
    case 'S':
      totalNorth -= value;
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    case 'W':
      totalEast -= value;
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    case 'F':
      if (current === 0) {
        totalNorth += value;
      } else if (current === 2) {
        totalNorth -= value;
      } else if (current === 1) {
        totalEast += value;
      } else {
        totalEast -= value;
      }
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    case 'L':
      for (let i = value / 90; i > 0; i--) {
        current--;
        if (current === -1) current = 3;
      }
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    case 'R':
      for (let i = value / 90; i > 0; i--) {
        current++;
        if (current === 4) current = 0;
      }
      console.log(action, value, { current }, { totalNorth }, { totalEast });
      break;
    default:
      console.log('something went wrong');
      break;
  }
});

console.log(Math.abs(totalNorth) + Math.abs(totalEast));

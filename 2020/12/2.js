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
let wayPointNorth = 1;
let wayPointEast = 10;

//let line = 'F10';
inputArr.forEach((line) => {
  let action = line.slice(0, 1);
  let value = parseInt(line.slice(1), 10);

  switch (action) {
    case 'N':
      wayPointNorth += value;
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'E':
      wayPointEast += value;
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'S':
      wayPointNorth -= value;
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'W':
      wayPointEast -= value;
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'F':
      for (let i = 0; i < value; i++) {
        totalNorth += wayPointNorth;
        totalEast += wayPointEast;
      }
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'L':
      for (let i = value / 90; i > 0; i--) {
        let temp = wayPointEast;
        wayPointEast = wayPointNorth * -1;
        wayPointNorth = temp;
      }
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    case 'R':
      for (let i = value / 90; i > 0; i--) {
        let temp = wayPointEast;
        wayPointEast = wayPointNorth;
        wayPointNorth = temp * -1;
        if (current === 4) current = 0;
      }
      console.log(
        action,
        value,
        { wayPointNorth },
        { wayPointEast },
        { totalNorth },
        { totalEast }
      );
      break;
    default:
      console.log('something went wrong');
      break;
  }
});

console.log(Math.abs(totalNorth) + Math.abs(totalEast));

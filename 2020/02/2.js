const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const inputArr = input.split('\n');

const test = (pos1, pos2, char, pass) => {
  let check1 = pass[pos1 - 1] === char;
  let check2 = pass[pos2 - 1] === char;

  return check1 !== check2;
};

let result = 0;

for (let row = 0; row < 1000; row++) {
  let thisRow = inputArr[row].split(': ');
  let thisRule = thisRow[0].split(' ');
  let thisRange = thisRule[0].split('-');
  let thisPos1 = thisRange[0];
  let thisPos2 = thisRange[1];
  let thisChar = thisRule[1];
  let thisPassword = thisRow[1];

  if (test(thisPos1, thisPos2, thisChar, thisPassword)) result++;
}

console.log(result);

return;

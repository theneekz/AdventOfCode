const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const inputArr = input.split('\n');

const test = (min, max, char, pass) => {
  let regex = new RegExp(char, 'g');
  let count = (pass.match(regex) || []).length;
  return count >= min && count <= max;
};

let result = 0;

for (let row = 0; row < 1000; row++) {
  let thisRow = inputArr[row].split(':');
  let thisRule = thisRow[0].split(' ');
  let thisRange = thisRule[0].split('-');
  let thisMin = thisRange[0];
  let thisMax = thisRange[1];
  let thisChar = thisRule[1];
  let thisPassword = thisRow[1];

  if (test(thisMin, thisMax, thisChar, thisPassword)) result++;
}

console.log(result);
return;

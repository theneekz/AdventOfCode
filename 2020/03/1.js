const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n').slice(0, -1);

//moves 3 right and 1 down
//width is 31 (can multiply out to the right) length is 323 (fixed)
//3 * 323 = 969 / 31 = 31.26 ~ 32
const fullSlope = inputArr.map((row) => row.repeat(32));

let index = 0;
let treeCount = 0;

for (let row = 1; row < fullSlope.length; row++) {
  index += 3;
  if (fullSlope[row][index] === '#') treeCount++;
}

console.log(treeCount);
return;

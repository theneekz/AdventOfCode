const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n').slice(0, -1);

//moves up to 7 right and 1 down
//width is 31 (can multiply out to the right) length is 323 (fixed)
//7 * 323 = 2261 / 31 = 72.9 ~ 73
const fullSlope = inputArr.map((row) => row.repeat(73));

let index1 = 0;
let treeCount1 = 0;
let index2 = 0;
let treeCount2 = 0;
let index3 = 0;
let treeCount3 = 0;
let index4 = 0;
let treeCount4 = 0;

for (let row = 1; row < fullSlope.length; row++) {
  index1 += 1;
  if (fullSlope[row][index1] === '#') treeCount1++;
  index2 += 3;
  if (fullSlope[row][index2] === '#') treeCount2++;
  index3 += 5;
  if (fullSlope[row][index3] === '#') treeCount3++;
  index4 += 7;
  if (fullSlope[row][index4] === '#') treeCount4++;
}

let index5 = 0;
let treeCount5 = 0;

for (let row = 2; row < fullSlope.length; row += 2) {
  index5 += 1;
  if (fullSlope[row][index5] === '#') treeCount5++;
}

console.log(treeCount1 * treeCount2 * treeCount3 * treeCount4 * treeCount5);
return;

//should be 2*O(n) so O(n)

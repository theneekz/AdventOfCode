const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);

let sortedInput = inputArr.sort((a, b) => a - b).map((str) => parseInt(str));

let oneJoltDiff = 0;
let threeJoltDiff = 0;

for (let i = 0; i < sortedInput.length; i++) {
  let lastNum = i - 1 > -1 ? sortedInput[i - 1] : 0;
  let current = sortedInput[i];
  let diff = current - lastNum;
  if (diff === 1) oneJoltDiff++;
  if (diff === 3) threeJoltDiff++;
}

threeJoltDiff++;

console.log(oneJoltDiff * threeJoltDiff);

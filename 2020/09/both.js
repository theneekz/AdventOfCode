const fs = require('fs');
//const input = fs.readFileSync('test.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input
  .split('\n')
  .slice(0, -1)
  .map((str) => parseInt(str));

let hash = {};
let arr = [];
let start = -1;
let end = 23;
let result;

do {
  start++;
  end++;
  arr = [];
  hash = {};
  for (let i = start; i < end; i++) {
    let current = inputArr[i];
    arr.push(current);
    for (let j = i + 1; j < end + 1; j++) {
      let next = inputArr[j];
      hash[current + next] = true;
    }
  }

  result = !hash.hasOwnProperty(inputArr[end + 1]);
} while (result === false && end < inputArr.length - 1);

let targetSum = inputArr[end + 1];
//part 2
let resultArr = [];

for (let left = 0; left < inputArr.length - 1; left++) {
  for (let right = left + 1; right < inputArr.length; right++) {
    let testArr = inputArr.slice(left, right + 1);
    let testSum = testArr.reduce((a, b) => a + b, 0);
    if (testSum === targetSum) {
      resultArr = [...testArr];
      break;
    }
  }
}
resultArr.sort((a, b) => a - b);
console.log(resultArr[0] + resultArr[resultArr.length - 1]);

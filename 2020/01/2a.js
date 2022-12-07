const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const inputArr = input
  .split('\n')
  .map((entry) => parseInt(entry))
  .sort((a, b) => a - b);

for (let i = 0; i < inputArr.length - 2; i++) {
  let lIdx = i;
  let rIdx = 199;
  let mIdx = lIdx + 1;

  while (lIdx < rIdx) {
    let thisSum = inputArr[rIdx] + inputArr[lIdx] + inputArr[mIdx];
    if (thisSum === 2020) {
      console.log(inputArr[rIdx] * inputArr[lIdx] * inputArr[mIdx]);
      return;
    } else if (thisSum < 2020) {
      mIdx++;
    } else if (thisSum > 2020) {
      rIdx--;
    }
  }
}

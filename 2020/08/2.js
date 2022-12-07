const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = fs.readFileSync('test.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);
let seenIdx = {};
let jmpIndexes = [];
let nopIndexes = [];
let steps = 0;

inputArr.forEach((row, i) => {
  let inst = row.split(' ')[0];
  if (inst === 'nop') nopIndexes.push(i);
  if (inst === 'jmp') jmpIndexes.push(i);
});

const helper = (row = 0, total = 0, hist = [], arr = inputArr) => {
  // steps++;
  // console.log({ steps });
  if (hist.includes(row)) {
    return false;
  } else {
    hist = [...hist, row];
    if (row >= arr.length) return total;
    else {
      let [inst, opp] = arr[row].split(' ');
      if (inst === 'nop') {
        return helper((row += 1), total, hist, arr);
      } else if (inst === 'acc') {
        if (opp[0] === '+') total += parseInt(opp.slice(1));
        if (opp[0] === '-') total -= parseInt(opp.slice(1));
        return helper((row += 1), total, hist, arr);
      } else if (inst === 'jmp') {
        if (opp[0] === '+') row += parseInt(opp.slice(1));
        if (opp[0] === '-') row -= parseInt(opp.slice(1));
        return helper(row, total, hist, arr);
      }
    }
    return 'got here by mistake';
  }
};

let result = false;
do {
  let switchIndex = jmpIndexes.pop();
  let tempArr = [...inputArr];
  tempArr[switchIndex] = `nop ${inputArr[switchIndex].split(' ')[1]}`;
  result = helper(0, 0, [], tempArr);
} while (jmpIndexes.length > 0 && result === false);

console.log({ result });

if (result === false) {
  do {
    let switchIndex = nopIndexes.pop();
    let tempArr = [...inputArr];
    tempArr[switchIndex] = `jmp ${inputArr[switchIndex].split(' ')[1]}`;
    result = helper(0, 0, [], tempArr);
  } while (nopIndexes.length > 0 && result === false);

  console.log({ result });
}

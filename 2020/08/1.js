const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = fs.readFileSync('test.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);

const helper = (row = 0, total = 0, hist = []) => {
  if (hist.includes(row)) return total;
  else hist = [...hist, row];
  let [inst, opp] = inputArr[row].split(' ');
  if (inst === 'nop') {
    return helper((row += 1), total, hist);
  } else if (inst === 'acc') {
    if (opp[0] === '+') total += parseInt(opp.slice(1));
    if (opp[0] === '-') total -= parseInt(opp.slice(1));
    return helper((row += 1), total, hist);
  } else if (inst === 'jmp') {
    if (opp[0] === '+') row += parseInt(opp.slice(1));
    if (opp[0] === '-') row -= parseInt(opp.slice(1));
    return helper(row, total, hist);
  }
  return 'got here';
};

console.log(helper());

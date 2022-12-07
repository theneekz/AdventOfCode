const fs = require('fs');
//const input = fs.readFileSync('test.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);
const busRow = inputArr[1].split(',');
const buses = busRow
  .filter((route) => route !== 'x')
  .map((route) => parseInt(route, 10));

function crt(num, rem) {
  let sum = 0;
  const prod = num.reduce((a, c) => a * c, 1);

  for (let i = 0; i < num.length; i++) {
    const [ni, ri] = [num[i], rem[i]];
    const p = Math.floor(prod / ni);
    sum += ri * p * mulInv(p, ni);
  }
  return sum % prod;
}

function mulInv(a, b) {
  const b0 = b;
  let [x0, x1] = [0, 1];

  if (b === 1) {
    return 1;
  }
  while (a > 1) {
    const q = Math.floor(a / b);
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
}
let remainders = buses.map((bus) => bus - busRow.indexOf(bus.toString()));

console.log(crt(buses, remainders));

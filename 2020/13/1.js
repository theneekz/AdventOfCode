const fs = require('fs');
//const input = fs.readFileSync('test.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);
const timeStamp = parseInt(inputArr[0], 10);
const buses = inputArr[1]
  .split(',')
  .filter((route) => route !== 'x')
  .map((route) => parseInt(route, 10));

let resultVal = Infinity;
let resultBusId;

buses.forEach((bus) => {
  let next = bus - (timeStamp % bus);
  if (next < resultVal) {
    resultVal = next;
    resultBusId = bus;
  }
});

console.log(resultVal * resultBusId);

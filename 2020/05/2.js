const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n').slice(0, -1);

let seats = {};

inputArr.forEach((pass) => {
  let rawRow = pass.slice(0, 7);
  let rawCol = pass.slice(7);
  let row = parseInt(rawRow.replace(/B/g, 1).replace(/F/g, 0), 2);
  let col = parseInt(rawCol.replace(/R/g, 1).replace(/L/g, 0), 2);

  if (seats[row]) seats[row].push(col);
  else seats[row] = [col];
});

let possibleAnswers = [];

for (const prop in seats) {
  if (seats[prop].length < 8) {
    let missingSeat = 28 - seats[prop].reduce((a, b) => a + b);
    possibleAnswers.push(prop * 8 + missingSeat);
  }
}
console.log(possibleAnswers[1]);
return;

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n');

let maxID = 0;

inputArr.forEach((pass) => {
  let rawRow = pass.slice(0, 7);
  let rawCol = pass.slice(7);
  let row = parseInt(rawRow.replace(/B/g, 1).replace(/F/g, 0), 2);
  let col = parseInt(rawCol.replace(/R/g, 1).replace(/L/g, 0), 2);

  let id = row * 8 + col;

  if (id > maxID) maxID = id;
});

console.log(maxID);
return;

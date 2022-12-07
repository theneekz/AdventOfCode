const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n\n');

let validResults = 0;

let regex = /(\bbyr|\biyr|\beyr|\bhgt|\bhcl|\becl|\bpid)/gm;

inputArr.forEach((passport) => {
  if (passport.match(regex).length === 7) validResults++;
});

console.log(validResults);
return;

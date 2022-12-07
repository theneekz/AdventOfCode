const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const inputArr = input.split('\n\n');

let totalCount = 0;

inputArr.forEach((group) => {
  let groupLetters = '';
  let groupCount = 0;
  let people = group.split('\n');
  people.forEach((person) => {
    for (const letter of person.split('')) {
      if (!groupLetters.includes(letter)) {
        groupLetters += letter;
        groupCount++;
      }
    }
  });
  totalCount += groupCount;
});

console.log(totalCount);

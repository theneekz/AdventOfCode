const _ = require('lodash');
const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n\n');

let totalCount = 0;

inputArr.forEach((group) => {
  let people = group
    .split('\n')
    .map((person) => person.split(''))
    .filter((x) => x.length > 0);

  let groupCount = _.intersection(...people).length;

  totalCount += groupCount;
});

console.log(totalCount);

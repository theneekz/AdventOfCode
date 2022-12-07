const fs = require('fs');
//const input = fs.readFileSync('test2.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);

let allBags = [];

for (let i = 0; i < inputArr.length - 1; i++) {
  let row = inputArr[i];
  let index1 = row.search(' bags contain');
  let parentColor = row.slice(0, index1);
  let parent = { color: parentColor, children: {} };
  if (row.includes('no other bags.')) {
  } else {
    let childrenArr = row.slice(index1 + 14).split(', ');

    childrenArr.forEach((str) => {
      let index2 = str.search(' bag');
      let childColor = str.slice(2, index2);
      let childQuantity = str.slice(0, 1);
      parent.children[childColor] = childQuantity;
    });
    allBags.push(parent);
  }
}

const helper = (arr, color, quant = 1) => {
  let count = 0;
  arr.forEach((bag) => {
    if (bag.color === color) {
      for (const [key, value] of Object.entries(bag.children)) {
        for (let i = 0; i < quant; i++) {
          count += parseInt(value);
          count += helper(arr, key, parseInt(value));
        }
      }
    }
  });
  return count;
};

console.log(helper(allBags, 'shiny gold'));

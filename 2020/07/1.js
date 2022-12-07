const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = fs.readFileSync('test.txt', 'utf-8');
const inputArr = input.split('\n');

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

const findShiny = (arr) => {
  let resultCount = 0;
  let parentNames = [];
  let seenNames = {};
  for (let i = 0; i < arr.length; i++) {
    let parent = arr[i];
    let isDirectParent = parent.children['shiny gold'];
    if (isDirectParent) {
      seenNames[parent.color] = true;
      resultCount++;
      parentNames.push(parent.color);
    }
  }
  console.log('direct parents: ', resultCount);
  while (parentNames.length) {
    let current = parentNames.shift();
    arr.forEach((bag) => {
      if (bag.children[current]) {
        if (seenNames[bag.color] !== true) {
          seenNames[bag.color] = true;
          resultCount++;
          parentNames.push(bag.color);
        }
      }
    });
  }
  console.log('all: ', resultCount);
};

findShiny(allBags);

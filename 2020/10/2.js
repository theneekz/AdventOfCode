const fs = require('fs');
//const input = fs.readFileSync('test1.txt', 'utf-8');
//const input = fs.readFileSync('test2.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');
const inputArr = input.split('\n').slice(0, -1);

let sortedInput = inputArr.map((str) => parseInt(str)).sort((a, b) => a - b);
sortedInput.unshift(0);
sortedInput.push(sortedInput[sortedInput.length - 1] + 3);

let memo = {};

const makeMemo = (arr) => {
  for (let i = arr.length - 2; i > -1; i--) {
    let possibilities = arr.slice(i + 1).filter((x) => x - arr[i] < 4);
    let sumSoFar = 0;
    possibilities.forEach((val) => {
      if (memo[val]) {
        sumSoFar += memo[val];
      } else {
        sumSoFar = 1;
      }
    });
    memo[arr[i]] = sumSoFar;
  }
};
makeMemo(sortedInput);
console.log(memo[0]);

//---------------------------------------------------
////works with test 1 and 2
// let memo = {};

// const helper = (arr) => {
//   for (let i = 0; i < arr.length - 1; i++) {
//     let current = arr[i];
//     let next = arr[i + 1];
//     let diff = next - current;
//     if (diff > 3) return false;
//   }
//   return true;
// };

// const findResult = (arr) => {
//   for (let i = arr.length - 1; i > 1; i--) {
//     let current = arr[i];
//     if (i !== 0) {
//       let check = arr[i - 2];
//       let diff = current - check;
//       if (diff < 4) {
//         let temp = [...arr.slice(0, i - 1), ...arr.slice(i)];
//         if (memo[JSON.stringify(temp)]) {
//           continue;
//         } else {
//           memo[JSON.stringify(temp)] = true;
//           findResult(temp);
//         }
//       }
//     }
//   }
// };

// findResult(sortedInput);
// console.log(Object.keys(memo).length + 1);

//---------------------------------------------------

// let oneJoltDiff = 0;
// let twoJoltDiff = 0;
// let threeJoltDiff = 0;
// let steps = [];
// let result = 1;

// for (let i = 0; i < sortedInput.length; i++) {
//   // let lastNum = i - 1 > -1 ? sortedInput[i - 1] : 0;
//   let lastNum = sortedInput[i - 1] || 0;
//   let current = sortedInput[i];
//   let diff = current - lastNum;
//   if (diff === 1) {
//     oneJoltDiff++;
//     steps.push(1);
//   } else if (diff === 2) {
//     twoJoltDiff++;
//     steps.push(2);
//   } else if (diff === 3) {
//     threeJoltDiff++;
//     steps.push(3);
//   }
// }

// let memo = {};

// const factorial = (n) => {
//   if (memo[n]) {
//     return memo[n];
//   }
//   if (n === 0) {
//     memo[n] = 1;
//   } else {
//     memo[n] = n * factorial(n - 1);
//   }
//   return memo[n];
// };

// let patterns = 0;

// for (let j = 0; j < steps.length; j++) {
//   let current = steps[j];
//   if (current === 1) {
//     let oneRight = steps[j + 1];
//     let twoRight = steps[j + 2];
//     if (oneRight) {
//       //1, 1, 1
//       if (oneRight === 1 && twoRight === 1) {
//         patterns += 1;
//       }
//       //1,1
//       if (oneRight === 1) {
//         patterns += 1;
//       }
//       //1, 2
//       else if (oneRight === 2) {
//         patterns += 1;
//       }
//     }
//   } else if (current === 2) {
//     let oneRight = steps[j + 1];
//     //2,1
//     if (oneRight === 1) {
//       patterns += 1;
//     }
//   }
// }
// console.log('sorted input', sortedInput);
// console.log('steps', steps);
// console.log(factorial(patterns));

//---------------------------------------------------

//let possibleAnswers = [];
//create an array of every version of the sorted arr with ascending nums

// let results = [];
// let temp = [];
// for (let i = 0; i < sortedInput.length; i++) {
//   let current = sortedInput[i];
//   if (temp.length < 1) {
//     if (current < 4) {
//       temp.push(current);
//       continue;
//     }
//   } else {
//     let previous = temp[temp.length - 1];
//     if (current - previous <= 3) {
//       temp.push(current);
//       continue;
//     }
//   }
// }
// if (!results.includes(temp)) results.push(temp);

// let hasOneSteps = true;

//console.log(results);

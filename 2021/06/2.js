/*
--- Part Two ---
Suppose the lanternfish live forever and have unlimited food and space. Would they take over the entire ocean?

After 256 days in the example above, there would be a total of 26984457539 lanternfish!

How many lanternfish would there be after 256 days?
*/
const { getInput } = require("../../utils");
const input = getInput(__dirname);
const DAYS = 256;

let inputArr = input.split(",").map((x) => parseInt(x, 10));

let emptyPop = {
  day8: 0,
  day7: 0,
  day6: 0,
  day5: 0,
  day4: 0,
  day3: 0,
  day2: 0,
  day1: 0,
  day0: 0,
};

const makeEmpty = () => {
  return { ...emptyPop };
};

let population = makeEmpty();

//initialize population
inputArr.forEach((num) => {
  let key = "day" + num;
  population[key]++;
});

//handle day cycle (step)
const handleDay = () => {
  const newPop = makeEmpty();
  //loop through pop
  for (const key in population) {
    const age = parseInt(key.slice(3));
    const pop = population[key];
    let newAge = age - 1;
    if (newAge !== -1) {
      newAge = "day" + newAge;
      newPop[newAge] += pop;
    } else {
      newPop.day8 += pop;
      newPop.day6 += pop;
    }
  }
  population = { ...newPop };
};

//step through 80 days
for (let i = 0; i < DAYS; i++) {
  handleDay();
}

//sum all offspring
let result = 0;
for (const [key, val] of Object.entries(population)) {
  result += val;
}
console.log(result); //1590327954513

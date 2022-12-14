/*
--- Part Two ---
You're worried you might not ever get your items back. So worried, in fact, that your relief that a monkey's inspection didn't damage an item no longer causes your worry level to be divided by three.

Unfortunately, that relief was all that was keeping your worry levels from reaching ridiculous levels. You'll need to find another way to keep your worry levels manageable.

At this rate, you might be putting up with these monkeys for a very long time - possibly 10000 rounds!

With these new rules, you can still figure out the monkey business after 10000 rounds. Using the same example above:

== After round 1 ==
Monkey 0 inspected items 2 times.
Monkey 1 inspected items 4 times.
Monkey 2 inspected items 3 times.
Monkey 3 inspected items 6 times.

== After round 20 ==
Monkey 0 inspected items 99 times.
Monkey 1 inspected items 97 times.
Monkey 2 inspected items 8 times.
Monkey 3 inspected items 103 times.

== After round 1000 ==
Monkey 0 inspected items 5204 times.
Monkey 1 inspected items 4792 times.
Monkey 2 inspected items 199 times.
Monkey 3 inspected items 5192 times.

== After round 2000 ==
Monkey 0 inspected items 10419 times.
Monkey 1 inspected items 9577 times.
Monkey 2 inspected items 392 times.
Monkey 3 inspected items 10391 times.

== After round 3000 ==
Monkey 0 inspected items 15638 times.
Monkey 1 inspected items 14358 times.
Monkey 2 inspected items 587 times.
Monkey 3 inspected items 15593 times.

== After round 4000 ==
Monkey 0 inspected items 20858 times.
Monkey 1 inspected items 19138 times.
Monkey 2 inspected items 780 times.
Monkey 3 inspected items 20797 times.

== After round 5000 ==
Monkey 0 inspected items 26075 times.
Monkey 1 inspected items 23921 times.
Monkey 2 inspected items 974 times.
Monkey 3 inspected items 26000 times.

== After round 6000 ==
Monkey 0 inspected items 31294 times.
Monkey 1 inspected items 28702 times.
Monkey 2 inspected items 1165 times.
Monkey 3 inspected items 31204 times.

== After round 7000 ==
Monkey 0 inspected items 36508 times.
Monkey 1 inspected items 33488 times.
Monkey 2 inspected items 1360 times.
Monkey 3 inspected items 36400 times.

== After round 8000 ==
Monkey 0 inspected items 41728 times.
Monkey 1 inspected items 38268 times.
Monkey 2 inspected items 1553 times.
Monkey 3 inspected items 41606 times.

== After round 9000 ==
Monkey 0 inspected items 46945 times.
Monkey 1 inspected items 43051 times.
Monkey 2 inspected items 1746 times.
Monkey 3 inspected items 46807 times.

== After round 10000 ==
Monkey 0 inspected items 52166 times.
Monkey 1 inspected items 47830 times.
Monkey 2 inspected items 1938 times.
Monkey 3 inspected items 52013 times.
After 10000 rounds, the two most active monkeys inspected items 52166 and 52013 times. Multiplying these together, the level of monkey business in this situation is now 2713310158.

Worry levels are no longer divided by three after each item is inspected; you'll need to find another way to keep your worry levels manageable. Starting again from the initial state in your puzzle input, what is the level of monkey business after 10000 rounds?
*/
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInput(__dirname, "/input.txt").split("\n\n");
  const allMonkeys = getAllMonkeys(input);
  const allRounds = Array(10000);
  for (const round of allRounds) {
    executeRound(allMonkeys);
  }
  const monkeyBusiness = calculateMonkeyBusiness(allMonkeys);

  return monkeyBusiness;
}

function getAllMonkeys(inputArr) {
  const allMonkeys = {};
  for (const monkeyStr of inputArr) {
    let [monkeyName, startingItems, operationInfo, ...testInfo] =
      monkeyStr.split("\n");
    monkeyName = monkeyName.toLowerCase().slice(0, -1);
    const monkeyObj = {
      items: getStartingItems(startingItems),
      operation: getOperation(operationInfo),
      test: getTest(testInfo),
      inspections: 0,
    };
    allMonkeys[monkeyName] = monkeyObj;
  }
  return allMonkeys;
}

function executeRound(allMonkeys) {
  // For each monkey
  for (const startingMonkeyName in allMonkeys) {
    const { items, operation, test } = allMonkeys[startingMonkeyName];
    // For each item
    while (items.length) {
      const item = items.shift();
      // Get updated worry level
      const newWorryLevel = inspectItem(item, operation);
      allMonkeys[startingMonkeyName].inspections++;
      const monkeyToThrowTo = test(newWorryLevel);
      allMonkeys[monkeyToThrowTo].items.push(newWorryLevel);
    }
  }
}

function calculateMonkeyBusiness(allMonkeys) {
  const sortedByMonkeyBusiness = Object.values(allMonkeys).sort(
    ({ inspections: businessA }, { inspections: businessB }) =>
      businessB - businessA
  );
  const topTwo =
    sortedByMonkeyBusiness[0].inspections *
    sortedByMonkeyBusiness[1].inspections;
  return topTwo;
}

function getStartingItems(line) {
  return line
    .split("  Starting items: ")[1]
    .split(",")
    .map((x) => Number(x));
}

function getOperation(line) {
  let operationStr = line.split("  Operation: new = ")[1];
  return (old) => {
    operationStr.replace("old", old);
    return eval(operationStr);
  };
}

function getTest([testStr, trueStr, falseStr]) {
  // All tests are division
  const divisor = Number(testStr.split("  Test: divisible by ")[1]);
  const trueMonkey = trueStr.split("    If true: throw to ")[1];
  const falseMonkey = falseStr.split("    If false: throw to ")[1];
  return (n) => {
    const passedTest = n % divisor === 0;
    return passedTest ? trueMonkey : falseMonkey;
  };
}

function inspectItem(startingWorryLevel, operation) {
  let newWorryLevel = increaseWorryBy(startingWorryLevel, operation);
  newWorryLevel %= 1 * 2 * 3 * 5 * 7 * 9 * 11 * 13 * 17 * 19;
  return newWorryLevel;
}

function increaseWorryBy(worryLevel, operation) {
  return operation(worryLevel);
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

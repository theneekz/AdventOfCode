/*
--- Part Two ---
After reviewing the available paths, you realize you might have time to visit a single small cave twice. Specifically, big caves can be visited any number of times, a single small cave can be visited at most twice, and the remaining small caves can be visited at most once. However, the caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.

Now, the 36 possible paths through the first example above are:

start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end
The slightly larger example above now has 103 paths through it, and the even larger example now has 3509 paths through it.

Given these new rules, how many paths through this cave system are there?
*/
const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname);
const start = Date.now();

let caveMap = {
  start: [],
};

const makeMap = () => {
  input.forEach((line) => {
    const [caveName, connectsTo] = line.split("-");
    if (connectsTo !== "start") {
      if (caveMap[caveName]) {
        caveMap[caveName].push(connectsTo);
      } else {
        caveMap[caveName] = [connectsTo];
      }
    }
    if (connectsTo !== "end" && caveName !== "start") {
      if (caveMap[connectsTo]) {
        caveMap[connectsTo].push(caveName);
      } else {
        caveMap[connectsTo] = [caveName];
      }
    }
  });
};

makeMap();
// console.log(caveMap);

let allPaths = [];

const addToAllPaths = (arr) => {
  let arrToStr = arr.reduce((p, c) => p + "," + c, "").slice(1);
  if (allPaths.indexOf(arrToStr) < 0) {
    allPaths.push(arrToStr);
    // console.log("added:", arrToStr);
  } else {
    // console.log("found duplicate:", arrToStr);
  }
};

const passesNewRule = (currentCave, arr) => {
  const allSmallCavesSoFar = [...arr].filter((x) => x === x.toLowerCase());
  // console.log({ allSmallCavesSoFar, currentCave });
  let visited = {};
  for (const cave of allSmallCavesSoFar) {
    if (!visited[cave]) {
      visited[cave] = true;
    } else if (cave !== currentCave) {
      // console.log("fails new rule, visited '", cave, "' too many times");
      return false;
    }
  }
  // console.log("passes new rule");
  return true;
};

const makePaths = (startCave = "start", currentPath = []) => {
  // console.log("in cave:", startCave);

  const connections = caveMap[startCave];

  if (!connections) {
    // console.log("---found end---");
    // console.log({ currentPath });
    addToAllPaths([...currentPath, "end"]);
    return;
  }

  currentPath.push(startCave);
  // console.log({ currentPath });
  for (const c of connections) {
    // console.log("--in for loop for", c, "in cave:", startCave, "--");
    const isLowerCase = c === c.toLowerCase() && c !== "start" && c !== "end";
    if (isLowerCase) {
      const numberOfTimesToThisCave = currentPath.filter((x) => x === c).length;
      if (numberOfTimesToThisCave >= 2) {
        // console.log("visited small cave too many times");
        continue;
      }
      const isSecondTimeHere = numberOfTimesToThisCave === 1;
      const isValid = passesNewRule(c, [...currentPath]);
      // console.log({ isValid, numberOfTimesToThisCave, isSecondTimeHere });
      if (isSecondTimeHere && !isValid) {
        // console.log("fails new rule");
        continue;
      }
      // console.log("down the rabbit hole to a SMALL but EQUALLY NICE CAVE");
      makePaths(c, [...currentPath]);
    } else {
      // console.log("down the rabbit hole to a BIG cave");
      makePaths(c, [...currentPath]);
    }
    // console.log("--end loop for", c, "in cave:", startCave, "--");
  }
};

makePaths();

// allPaths.sort();
// console.log({ allPaths });
console.log(allPaths.length); //133360

console.log("Time:", Date.now() - start, "ms"); //92647 YIKES

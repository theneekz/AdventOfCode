/*
--- Day 12: Passage Pathing ---
With your submarine's subterranean subsystems subsisting suboptimally, the only way you're getting out of this cave anytime soon is by finding a path yourself. Not just a path - the only way to know if you've found the best path is to find all of them.

Fortunately, the sensors are still mostly working, and so you build a rough map of the remaining caves (your puzzle input). For example:

start-A
start-b
A-c
A-b
b-d
A-end
b-end
This is a list of how all of the caves are connected. You start in the cave named start, and your destination is the cave named end. An entry like b-d means that cave b is connected to cave d - that is, you can move between them.

So, the above cave system looks roughly like this:

    start
    /   \
c--A-----b--d
    \   /
     end
Your goal is to find the number of distinct paths that start at start, end at end, and don't visit small caves more than once. There are two types of caves: big caves (written in uppercase, like A) and small caves (written in lowercase, like b). It would be a waste of time to visit any small cave more than once, but big caves are large enough that it might be worth visiting them multiple times. So, all paths you find should visit small caves at most once, and can visit big caves any number of times.

Given these rules, there are 10 paths through this example cave system:

start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end
(Each line in the above list corresponds to a single path; the caves visited by that path are listed in the order they are visited and separated by commas.)

Note that in this cave system, cave d is never visited by any path: to do so, cave b would need to be visited twice (once on the way to cave d and a second time when returning from cave d), and since cave b is small, this is not allowed.

Here is a slightly larger example:

dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
The 19 paths through it are as follows:

start,HN,dc,HN,end
start,HN,dc,HN,kj,HN,end
start,HN,dc,end
start,HN,dc,kj,HN,end
start,HN,end
start,HN,kj,HN,dc,HN,end
start,HN,kj,HN,dc,end
start,HN,kj,HN,end
start,HN,kj,dc,HN,end
start,HN,kj,dc,end
start,dc,HN,end
start,dc,HN,kj,HN,end
start,dc,end
start,dc,kj,HN,end
start,kj,HN,dc,HN,end
start,kj,HN,dc,end
start,kj,HN,end
start,kj,dc,HN,end
start,kj,dc,end
Finally, this even larger example has 226 paths through it:

fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
How many paths through this cave system are there that visit small caves at most once?
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
    if (caveMap[caveName]) {
      caveMap[caveName].push(connectsTo);
    } else {
      caveMap[caveName] = [connectsTo];
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
  }
};

//loop through start array of caves
//check that each cave connects to something else
//check that, if cave is lowercase, it does not only connect to a lowercase cave that was already visited
//if array contains 'end' push to allPaths

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
    const isLowerCaseHasVisited =
      currentPath.includes(c) && c === c.toLowerCase();
    if (!isLowerCaseHasVisited) {
      // console.log("down the rabbit hole");
      makePaths(c, [...currentPath]);
    }
    // console.log("--end loop for", c, "in cave:", startCave, "--");
  }
};

makePaths();

// console.log({ allPaths });
console.log(allPaths.length); //4792

console.log("Time:", Date.now() - start, "ms"); //118

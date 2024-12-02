/*
--- Day 16: Proboscidea Volcanium ---
The sensors have led you to the origin of the distress signal: yet another handheld device, just like the one the Elves gave you. However, you don't see any Elves around; instead, the device is surrounded by elephants! They must have gotten lost in these tunnels, and one of the elephants apparently figured out how to turn on the distress signal.

The ground rumbles again, much stronger this time. What kind of cave is this, exactly? You scan the cave with your handheld device; it reports mostly igneous rock, some ash, pockets of pressurized gas, magma... this isn't just a cave, it's a volcano!

You need to get the elephants out of here, quickly. Your device estimates that you have 30 minutes before the volcano erupts, so you don't have time to go back out the way you came in.

You scan the cave for other options and discover a network of pipes and pressure-release valves. You aren't sure how such a system got into a volcano, but you don't have time to complain; your device produces a report (your puzzle input) of each valve's flow rate if it were opened (in pressure per minute) and the tunnels you could use to move between the valves.

There's even a valve in the room you and the elephants are currently standing in labeled AA. You estimate it will take you one minute to open a single valve and one minute to follow any tunnel from one valve to another. What is the most pressure you could release?

For example, suppose you had the following scan output:

Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
All of the valves begin closed. You start at valve AA, but it must be damaged or jammed or something: its flow rate is 0, so there's no point in opening it. However, you could spend one minute moving to valve BB and another minute opening it; doing so would release pressure during the remaining 28 minutes at a flow rate of 13, a total eventual pressure release of 28 * 13 = 364. Then, you could spend your third minute moving to valve CC and your fourth minute opening it, providing an additional 26 minutes of eventual pressure release at a flow rate of 2, or 52 total pressure released by valve CC.

Making your way through the tunnels like this, you could probably open many or all of the valves by the time 30 minutes have elapsed. However, you need to release as much pressure as possible, so you'll need to be methodical. Instead, consider this approach:

== Minute 1 ==
No valves are open.
You move to valve DD.

== Minute 2 ==
No valves are open.
You open valve DD.

== Minute 3 ==
Valve DD is open, releasing 20 pressure.
You move to valve CC.

== Minute 4 ==
Valve DD is open, releasing 20 pressure.
You move to valve BB.

== Minute 5 ==
Valve DD is open, releasing 20 pressure.
You open valve BB.

== Minute 6 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve AA.

== Minute 7 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve II.

== Minute 8 ==
Valves BB and DD are open, releasing 33 pressure.
You move to valve JJ.

== Minute 9 ==
Valves BB and DD are open, releasing 33 pressure.
You open valve JJ.

== Minute 10 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve II.

== Minute 11 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve AA.

== Minute 12 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve DD.

== Minute 13 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve EE.

== Minute 14 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve FF.

== Minute 15 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve GG.

== Minute 16 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You move to valve HH.

== Minute 17 ==
Valves BB, DD, and JJ are open, releasing 54 pressure.
You open valve HH.

== Minute 18 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve GG.

== Minute 19 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve FF.

== Minute 20 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You move to valve EE.

== Minute 21 ==
Valves BB, DD, HH, and JJ are open, releasing 76 pressure.
You open valve EE.

== Minute 22 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You move to valve DD.

== Minute 23 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You move to valve CC.

== Minute 24 ==
Valves BB, DD, EE, HH, and JJ are open, releasing 79 pressure.
You open valve CC.

== Minute 25 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 26 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 27 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 28 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 29 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.

== Minute 30 ==
Valves BB, CC, DD, EE, HH, and JJ are open, releasing 81 pressure.
This approach lets you release the most pressure possible in 30 minutes with this valve layout, 1651.

Work out the steps to release the most pressure in 30 minutes. What is the most pressure you can release?
*/
const { getInputArray } = require("../../utils");
const start = Date.now();
let DEBUG = 1;

class Volcano {
  currentRoom;
  openValves = [];
  pressureLoss = 0;

  makeRoomMap(txtInputArray) {
    const regex =
      /(?<=Valve )[A-Za-z]{2}|(?<=rate=)\d+|(?<=[valves ])[A-Z]+|(?<=, )[A-Z]+/g;
    const map = {};
    txtInputArray.forEach((line, index) => {
      const [name, rate, ...pipes] = line.match(regex);
      const newValveRoom = new ValveRoom({ name, rate, pipes });
      map[name] = newValveRoom;
      if (index === 0) this.currentRoom = newValveRoom;
    });
    return map;
  }

  constructor({ input, totalTime }) {
    this.roomMap = this.makeRoomMap(input);
    this.totalTimeLeft = totalTime;
  }

  move(nextValve) {
    if (!this.currentRoom.hasPipeTo(nextValve)) {
      throw new Error(
        `Can't move to ${nextValue} from ${this.currentRoom.name}`
      );
    }
    this.currentRoom = this.roomMap[nextValve];
    this.tick();
    console.log(`You move to valve ${nextValve}.\n`);
  }

  openCurrent() {
    if (this.currentRoom.isOpen) {
      throw new Error(`${this.currentRoom.name} is already open`);
    }
    // Takes a minute to open, tick first
    this.tick();
    this.currentRoom.open();
    this.openValves.push(this.currentRoom);
    console.log(`You open valve ${nextValve}.\n`);
  }

  tick() {
    this.totalTimeLeft--;
    for (const valveRoom of this.openValves) {
      this.pressureLoss += valveRoom.rate;
    }
    this.logActivity();
    if (this.totalTimeLeft === -1) {
      throw new Error("Ticked too far");
    }
  }

  logActivity() {
    console.log(`\n== Minute ${Math.abs(this.totalTimeLeft - 30)}==`);
    if (!this.openValves.length) {
      console.log("No valves are open.");
    } else {
      const isPlural = this.openValves.length > 1;
      console.log(
        `Valve${isPlural ? "s" : ""} ${
          isPlural ? this.openValves.join(", ") + "are" : "is"
        } open, releasing ${sum(openValves.map((v) => cave[v].rate))} pressure.`
      );
    }

    this.currentRoom.getPipesPotential(this.roomMap, this.totalTimeLeft);
  }

  dfs(start) {
    // mark starting room as visited
    // check if any of it's pipes are unvisited
    // if not, updated the room's rate (potential?)
  }
}

class ValveRoom {
  constructor({ name, rate, pipes }) {
    this.name = name;
    this.rate = Number(rate);
    this.isOpen = false;
    this.pipes = pipes;
    this.visited = false;
  }

  open() {
    this.isOpen = true;
  }

  getPressurePotential(timeLeft) {
    return Math.max(timeLeft, 0) * this.rate;
  }

  hasPipeTo(valveName) {
    return pipes.includes(valveName);
  }

  getPipesPotential(roomMap, timeLeft) {
    let totals = {};
    for (const pipe of this.pipes) {
      totals[pipe] = !roomMap[pipe].isOpen
        ? roomMap[pipe].getPressurePotential(timeLeft - 2) // Takes 2 min to move and turn on
        : 0;
    }
    console.log(totals);
  }
}

function main2() {
  const input = getInputArray(__dirname, "/test1.txt");
  const volcano = new Volcano({ input, totalTime: 30 });

  while (volcano.totalTimeLeft !== 0) {
    volcano.tick();
  }
  console.log("done");
}

function main() {
  const input = getInputArray(__dirname, "/test1.txt");
  const cave = convertInput(input);
  const trix = makeOpportunityMatrix(cave);
  let pressure = 0;
  let current = "AA";
  let openValves = [];
  for (let min = 30; min > 0; min--) {
    if (DEBUG) logActivity({ min, openValves, cave });
    const { isOpen, rate, tunnels } = cave[current];
    if (!isOpen) {
      let best = findBestTunnel([current, ...tunnels], cave);
      if (best == current) {
        cave[current].isOpen = true;
        pressure += rate * min;
        openValves.push(current);
        if (DEBUG) console.log(`You open valve ${current}.`);
      } else {
        current = best;
        if (DEBUG) console.log(`You move to valve ${current}.`);
      }
    } else {
      current = findBestTunnel(tunnels, cave);
      if (DEBUG) console.log(`You move to valve ${current}.`);
    }
  }
  return pressure;
}

function convertInput(inputArr) {
  const regex =
    /(?<=Valve )[A-Za-z]{2}|(?<=rate=)\d+|(?<=[valves ])[A-Z]+|(?<=, )[A-Z]+/g;
  const results = {};
  inputArr.forEach((line) => {
    const [valve, rate, ...tunnels] = line.match(regex);
    results[valve] = { rate: Number(rate), tunnels, isOpen: false };
  });
  return results;
}

function findBestTunnel(tunnels, cave) {
  let max = null;
  tunnels.forEach((tunnelName) => {
    const { isOpen, rate } = cave[tunnelName];
    // console.log({ tunnelName, isOpen, rate });
    if (isOpen) return; // continue
    if (!max || rate > cave[max].rate) max = tunnelName;
  });
  if (!max) throw new Error("findBestTunnel error");
  return max;
}

function logActivity({ min, openValves, cave }) {
  console.log(`\n== Minute ${Math.abs(min - 30) + 1}==`);
  if (!openValves.length) {
    console.log("No valves are open.");
  } else {
    console.log(
      `Valves ${openValves.join(", ")} are open, releasing ${sum(
        openValves.map((v) => cave[v].rate)
      )}`
    );
  }
}

function sum(items) {
  return items.reduce((c, a) => c + a, 0);
}

function makeOpportunityMatrix(cave) {
  console.log(cave);
  let matrix = {};
  // For each node
  for (const start in cave) {
    // Find the opportunity (sum of valve pressure) for every other node
    matrix[start] = {};
    for (const tunnel of cave[start].tunnels) {
      matrix[start][tunnel] = cave[start].rate + cave[tunnel].rate;
    }
  }
  console.log(matrix);
  return;
}

console.log(main2());

console.log("Time", Date.now() - start, "ms");

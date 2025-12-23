/*
--- Day 8: Playground ---
Equipped with a new understanding of teleporter maintenance, you confidently step onto the repaired teleporter pad.

You rematerialize on an unfamiliar teleporter pad and find yourself in a vast underground space which contains a giant playground!

Across the playground, a group of Elves are working on setting up an ambitious Christmas decoration project. Through careful rigging, they have suspended a large number of small electrical junction boxes.

Their plan is to connect the junction boxes with long strings of lights. Most of the junction boxes don't provide electricity; however, when two junction boxes are connected by a string of lights, electricity can pass between those two junction boxes.

The Elves are trying to figure out which junction boxes to connect so that electricity can reach every junction box. They even have a list of all of the junction boxes' positions in 3D space (your puzzle input).

For example:

162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
This list describes the position of 20 junction boxes, one per line. Each position is given as X,Y,Z coordinates. So, the first junction box in the list is at X=162, Y=817, Z=812.

To save on string lights, the Elves would like to focus on connecting pairs of junction boxes that are as close together as possible according to straight-line distance. In this example, the two junction boxes which are closest together are 162,817,812 and 425,690,689.

By connecting these two junction boxes together, because electricity can flow between them, they become part of the same circuit. After connecting them, there is a single circuit which contains two junction boxes, and the remaining 18 junction boxes remain in their own individual circuits.

Now, the two junction boxes which are closest together but aren't already directly connected are 162,817,812 and 431,825,988. After connecting them, since 162,817,812 is already connected to another junction box, there is now a single circuit which contains three junction boxes and an additional 17 circuits which contain one junction box each.

The next two junction boxes to connect are 906,360,560 and 805,96,715. After connecting them, there is a circuit containing 3 junction boxes, a circuit containing 2 junction boxes, and 15 circuits which contain one junction box each.

The next two junction boxes are 431,825,988 and 425,690,689. Because these two junction boxes were already in the same circuit, nothing happens!

This process continues for a while, and the Elves are concerned that they don't have enough extension cables for all these circuits. They would like to know how big the circuits will be.

After making the ten shortest connections, there are 11 circuits: one circuit which contains 5 junction boxes, one circuit which contains 4 junction boxes, two circuits which contain 2 junction boxes each, and seven circuits which each contain a single junction box. Multiplying together the sizes of the three largest circuits (5, 4, and one of the circuits of size 2) produces 40.

Your list contains many junction boxes; connect together the 1000 pairs of junction boxes which are closest together. Afterward, what do you get if you multiply together the sizes of the three largest circuits?

Your puzzle answer was 122430.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();
const TEST = false;
const CONNECTIONS_TO_MAKE = TEST ? 10 : 1000;

function main() {
  const input = getInputArray(
    __dirname,
    TEST ? "/test1.txt" : "/input.txt"
  ).map((l) => l.split(",").map(Number));

  // Compute all edges
  const edges = [];
  for (let i = 0; i < input.length; i++) {
    const [xi, yi, zi] = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const [xj, yj, zj] = input[j];
      // 30ms faster than Math.hypot
      const d = (xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2;
      edges.push({ i, j, d });
    }
  }
  edges.sort((a, b) => a.d - b.d);

  // Each index is the junction box and the value is the parent connection
  let circuits = new Array(input.length).fill(0).map((_, i) => i);

  // A more complete count of the above. Use this to track sizes instead of the
  // above, so that all child jboxes don't need to be updated on every connection
  let circuitSizes = new Array(input.length).fill(1);

  // Gets the head jbox for a circuit & updates if necessary
  const find = (x) => {
    // Is it's own only connection or the 'head' jbox
    if (circuits[x] == x) {
      return x;
    }
    // Update to the 'head' jbox if necessary
    circuits[x] = find(circuits[x]);
    return circuits[x];
  };

  // Connects two jboxes & updates the circuit size changes
  const connect = (a, b) => {
    a = find(a);
    b = find(b);
    if (a === b) return;
    if (circuitSizes[a] < circuitSizes[b]) {
      [a, b] = [b, a];
    }
    circuits[b] = a;
    // Bigger circuit consumes the smaller
    circuitSizes[a] += circuitSizes[b];
    // Smaller circuit will no longer be used, just for posterity
    circuitSizes[b] = 0;
  };

  for (let i = 0; i < CONNECTIONS_TO_MAKE; i++) {
    connect(edges[i].i, edges[i].j);
  }

  circuitSizes.sort((a, b) => b - a);
  return circuitSizes[0] * circuitSizes[1] * circuitSizes[2];
}

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 405ms

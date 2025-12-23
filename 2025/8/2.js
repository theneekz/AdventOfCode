/*
--- Part Two ---
The Elves were right; they definitely don't have enough extension cables. You'll need to keep connecting junction boxes together until they're all in one large circuit.

Continuing the above example, the first connection which causes all of the junction boxes to form a single circuit is between the junction boxes at 216,146,977 and 117,168,530. The Elves need to know how far those junction boxes are from the wall so they can pick the right extension cable; multiplying the X coordinates of those two junction boxes (216 and 117) produces 25272.

Continue connecting the closest unconnected pairs of junction boxes together until they're all in the same circuit. What do you get if you multiply together the X coordinates of the last two junction boxes you need to connect?

Your puzzle answer was 8135565324.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();
const TEST = false;

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
      // 30ms faster than Math.hypot (doesn't seem to need the Math.sqrt)
      const d = (xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2;
      edges.push({ i, j, d });
    }
  }
  edges.sort((a, b) => a.d - b.d);

  // Each index is the junction box and the value is the parent connection index
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
    circuitSizes[b] = 0;
  };

  let i = 0;
  let lastEdge = {};

  while (circuitSizes.filter((x) => x !== 0).length > 1) {
    connect(edges[i].i, edges[i].j);
    lastEdge = edges[i];
    i++;
  }

  return input[lastEdge.i][0] * input[lastEdge.j][0];
}

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 479ms

// union-find / disjoint set solution

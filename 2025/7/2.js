/*
--- Part Two ---
With your analysis of the manifold complete, you begin fixing the teleporter. However, as you open the side of the teleporter to replace the broken manifold, you are surprised to discover that it isn't a classical tachyon manifold - it's a quantum tachyon manifold.

With a quantum tachyon manifold, only a single tachyon particle is sent through the manifold. A tachyon particle takes both the left and right path of each splitter encountered.

Since this is impossible, the manual recommends the many-worlds interpretation of quantum tachyon splitting: each time a particle reaches a splitter, it's actually time itself which splits. In one timeline, the particle went left, and in the other timeline, the particle went right.

To fix the manifold, what you really need to know is the number of timelines active after a single particle completes all of its possible journeys through the manifold.

In the above example, there are many timelines. For instance, there's the timeline where the particle always went left:

.......S.......
.......|.......
......|^.......
......|........
.....|^.^......
.....|.........
....|^.^.^.....
....|..........
...|^.^...^....
...|...........
..|^.^...^.^...
..|............
.|^...^.....^..
.|.............
|^.^.^.^.^...^.
|..............
Or, there's the timeline where the particle alternated going left and right at each splitter:

.......S.......
.......|.......
......|^.......
......|........
......^|^......
.......|.......
.....^|^.^.....
......|........
....^.^|..^....
.......|.......
...^.^.|.^.^...
.......|.......
..^...^|....^..
.......|.......
.^.^.^|^.^...^.
......|........
Or, there's the timeline where the particle ends up at the same point as the alternating timeline, but takes a totally different path to get there:

.......S.......
.......|.......
......|^.......
......|........
.....|^.^......
.....|.........
....|^.^.^.....
....|..........
....^|^...^....
.....|.........
...^.^|..^.^...
......|........
..^..|^.....^..
.....|.........
.^.^.^|^.^...^.
......|........
In this example, in total, the particle ends up on 40 different timelines.

Apply the many-worlds interpretation of quantum tachyon splitting to your manifold diagram. In total, how many different timelines would a single tachyon particle end up on?

Your puzzle answer was 25489586715621.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt");

  const startIndex = input[0].indexOf("S");
  let beams = [startIndex];
  let timelines = Array.from({ length: input[0].length }).fill(0);
  timelines[startIndex]++;

  for (let row = 1; row < input.length; row++) {
    let nextBeams = [];
    let splitters = input[row]
      .split("")
      .map((c, i) => (c === "^" ? i : -1))
      .filter((x) => x > -1);

    if (!splitters.length) {
      continue;
    }
    for (const beam of beams) {
      if (splitters.includes(beam)) {
        timelines[beam - 1] += timelines[beam];
        timelines[beam + 1] += timelines[beam];
        timelines[beam] = 0;
        beams = beams.filter((x) => x !== beam);
        if (!nextBeams.includes(beam - 1)) {
          nextBeams.push(beam - 1);
        }
        if (!nextBeams.includes(beam + 1)) {
          nextBeams.push(beam + 1);
        }
      } else {
        nextBeams.push(beam);
      }
    }
    for (const beam of nextBeams) {
      if (!beams.includes(beam)) {
        beams.push(beam);
      }
    }
  }
  return timelines.reduce((p, c) => p + c);
}

/*

.......S....... 1 
.......|....... 1
......|^|...... 2
......|.|...... 2
.....|^|^|..... 4
.....|.|.|..... 4
....|^|^|^|.... 8
....|.|.|.|.... 8
...|^|^|||^|... 10
...|.|.|||.|... 10
..|^|^|||^|^|.. 20
..|.|.|||.|.|.. 20
.|^|||^||.||^|. 26
.|.|||.||.||.|. 26
|^|^|^|^|^|||^| 40
|.|.|.|.|.|||.| 40

.......S....... 
.......1....... 1
......1^1...... 2
......1.1...... 2
.....1^2^1..... 4
.....1.2.1..... 4
....1^3^3^1.... 8
....1.3.3.1.... 8
...1^4^331^1... 10
...1.4.331.1... 10
..1^5^434^2^1.. 20
..1.5.434.2.1.. 20
.1^154^74.21^1. 26
.1.154.74.21.1. 26
|^|^|^|^|^|||^| 
|.|.|.|.|.|||.| 
1 2 10 11 11 2 1 1 1 = 40
*/

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 6ms

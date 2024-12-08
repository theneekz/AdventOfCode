/*
--- Part Two ---
While The Historians begin working around the guard's patrol route, you borrow their fancy device and step outside the lab. From the safety of a supply closet, you time travel through the last few months and record the nightly status of the lab's guard post on the walls of the closet.

Returning after what seems like only a few seconds to The Historians, they explain that the guard's patrol area is simply too large for them to safely search the lab without getting caught.

Fortunately, they are pretty sure that adding a single new obstruction won't cause a time paradox. They'd like to place the new obstruction in such a way that the guard will get stuck in a loop, making the rest of the lab safe to search.

To have the lowest chance of creating a time paradox, The Historians would like to know all of the possible positions for such an obstruction. The new obstruction can't be placed at the guard's starting position - the guard is there right now and would notice.

In the above example, there are only 6 different positions where a new obstruction would cause the guard to get stuck in a loop. The diagrams of these six situations use O to mark the new obstruction, | to show a position where the guard moves up/down, - to show a position where the guard moves left/right, and + to show a position where the guard moves both up/down and left/right.

Option one, put a printing press next to the guard's starting position:

....#.....
....+---+#
....|...|.
..#.|...|.
....|..#|.
....|...|.
.#.O^---+.
........#.
#.........
......#...
Option two, put a stack of failed suit prototypes in the bottom right quadrant of the mapped area:


....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
......O.#.
#.........
......#...
Option three, put a crate of chimney-squeeze prototype fabric next to the standing desk in the bottom right quadrant:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----+O#.
#+----+...
......#...
Option four, put an alchemical retroencabulator near the bottom left corner:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
..|...|.#.
#O+---+...
......#...
Option five, put the alchemical retroencabulator a bit to the right instead:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
....|.|.#.
#..O+-+...
......#...
Option six, put a tank of sovereign glue right next to the tank of universal solvent:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----++#.
#+----++..
......#O..
It doesn't really matter what you choose to use as an obstacle so long as you and The Historians can put it into position without the guard noticing. The important thing is having enough options that you can find one that minimizes time paradoxes, and in this example, there are 6 different positions you could choose.

You need to get the guard stuck in a loop by adding a single new obstruction. How many different positions could you choose for this obstruction?

Your puzzle answer was 2143.

28030 ms!? Need to optimize
*/
const { getInputArray, print, deepClone, arrayEquals } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((x) => x.split(""));
  const obstacleCoordCandidates = simulate(deepClone(input), true);
  let loops = 0;
  const start = findGuard("^", input);
  for (const [y, x] of obstacleCoordCandidates) {
    // Can't replace starting spot with obstacle
    if (arrayEquals([y, x], start)) continue;

    const newMap = deepClone(input);
    newMap[y][x] = "O";
    // visited for for debugging
    const [isLoop, visited] = simulate(newMap);
    loops += isLoop;

    // for debugging
    // if (isLoop) {
    //   printMap(visited, newMap);
    // }
  }
  return loops;
}

// Get position of guard
const findGuard = (guard, input) => {
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === guard) {
        return [row, col];
      }
    }
  }
};

const simulate = (input, getCandidates) => {
  let guard = "^";
  let currentCoord = findGuard(guard, input);

  // Object of keys of coordinates and values of arrays with guard's position
  // when visting those coords. A coord visited in the same position is a loop.
  // A candidate for a new obstacle is every coord the guard visited.
  const visited = {};

  while (true) {
    const [oldY, oldX] = currentCoord;
    // For checking the next position
    const getNext = {
      "^": {
        nextGuardOrientation: ">",
        nextCoord: [oldY - 1, oldX],
      },
      ">": {
        nextGuardOrientation: "v",
        nextCoord: [oldY, oldX + 1],
      },
      v: {
        nextGuardOrientation: "<",
        nextCoord: [oldY + 1, oldX],
      },
      "<": {
        nextGuardOrientation: "^",
        nextCoord: [oldY, oldX - 1],
      },
    };
    const { nextCoord, nextGuardOrientation } = getNext[guard];
    const [newY, newX] = nextCoord;

    // If out of bounds, game over
    if (
      newY < 0 ||
      newY >= input.length ||
      newX < 0 ||
      newX >= input[0].length
    ) {
      // Add the final spot
      visited[currentCoord]?.push(guard) || (visited[currentCoord] = [guard]);

      // If running for the first time, just want the obstacle coord candidates
      if (getCandidates) {
        return Object.keys(visited).map((c) => c.split(",").map(Number));
      }
      // Otherwise this simulation does not cause a loop
      return [0, visited];
    }

    // If obstacle, turn
    if (["#", "O"].includes(input[newY][newX])) {
      guard = nextGuardOrientation;
    } else {
      // If guard was here before in the same orientation, they are in a loop!
      if (visited[currentCoord]?.includes(guard)) {
        return [1, visited];
      }
      // Else, mark spot as visited
      visited[currentCoord]?.push(guard) || (visited[currentCoord] = [guard]);
      // Step forward
      input[newY][newX] = nextGuardOrientation;
      currentCoord = [newY, newX];
    }
  }
};

// for debugging

// const printMap = (visited, newMap) => {
//   for (const coordStr in visited) {
//     const arrowArr = visited[coordStr];
//     const v = ["v", "^"];
//     const h = ["<", ">"];
//     let replacementChar;
//     let hasV;
//     let hasH;
//     for (const char of arrowArr) {
//       hasV || (hasV = v.includes(char));
//       hasH || (hasH = h.includes(char));
//     }
//     if (hasV && hasH) {
//       replacementChar = "+";
//     } else {
//       hasV ? (replacementChar = "|") : (replacementChar = "-");
//     }
//     const [y, x] = coordStr.split(",");
//     newMap[y][x] = replacementChar;
//   }
//   print(newMap, 0, true);
// };

console.log(main());

console.log("Time", Date.now() - start, "ms");

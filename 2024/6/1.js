/*
--- Day 6: Guard Gallivant ---
The Historians use their fancy device again, this time to whisk you all away to the North Pole prototype suit manufacturing lab... in the year 1518! It turns out that having direct access to history is very convenient for a group of historians.

You still have to be careful of time paradoxes, and so it will be important to avoid anyone from 1518 while The Historians search for the Chief. Unfortunately, a single guard is patrolling this part of the lab.

Maybe you can work out where the guard will go ahead of time so that The Historians can search safely?

You start by making a map (your puzzle input) of the situation. For example:

....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
The map shows the current position of the guard with ^ (to indicate the guard is currently facing up from the perspective of the map). Any obstructions - crates, desks, alchemical reactors, etc. - are shown as #.

Lab guards in 1518 follow a very strict patrol protocol which involves repeatedly following these steps:

If there is something directly in front of you, turn right 90 degrees.
Otherwise, take a step forward.
Following the above protocol, the guard moves up several times until she reaches an obstacle (in this case, a pile of failed suit prototypes):

....#.....
....^....#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...
Because there is now an obstacle in front of the guard, she turns right before continuing straight in her new facing direction:

....#.....
........>#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...
Reaching another obstacle (a spool of several very long polymers), she turns right again and continues downward:

....#.....
.........#
..........
..#.......
.......#..
..........
.#......v.
........#.
#.........
......#...
This process continues for a while, but the guard eventually leaves the mapped area (after walking past a tank of universal solvent):

....#.....
.........#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#v..
By predicting the guard's route, you can determine which specific positions in the lab will be in the patrol path. Including the guard's starting position, the positions visited by the guard before leaving the area are marked with an X:

....#.....
....XXXXX#
....X...X.
..#.X...X.
..XXXXX#X.
..X.X.X.X.
.#XXXXXXX.
.XXXXXXX#.
#XXXXXXX..
......#X..
In this example, the guard will visit 41 distinct positions on your map.

Predict the path of the guard. How many distinct positions will the guard visit before leaving the mapped area?

Your puzzle answer was 5305.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt").map((x) => x.split(""));
  let guard = "^";
  // Get position of guard
  const findGuard = () => {
    for (let row = 0; row < input.length; row++) {
      for (let col = 0; col < input[row].length; col++) {
        if (input[row][col] === guard) {
          return [row, col];
        }
      }
    }
  };
  let currentCoord = findGuard();

  while (true) {
    const [oldY, oldX] = currentCoord;
    // Check next position
    const findNextCoord = {
      "^": {
        next: ">",
        move: [oldY - 1, oldX],
      },
      ">": {
        next: "v",
        move: [oldY, oldX + 1],
      },
      v: {
        next: "<",
        move: [oldY + 1, oldX],
      },
      "<": {
        next: "^",
        move: [oldY, oldX - 1],
      },
    };
    const { move: nextCoord, next: newGuardOrientation } = findNextCoord[guard];
    const [newY, newX] = nextCoord;

    // If out of bounds, game over
    if (
      newY < 0 ||
      newY >= input.length ||
      newX < 0 ||
      newX >= input[0].length
    ) {
      break;
    }

    // If obstacle, turn
    if (input[newY][newX] === "#") {
      guard = newGuardOrientation;
    } else {
      // Else, mark old spot with X
      input[oldY][oldX] = "X";
      // Step forward
      input[newY][newX] = newGuardOrientation;
      // Update current position
      currentCoord = [newY, newX];
    }
  }
  // Count all "X"s + 1 for the final spot
  return input.flat(1).filter((x) => x === "X").length + 1;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

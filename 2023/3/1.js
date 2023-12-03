/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

Your puzzle answer was 535351.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  let input = getInputArray(__dirname);
  input = input.map((line) => line.split(""));

  let result = 0;

  for (let y = 0; y < input.length; y++) {
    const line = input[y];

    for (let start = 0; start < line.length; start++) {
      let char = line[start];

      if (!isNum(char)) continue;

      let fullNumber = char;
      let end = start + 1;

      while (isNum(line[end])) {
        fullNumber += line[end];
        end++;
      }

      const left = start > 0 ? start - 1 : 0;
      const right = end === line.length - 1 ? line.length - 1 : end + 1;

      if (y > 0) {
        // Check up
        const lineAbove = input[y - 1];
        const adjacentAbove = lineAbove.slice(left, right);
        if (hasSymbol(adjacentAbove)) {
          result += Number(fullNumber);
        }
      }

      if (y < input.length - 1) {
        // Check down
        const lineBelow = input[y + 1];
        const adjacentBelow = lineBelow.slice(left, right);
        if (hasSymbol(adjacentBelow)) {
          result += Number(fullNumber);
        }
      }

      if (start > 0) {
        // Check left
        const charLeft = line[start - 1];
        if (isSymbol(charLeft)) {
          result += Number(fullNumber);
        }
      }

      if (end < line.length) {
        // Check right
        const charRight = line[end];
        if (isSymbol(charRight)) {
          result += Number(fullNumber);
        }
      }
      start = end;
    }
  }
  return result;
}

const isNum = (n) => /[0-9]/g.test(n);
const isSymbol = (n) => /[^0-9.]/g.test(n);
const hasSymbol = (a) => a.filter(isSymbol).length > 0;

console.log(main());

console.log("Time", Date.now() - start, "ms");

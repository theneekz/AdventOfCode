const { getInputArray } = require("../../../utils");
const { getCave } = require("../1");

const test1Input = getInputArray("../", "test1.txt");

const test1CaveAt = {
  0: `......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
........#.
#########.
`,
  5: `......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
......o.#.
....oooo#.
#########.
`,
  22: `......+...
..........
......o...
.....ooo..
....#ooo##
....#ooo#.
..###ooo#.
....oooo#.
...ooooo#.
#########.
`,
};

describe("getCave", () => {
  const logSpy = jest.spyOn(global.console, "log");
  const cave = getCave(test1Input);
  test("builds cave correctly", () => {
    cave.printCave();
    expect(logSpy).toHaveBeenCalledWith(test1CaveAt[0]);
  });
});

describe("drop sand", () => {
  const logSpy = jest.spyOn(global.console, "log");
  test("is correct after 5 drops", () => {
    const cave = getCave(test1Input);
    for (let i = 0; i < 5; i++) {
      cave.dropSand();
    }
    cave.printCave();
    expect(logSpy.mock.calls[1][0]).toEqual(test1CaveAt[5]);
  });
  test("is correct after 22 drops", () => {
    const cave = getCave(test1Input);
    for (let i = 0; i < 22; i++) {
      cave.dropSand();
    }
    cave.printCave();
    expect(logSpy.mock.calls[2][0]).toEqual(test1CaveAt[22]);
  });
});

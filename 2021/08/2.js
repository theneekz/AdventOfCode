/*
--- Part Two ---
Through a little deduction, you should now be able to determine the remaining digits. Consider again the first example above:

acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |
cdfeb fcadb cdfeb cdbaf
After some careful analysis, the mapping between signal wires and segments only make sense in the following configuration:

 dddd
e    a
e    a
 ffff
g    b
g    b
 cccc
So, the unique signal patterns would correspond to the following digits:

acedgfb: 8
cdfbe: 5
gcdfa: 2
fbcad: 3
dab: 7
cefabd: 9
cdfgeb: 6
eafb: 4
cagedb: 0
ab: 1
Then, the four digits of the output value can be decoded:

cdfeb: 5
fcadb: 3
cdfeb: 5
cdbaf: 3
Therefore, the output value for this entry is 5353.

Following this same process for each entry in the second, larger example above, the output value of each entry can be determined:

fdgacbe cefdb cefbgd gcbe: 8394
fcgedb cgb dgebacf gc: 9781
cg cg fdcagb cbg: 1197
efabcd cedba gadfec cb: 9361
gecf egdcabf bgf bfgea: 4873
gebdcfa ecba ca fadegcb: 8418
cefg dcbef fcge gbcadfe: 4548
ed bcgafe cdgba cbgef: 1625
gbdfcae bgc cg cgb: 8717
fgae cfgab fg bagce: 4315
Adding all of the output values in this larger example produces 61229.

For each entry, determine all of the wire/segment connections and decode the four-digit output values. What do you get if you add up all of the output values?
*/

const { getInput } = require("../../utils");
const inputLines = getInput(__dirname, "/input.txt");
const lines = inputLines.split("\n");

const uniques = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

let runningTotal = 0;

for (line of lines) {
  let [input, output] = line.split(" | ");

  //sort each signal alphabetically
  input = input.split(" ").map((word) => word.split("").sort().join(""));
  output = output.split(" ").map((word) => word.split("").sort().join(""));

  //will hold known signals for digit
  let signalMap = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
  };

  //find all with unique length: 1, 4, 7 and 8
  input.forEach((signal) => {
    if (uniques[signal.length]) {
      const digit = uniques[signal.length];
      signalMap[digit] = signal;
    }
  });

  // 0, 6, or 9 all length of six
  input.forEach((signal) => {
    if (signal.length === 6) {
      // if number does not contain both chars in 1
      if (
        signalMap[1].split("").filter((char) => !signal.includes(char)).length >
        0
      ) {
        signalMap[6] = signal;
      }
      //if number contains all chars in 4
      else if (
        signalMap[4].split("").filter((char) => signal.includes(char))
          .length === 4
      ) {
        signalMap[9] = signal;
      }
    }
  });

  //only leaves 0 at length 6
  input.forEach((signal) => {
    const isNot6or9 = signal !== signalMap[6] && signal !== signalMap[9];
    if (signal.length === 6 && isNot6or9) {
      signalMap[0] = signal;
    }
    // 2, 3, 5 all have length of five
    else if (signal.length === 5) {
      // if number contains all chars in 1
      if (
        signalMap[1].split("").filter((char) => signal.includes(char))
          .length === 2
      ) {
        signalMap[3] = signal;
      }
      // if 6 contains all chars in number
      else if (
        signal.split("").filter((char) => signalMap[6].includes(char))
          .length === 5
      ) {
        signalMap[5] = signal;
      }
    }
  });

  //  if all other numbers are found
  //    -> 2

  const entries = Object.entries(signalMap);
  const total = output.reduce((prev, curr) => {
    let digit = "2";
    entries.forEach(([key, val]) => {
      if (val === curr) {
        digit = key;
      }
    });

    return prev + digit;
  }, "");

  runningTotal += parseInt(total, 10);
}
console.log(runningTotal);

//possible optimization - convert to binary like decimal and subtract to find letters in common

//0: abc_efg: 1110111 (length: 6)
//1: __c__f_: 0010010 (length: 2)*
//2: a_cde_g: 1011101 (length: 5)
//3: a_cd_fg: 1011011 (length: 5)
//4: _bcd_f_: 0111010 (length: 4)*
//5: ab_d_fg: 1101011 (length: 5)
//6: ab_defg: 1101111 (length: 6)
//7: a_c__f_: 1010010 (length: 3)*
//8: abcdefg: 1111111 (length: 7)*
//9: abcd_fg: 1111011 (length: 6)

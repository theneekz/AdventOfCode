/*
--- Part Two ---
The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?
*/
const { getInputArray } = require("../../utils");
const input = getInputArray(__dirname);
const start = Date.now();

// Grid of points earned given new rules
const matrix = [
  [8, 4, 3], // Rock (win, tie, loss)
  [9, 5, 1], // Paper (win, tie, loss)
  [7, 6, 2], // Scissors (win, tie, loss)
];

const moves = {
  A: 0,
  X: 2,
  B: 1,
  Y: 1,
  C: 2,
  Z: 0,
};

let result = 0;

input.forEach((game) => {
  const [x, y] = game.split(" ");
  result += matrix[moves[x]][moves[y]];
});

console.log(result);
console.log("Time", Date.now() - start, "ms");

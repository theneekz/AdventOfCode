/*
--- Part Two ---
The escalator doesn't move. The Elf explains that it probably needs more joltage to overcome the static friction of the system and hits the big red "joltage limit safety override" button. You lose count of the number of times she needs to confirm "yes, I'm sure" and decorate the lobby a bit while you wait.

Now, you need to make the largest joltage by turning on exactly twelve batteries within each bank.

The joltage output for the bank is still the number formed by the digits of the batteries you've turned on; the only difference is that now there will be 12 digits in each bank's joltage output instead of two.

Consider again the example from before:

987654321111111
811111111111119
234234234234278
818181911112111
Now, the joltages are much larger:

In 987654321111111, the largest joltage can be found by turning on everything except some 1s at the end to produce 987654321111.
In the digit sequence 811111111111119, the largest joltage can be found by turning on everything except some 1s, producing 811111111119.
In 234234234234278, the largest joltage can be found by turning on everything except a 2 battery, a 3 battery, and another 2 battery near the start to produce 434234234278.
In 818181911112111, the joltage 888911112111 is produced by turning on everything except some 1s near the front.
The total output joltage is now much larger: 987654321111 + 811111111119 + 434234234278 + 888911112111 = 3121910778619.

What is the new total output joltage?

Your puzzle answer was 171518260283767.
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt");
  let result = 0;

  for (const line of input) {
    // Make array for all digits
    let allDigits = new Array(12).fill({ value: -1, originalIndex: -1 });
    // Make an index for searching left to right
    let index = 0;
    while (index < line.length) {
      // Check length of rest of line to determine which digit it could replace
      let remainingLength = line.length - index;
      let replacementIndex =
        12 - remainingLength > 0 ? 12 - remainingLength : 0;
      let current = Number(line[index]);

      for (let i = replacementIndex; i < 12; i++) {
        const foundGreaterValue = current > allDigits[i].value;
        const canReplace = allDigits[i].originalIndex < index;
        const hasEnoughLength = line.length - index >= 12 - i;
        if (foundGreaterValue && canReplace && hasEnoughLength) {
          replacementIndex = i;
          break;
        }
      }

      if (current > allDigits[replacementIndex].value) {
        // Get index to jump to after replacement
        let endIndex = index + (12 - replacementIndex);
        allDigits[replacementIndex] = { value: current, originalIndex: index };
        allDigits = allDigits.slice(0, replacementIndex + 1).concat(
          line
            .slice(index + 1, endIndex)
            .split("")
            .map((v, i) => ({ value: Number(v), originalIndex: index + 1 + i }))
        );
      }
      index++;
    }
    result += Number(allDigits.map((x) => x.value).join(""));
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms"); // 28 ms

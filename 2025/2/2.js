/*
--- Part Two ---
The clerk quickly discovers that there are still invalid IDs in the ranges in your list. Maybe the young Elf was doing other silly patterns as well?

Now, an ID is invalid if it is made only of some sequence of digits repeated at least twice. So, 12341234 (1234 two times), 123123123 (123 three times), 1212121212 (12 five times), and 1111111 (1 seven times) are all invalid IDs.

From the same example as before:

11-22 still has two invalid IDs, 11 and 22.
95-115 now has two invalid IDs, 99 and 111.
998-1012 now has two invalid IDs, 999 and 1010.
1188511880-1188511890 still has one invalid ID, 1188511885.
222220-222224 still has one invalid ID, 222222.
1698522-1698528 still contains no invalid IDs.
446443-446449 still has one invalid ID, 446446.
38593856-38593862 still has one invalid ID, 38593859.
565653-565659 now has one invalid ID, 565656.
824824821-824824827 now has one invalid ID, 824824824.
2121212118-2121212124 now has one invalid ID, 2121212121.
Adding up all the invalid IDs in this example produces 4174379265.

What do you get if you add up all of the invalid IDs using these new rules?

Your puzzle answer was 45283684555.
*/
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInput(__dirname, "/input.txt").split(",");

  let result = 0;

  for (const range of input) {
    const [start, end] = range.split("-").map(Number);

    for (let current = start; current <= end; current++) {
      for (
        let windowSize = 1;
        windowSize <= current.toString().length / 2;
        windowSize++
      ) {
        let windowA = current.toString().slice(0, windowSize);
        let allWindowsMatch = true;
        for (let i = 0; i < current.toString().length; i += windowSize) {
          const sequence = current.toString().slice(i, i + windowSize);
          if (sequence !== windowA) {
            allWindowsMatch = false;
            break;
          }
        }
        // 655 ms
        if (allWindowsMatch) {
          result += current;
          break;
        }
      }
    }
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");
// 655 ms

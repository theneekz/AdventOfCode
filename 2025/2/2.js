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
*/
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInput(__dirname, "/input.txt").split(",");

  let result = 0;

  for (const range of input) {
    const [start, end] = range.split("-").map(Number);

    for (let i = start; i <= end; i++) {
      for (
        let windowSize = 1;
        windowSize <= i.toString().length / 2;
        windowSize++
      ) {
        const windowAStart = 0;
        let windowAEnd = windowSize;
        let windowBStart = windowSize;
        let windowBEnd = windowBStart + windowSize;

        let windowA = i.toString().slice(windowAStart, windowAEnd);
        let windowB = i.toString().slice(windowBStart, windowBEnd);

        let foundInvalid = false;

        while (windowBEnd <= i.toString().length) {
          if (windowA !== windowB) {
            windowSize++;
            windowAEnd = windowSize;
            windowBStart = windowSize;
            windowBEnd = windowBStart + windowSize;
            windowA = i.toString().slice(windowAStart, windowAEnd);
            windowB = i.toString().slice(windowBStart, windowBEnd);
          } else if (windowBEnd === i.toString().length) {
            result += i;
            foundInvalid = true;
            break;
          } else {
            windowBStart += windowSize;
            windowBEnd = windowBStart + windowSize;
            windowB = i.toString().slice(windowBStart, windowBEnd);
          }
        }

        if (foundInvalid) break;
      }
    }
  }
  return result;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");
// 546 ms

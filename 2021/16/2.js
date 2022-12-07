/*
--- Part Two ---
Now that you have the structure of your transmission decoded, you can calculate the value of the expression it represents.

Literal values (type ID 4) represent a single number as described above. The remaining type IDs are more interesting:

Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Using these rules, you can now work out the value of the outermost packet in your BITS transmission.

For example:

C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
04005AC33890 finds the product of 6 and 9, resulting in the value 54.
880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
D8005AC2A8F0 produces 1, because 5 is less than 15.
F600BC2D8F produces 0, because 5 is not greater than 15.
9C005AC2F8F0 produces 0, because 5 is not equal to 15.
9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.
What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?
*/

const { getInput, getInputArray, print } = require("../../utils");
// const hex = getInput(__dirname);

// const hex = "C200B40A82";
// const hex = "04005AC33890";
// const hex = "880086C3E88112";
// const hex = "CE00C43D881120";
// const hex = "D8005AC2A8F0";
// const hex = "F600BC2D8F";
// const hex = "9C005AC2F8F0";
const hex = "9C0141080250320F1802104A08";
const start = Date.now();

let allVersions = 0;

const hexLookUp = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};
const getBinaryForHex = (x) => {
  let result = "";
  for (const char of x.split("")) {
    result += hexLookUp[char];
  }
  return result;
};

const getIntForBinary = (x) => parseInt(x, 2);

//convert hexadecimal into binary
const hexAsBinary = getBinaryForHex(hex);

const handleLiteral = (fullBinary) => {
  const literal = fullBinary.slice(6);
  //the rest of the packet are groups which prefix 1 or 0 before the 4 actual digits
  let hasMoreChunks = true;
  let leftIdx = 0;
  let fullVal = "";
  while (hasMoreChunks) {
    const chunk = literal.slice(leftIdx, leftIdx + 5);
    //1 means it is not the last group of 4
    //0 means it is the last group of four
    const isLast = chunk.slice(0, 1) === "0";
    const newDigits = chunk.slice(1);
    fullVal += newDigits;
    leftIdx += 5;
    if (isLast) {
      hasMoreChunks = false;
      return {
        literalLength: leftIdx + 6,
        remaining: literal.slice(leftIdx),
        value: getIntForBinary(fullVal),
      };
    }
  }
};

const handleOperator = (fullBinary) => {
  const operator = fullBinary.slice(6);
  //the digit right after the header indicates the length of the next number
  const lengthTypeId = operator.slice(0, 1);
  //0 - use the next 15 bits to determine the decimal number of the total length of the sub packets
  let subpacketLength;
  //1 - use the next 11 bits to determine the decimal number of the number of subpackets
  let subpacketCount;
  const lengthTypeDigits = lengthTypeId === "1" ? 11 : 15;
  let lengthTypeVal = operator.slice(1, lengthTypeDigits + 1); //binary
  lengthTypeVal = parseInt(lengthTypeVal, 2); // decimal
  lengthTypeDigits === 11
    ? (subpacketCount = lengthTypeVal)
    : (subpacketLength = lengthTypeVal);
  return {
    remaining: operator.slice(lengthTypeDigits + 1),
    subpacketLength,
    subpacketCount,
  };
};

const rules = {
  "000": (all) => {
    if (all.length === 1) {
      return all;
    }
    return all.reduce((p, c) => p + c, 0);
  },
  "001": (all) => all.reduce((p, c) => p * c, 1),
  "010": (all) => all.sort((a, b) => a - b)[0],
  "011": (all) => all.sort((a, b) => b - a)[0],
  101: ([a, b]) => (a > b ? 1 : 0),
  110: ([a, b]) => (a < b ? 1 : 0),
  111: ([a, b]) => (a === b ? 1 : 0),
};

const compute = ([rule, ...args]) => {
  console.log({ rule, args });
  // if (typeof rule === "string") {
  return rules[rule](args);
  // } else if (!args.length) {
  //   return rule;
  // } else {
  //   return [rule, ...args];
  // }
};

const parsePacket = ({
  packet,
  subCount,
  subLength,
  results = [],
  depth = 0,
}) => {
  console.log({ depth, results, subCount, subLength });
  if (subCount) {
    subCount -= 1;
  }
  //first three digits are version
  let version = packet.slice(0, 3);
  version = getIntForBinary(version);
  // console.log("adding to all versions:", version);
  allVersions += version;

  //next three digits are type id
  const typeId = packet.slice(3, 6);

  //if type id === 4 (100 in binary), it is a literal value
  const isLiteral = typeId === "100";

  if (isLiteral) {
    // console.log("found literal");
    const { remaining, literalLength, value } = handleLiteral(packet);
    results.push(value);
    const isAllZeros = remaining.indexOf("1") === -1;
    if (subLength) {
      subLength -= literalLength;
    }
    // console.log({ isAllZeros, subLength, subCount });
    if (subLength <= 0 || subCount === 0) {
      console.log("computing with:", results);
      const x = compute(results);
      if (Array.isArray(x)) {
        results = x;
      } else {
        results = [x];
      }
    }
    if (!isAllZeros) {
      // console.log(
      //   "going down the rabbit hole and somehow leaving at the same time idk my own rules fuck this fuck this fuck this omg fuck this"
      // );
      return parsePacket({
        packet: remaining,
        results,
        subCount,
        subLength,
        depth: depth,
      });
    }
  } else {
    // console.log("found operator");
    // results.push(typeId);
    //type id !== 4 means it's an operator, contians sub packets
    const { remaining, subpacketCount, subpacketLength } =
      handleOperator(packet);

    const outcome = parsePacket({
      packet: remaining,
      results: [typeId],
      subCount: subpacketCount,
      subLength: subpacketLength,
      depth: depth + 1,
    });
    // console.log({ outcome });
    if (Array.isArray(outcome)) {
      results.push(...outcome);
    } else {
      return outcome;
    }
  }
  // console.log("leaving rabbit hole");
  return results;
};

let results = parsePacket({ packet: hexAsBinary });

//["000", "001", 210379, "110", 32, 32, "001", 229, 105, 88, 193, 132, "000", "010", "010", "010", "010", "001", "001", "001", "011", "011", "010", "010", "000", "001", "011", "000", "001", "000", "000", "000", 171, "010", 208, 241, 9, 88, "001", "111", 26017, 26017, 3902, "001", "101", 107, 107, 710122, "001", 2077, "111", 2483023238, 194, "001", "110", 229, 11, 707574, 2348, "001", "110", 3938, 61713, 75, "000", 4, 786, 168, 12260116, 13, "001", 43399, "101", 12586816, 16010, "010", 27, 599, 3, 13566083486, "001", 217, "110", "000", 11, 12, 13, "000", 8, 7, 15, "001", "111", 3819, 9696040, 34018, 436152, "001", 135, 124, "001", 1033616, "101", 1849, 235, "011", 225, "001", 1017104, "110", 196, 580005, "001", 14634355, "110", "000", 13, 10, 4, "000", 12, 10, 10, "000", 173570, 2875062610, 245, 988, 898, "001", 58, 230, 44, "001", "110", 266783, 7, 120, 27427, "011", 356, 19935, 12, 4665051, "001", "000", 4, 14, 3, "000", 9, 5, 14, "000", 10, 5, 2, "011", 1662, 14, 18592055, "000", 985, 822126801493, 3493, "010", 1433, 2941, "001", 148, "000", 239, 2, "010", 925224, 112, 15, 19, 6, 1933, 5, "001", "110", 801376306, 801376306, 169143, "001", 92611813, "111", "000", 11, 7, 4, "000", 4, 8, 11, "001", 249520695, "101", 58, 836013, "001", "101", "000", 10, 10, 15, "000", 15, 12, 14, 140, "001", "101", 47019, 180654, 8, "000", "001", 9, 15, 4, "001", 12, 11, 10, "001", 15, 7, 6, 123349, "010", 2148824802, 159702409, "001", "101", "000", 3, 15, 10, "000", 10, 11, 5, 1536, "001", 28, 105, 10, 155, "001", "101", 47, 47, 349, "011", 17097035226, 53117, 108, "000", 911, "011", 10, 660814, 655, 133, 7228380]

console.log(JSON.stringify(results));

console.log(compute(results));

// const compute = (inputArr) => {
//   let rule;
//   for (let i = 0; i < inputArr.length; i++) {}
// };

console.log("Time", Date.now() - start, "ms"); //7

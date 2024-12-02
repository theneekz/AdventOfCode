/*
--- Part Two ---
Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

seeds: 79 14 55 13
This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?


*/
const { getInput } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInput(__dirname);
  // const input = getInput(__dirname, "/test1.txt");
  let { seedsInput, maps } = parseInput(input);

  // seedsInput = [seedsInput[0]];

  maps = maps.map((x) => convert(x));

  let min = Infinity;

  let queue = [...maps].reverse();

  while (queue.length) {
    // console.log("new map");
    let currentMap = queue.shift();
    const maxSource = (a) => a[1] + a[2];
    currentMap.sort((a, b) => maxSource(b) - maxSource(a));

    for (let current = maxSource(currentMap[0]); current >= 0; current--) {}

    // for (const [dest, source, range] of currentMap) {
    //   for (let i = 0; i < range; i++) {
    //     arrMap[source + i] = dest + i;
    //   }
    // }

    return "todo";
  }

  // for (const pair of seedsInput) {
  //   console.log("new pair");
  //   const [start, l] = pair.split(" ").map((x) => Number(x));
  // }

  return min;
}

const parseInput = (inputStr) => {
  inputStr = inputStr.split("\n\n").map((x) => x.split("\n"));

  let [
    seedsInput,
    seedToSoilInput,
    soilToFertilizerInput,
    fertilizerToWaterInput,
    waterToLightInput,
    lightToTemperatureInput,
    temperatureToHumidityInput,
    humidityToLocationInput,
  ] = inputStr;

  seedsInput = seedsInput[0].split(": ")[1].match(/(\d+ \d+)/g);

  seedToSoilInput.shift();
  soilToFertilizerInput.shift();
  fertilizerToWaterInput.shift();
  waterToLightInput.shift();
  lightToTemperatureInput.shift();
  temperatureToHumidityInput.shift();
  humidityToLocationInput.shift();

  return {
    seedsInput,
    maps: [
      seedToSoilInput,
      soilToFertilizerInput,
      fertilizerToWaterInput,
      waterToLightInput,
      lightToTemperatureInput,
      temperatureToHumidityInput,
      humidityToLocationInput,
    ],
  };
};

const convert = (input) => {
  return input.map((line) => line.split(" ").map((x) => Number(x)));
};

console.log(main());

console.log("Time", Date.now() - start, "ms");

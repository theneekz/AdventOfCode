/*
--- Part Two ---
Your handheld device indicates that the distress signal is coming from a beacon nearby. The distress beacon is not detected by any sensor, but the distress beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.

To isolate the distress beacon's signal, you need to determine its tuning frequency, which can be found by multiplying its x coordinate by 4000000 and then adding its y coordinate.

In the example above, the search space is smaller: instead, the x and y coordinates can each be at most 20. With this reduced search area, there is only a single position that could have a beacon: x=14, y=11. The tuning frequency for this distress beacon is 56000011.

Find the only possible position for the distress beacon. What is its tuning frequency?
*/
const { getInputArray } = require("../../utils");
const start = Date.now();

function main() {
  const input = getInputArray(__dirname, "/input.txt");
  const coordinates = getCoordsFromInput(input);
  // const boundary = 20;
  const boundary = 4000000;
  const cave = fillCave(coordinates, boundary);
  // const foundBeacon = searchBoundaryForBeacon(cave, boundary);
  // const result = getTuningFrequencyForCoord(foundBeacon);
  // return result;
}

function getCoordsFromInput(input) {
  // Holds pairs of sensorCoords & beaconCoords
  let coordinatesArr = [];
  // Holds keys of coords that are either sensors or beacons (for quick lookup)
  let coordinatesObj = {};
  input.forEach((line) => {
    const [sensorCoords, beaconCoords] = getCoordFromLine(line);
    coordinatesArr.push([sensorCoords, beaconCoords]);
    coordinatesObj[JSON.stringify(sensorCoords)] = "S";
    coordinatesObj[JSON.stringify(beaconCoords)] = "B";
  });
  return { coordinatesArr, coordinatesObj };
}

function getCoordFromLine(line) {
  let [sensorStr, beaconStr] = line.split(": ");
  sensorStr = sensorStr.split("Sensor at ")[1];
  beaconStr = beaconStr.split("closest beacon is at ")[1];
  let [sensorX, sensorY] = sensorStr.split(", ");
  let [beaconX, beaconY] = beaconStr.split(", ");
  sensorX = Number(sensorX.split("x=")[1]);
  sensorY = Number(sensorY.split("y=")[1]);
  beaconX = Number(beaconX.split("x=")[1]);
  beaconY = Number(beaconY.split("y=")[1]);
  return [
    [sensorX, sensorY],
    [beaconX, beaconY],
  ];
}

function fillCave({ coordinatesArr, coordinatesObj }, boundary = 20) {
  for (const coordinatePair of coordinatesArr) {
    console.log("new pair");
    const fullDistance = getManhattan(coordinatePair);
    const [[sensorX, sensorY], [beaconX, beaconY]] = coordinatePair;
    // Inclusive range of y values for blanks given the manhattan distance
    const [startY, endY] = [sensorY - fullDistance, sensorY + fullDistance];
    const outsideYBoundary = startY > boundary || endY < 0;
    // Don't bother with coordinates whose blanks dont fall in boundary
    if (outsideYBoundary) {
      console.log("outsideYBoundary");
      continue;
    }
    console.log({ startY, endY });
    for (let row = startY; row <= endY; row++) {
      const blanks = fullDistance - Math.abs(row - sensorY);
      // Inclusive range for blanks in the given row
      const [startX, endX] = [sensorX - blanks, sensorX + blanks];
      const outsideXBoundary = startX > boundary || endX < 0;
      // Don't bother with coordinates whose blanks dont fall in boundary
      if (outsideXBoundary) {
        // console.log("outsideXBoundary");
        continue;
      }
      for (let col = startX; col <= endX; col++) {
        const coordIsUnused = !coordinatesObj[JSON.stringify([col, row])];
        if (coordIsUnused) {
          coordinatesObj[JSON.stringify([col, row])] = "#";
        }
      }
    }
  }
  return coordinatesObj;
}

function getManhattan([startCoord, endCoord]) {
  return (
    Math.abs(startCoord[0] - endCoord[0]) +
    Math.abs(startCoord[1] - endCoord[1])
  );
}

function searchBoundaryForBeacon(cave, boundary) {
  for (let row = 0; row <= boundary; row++) {
    for (let col = 0; col <= boundary; col++) {
      if (!cave[JSON.stringify([col, row])]) {
        return [col, row];
      }
    }
  }
}

function getTuningFrequencyForCoord([x, y]) {
  return x * 4000000 + y;
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

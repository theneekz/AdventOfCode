const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
//const input = fs.readFileSync('test.txt', 'utf8');
const inputArr = input.split('\n\n');
let validPassports = [];
let invalid = [];

let regex = /(\bbyr|\biyr|\beyr|\bhgt|\bhcl|\becl|\bpid)/gm;

let byrRegex = /(?<=\bbyr:)(19[2-9]\d|20[0-1]\d|2020)?\b/g;
let iyrRegex = /(?<=\biyr:)(20[1]\d|2020)?\b/g;
let eyrRegex = /(?<=\beyr:)(20[2]\d|2030)?\b/g;

inputArr.forEach((passport) => {
  let tempArr = passport.split('\n').join(' ').split(' ');
  if (passport.match(regex).length === 7) {
    let validByr;
    let validIyr;
    let validEyr;
    let validHgt;
    let validHcl;
    let validEcl;
    let validPid;
    let testVal;

    tempArr.forEach((field) => {
      if (field.includes('byr:')) {
        validByr = field.match(byrRegex)[0].length > 0;
      }
      if (field.includes('iyr:')) {
        validIyr = field.match(iyrRegex)[0].length > 0;
      }
      if (field.includes('eyr:')) {
        validEyr = field.match(eyrRegex)[0].length > 0;
      }
      if (field.includes('hgt:')) {
        let inOrCm = field.slice(-2);
        let hieghtVal = field.slice(4, -2);
        if (inOrCm === 'in') {
          validHgt = hieghtVal > 58 && hieghtVal < 77;
        } else if (inOrCm === 'cm') {
          validHgt = hieghtVal > 149 && hieghtVal < 194;
        }
      }
      if (field.includes('hcl:#')) {
        let hairVal = field.slice(5);
        let hairRegex = /([0-9a-f])/g;
        if (hairVal.length === 6) {
          validHcl = hairVal.match(hairRegex).length === 6;
        }
      }
      if (field.includes('ecl:')) {
        let eyeColor = field.slice(4);
        if (eyeColor.length === 3) {
          let eyeRegex = /(amb)?(blu)?(brn)?(gry)?(grn)?(hzl)?(oth)?/g;
          validEcl = eyeColor.match(eyeRegex)[0].length > 0;
        }
      }
      if (field.includes('pid:')) {
        let passId = field.slice(4);
        if (passId.length === 9) {
          validPid = !isNaN(parseInt(passId));
        }
      }
    });
    if (
      validByr &&
      validIyr &&
      validEyr &&
      validHgt &&
      validHcl &&
      validEcl &&
      validPid
    ) {
      //console.log(passport);
      validPassports.push(tempArr);
    } else {
      invalid.push(tempArr);
    }
  } else {
    invalid.push(tempArr);
  }
});

console.log(validPassports.length);
return;

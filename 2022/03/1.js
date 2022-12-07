/*
--- Day 3: Rucksack Reorganization ---
One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

Each rucksack has two large compartments. All items of a given type are meant to go into exactly one of the two compartments. The Elf that did the packing failed to follow this rule for exactly one item type per rucksack.

The Elves have made a list of all of the items currently in each rucksack (your puzzle input), but they need your help finding the errors. Every item type is identified by a single lowercase or uppercase letter (that is, a and A refer to different types of items).

The list of items for each rucksack is given as characters all on a single line. A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.

For example, suppose you have the following list of contents from six rucksacks:

vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. The only item type that appears in both compartments is lowercase p.
The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item type that appears in both compartments is uppercase L.
The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type is uppercase P.
The fourth rucksack's compartments only share item type v.
The fifth rucksack's compartments only share item type t.
The sixth rucksack's compartments only share item type s.
To help prioritize item rearrangement, every item type can be converted to a priority:

Lowercase item types a through z have priorities 1 through 26.
Uppercase item types A through Z have priorities 27 through 52.
In the above example, the priority of the item type that appears in both compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.

Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

7785
*/
const { getInputArray } = require("../../utils");
const inputArr = getInputArray(__dirname);
const start = Date.now();

// For each rucksack, return the shared character in both compartments
const priorities = inputArr.map((sack) => {
  // Divide the rucksack in half
  let sackA = sack.slice(0, sack.length / 2);
  let sackB = sack.slice(sack.length / 2);
  // Once a character in compartment A is found in compartment B, return
  for (let char of sackA) {
    if (sackB.includes(char)) return char;
  }
});

// Helper to determine if a character is lowerCase based on ASCII value
const isLower = (c) => c.charCodeAt() >= 97;

// Score:  a - z  =  1-26,   A - Z  = 27-52
// ASCII: "a"-"z" = 97-123, "A"-"Z" = 65-91
// Get the priority score for the character - subtract 96 if lower else 38
const getCharScore = (c) => c.charCodeAt() - (isLower(c) ? 96 : 38);

// Get sum of all priorities of items
console.log(priorities.reduce((p, c) => p + getCharScore(c), 0));

console.log("Time", Date.now() - start, "ms");

/*
 --- Part Two ---
To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
KK677 is now the only two pair, making it the second-weakest hand.
T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.
With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?

Your puzzle answer was 243101568.

 */
const { getInputArray } = require("../../utils");
const start = Date.now();

const HAND_TYPES = ["HIGH", "PAIR", "TWO", "THREE", "FULL", "FOUR", "FIVE"];
const CARDS = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];

function main() {
  let input = getInputArray(__dirname);
  input = input.map((line) => line.split(" "));

  let winnings = 0;

  input.sort((a, b) => {
    const aHand = a[0];
    const bHand = b[0];
    return sortHands(aHand, bHand);
  });

  for (let i = 0; i < input.length; i++) {
    const rank = i + 1;
    const bid = input[i][1];
    winnings += rank * bid;
  }

  return winnings;
}

function sortHands(a, b) {
  const aType = getHandType(a);
  const bType = getHandType(b);

  if (aType > bType) return 1;
  if (aType < bType) return -1;

  return tieBreaker(a, b);
}

function getHandType(hand) {
  const hasJoker = hand.indexOf("J") > -1;

  // Five of a kind: AAAAA
  if (/(\w)\1{4}$/g.test(hand)) {
    return HAND_TYPES.indexOf("FIVE");
  }

  // Sort hand for easier regexing
  // 32T3K -> 233KT
  const sortedHand = getSortedHand(hand);

  // Four of a kind: AQQQQ, QQQQA
  if (/(\w)\1{3}/g.test(sortedHand)) {
    // Either card type being J would result in five of a kind
    return HAND_TYPES.indexOf("FOUR") + hasJoker;
  }

  // Full house: AAQQQ, KKAAA
  if (/(\w)\1{2}(\w)\2{1}|(\w)\3{1}(\w)\4{2}/g.test(sortedHand)) {
    // Either card type being J would result in five of a kind
    return HAND_TYPES.indexOf("FULL") + (hasJoker && 2);
  }

  // Three of a kind: T555Q, etc
  if (/(\w)\1{2}/g.test(sortedHand)) {
    // Any card type being J would result in four of a kind
    return HAND_TYPES.indexOf("THREE") + (hasJoker && 2);
  }

  // Two pair: 55443, 55344, 54433
  if (/(\w)\1{1}(\w)?(\w)\3{1}/g.test(sortedHand)) {
    if (hasJoker) {
      const jokerCount = sortedHand.split("").filter((x) => x === "J").length;
      // 2 cards being J would result in four of a kind, else full house
      return jokerCount === 2
        ? HAND_TYPES.indexOf("FOUR")
        : HAND_TYPES.indexOf("FULL");
    }
    return HAND_TYPES.indexOf("TWO");
  }

  // One pair: AA345, etc
  if (/(\w)\1{1}/g.test(sortedHand)) {
    // Any card type being J would result in three of a kind
    return HAND_TYPES.indexOf("PAIR") + (hasJoker && 2);
  }

  // High card
  // Any card type being J would result in a pair
  return 0 + hasJoker;
}

function getSortedHand(hand) {
  return [...hand].sort((a, b) => CARDS.indexOf(b) - CARDS.indexOf(a)).join("");
}

function tieBreaker(a, b) {
  for (let i = 0; i < a.length; i++) {
    const [aCard, bCard] = [a[i], b[i]];
    const difference = CARDS.indexOf(aCard) - CARDS.indexOf(bCard);
    if (difference === 0) continue;

    return difference;
  }
}

console.log(main());

console.log("Time", Date.now() - start, "ms");

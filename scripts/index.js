const imagesPath = "../images";
const imagesCollection = [
  "bouquet.png",
  "cake.png",
  "christmastree.png",
  "dog.png",
  "fish.png",
  "fruits.png",
  "house.png",
  "present.png",
  "smiley.png",
  "snowman.png"
];
const gameImageCount = 6;
const defaultImage = "pink-question-mark.png";

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

function flipCard() {
  // if the card is locked or the same card is clicked twice, return
  if (lockBoard || $(this).is(firstCard)) return;

  // toggle the card class
  $(this).toggleClass("card-flipped");

  // if the first card is not flipped, flip it
  if (!hasFlippedCard) {
    firstCard = this;
    hasFlippedCard = true;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  // lock the board to avoid third card click
  lockBoard = true;
  const isMatch = $(firstCard).data("name") === $(secondCard).data("name");

  if (isMatch) {
    disableCards();
    matchedPairs++;

    if (matchedPairs === gameImageCount) {
      setTimeout(() => {
        if (confirm("Congratulations! Play again?")) {
          resetGame();
        }
      }, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  $(firstCard).off("click", flipCard).addClass("matched");
  $(secondCard).off("click", flipCard).addClass("matched");
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    $(".card-flipped:not(.matched)").removeClass("card-flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function resetGame() {
  matchedPairs = 0;
  $(".game-board").empty();
  createGameBoard();
}

function createGameBoard() {
  const $gameBoard = $(".game-board");
  const shuffledImages = [...imagesCollection]
    .sort(() => Math.random() - 0.5)
    .slice(0, gameImageCount);
  const cardImages = [...shuffledImages, ...shuffledImages].sort(
    () => Math.random() - 0.5
  );

  cardImages.forEach((card) => {
    $("<div>", {
      class: "card",
      "data-name": card
    })
      .append(
        $("<img>", {
          class: "card-image front",
          src: `${imagesPath}/${defaultImage}`
        }),
        $("<img>", {
          class: "card-image back",
          src: `${imagesPath}/${card}`
        })
      )
      .on("click", flipCard)
      .appendTo($gameBoard);
  });
}

$(document).ready(() => {
  createGameBoard();
});

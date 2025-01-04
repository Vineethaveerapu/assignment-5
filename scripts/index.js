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
const maxTurns = Math.floor(gameImageCount * 1.9);

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let turns = 0;

function flipCard() {
  const isGameOver = matchedPairs === gameImageCount || turns >= maxTurns;
  if (lockBoard || $(this).is(firstCard) || isGameOver) return;

  $(this).toggleClass("card-flipped");

  if (!hasFlippedCard) {
    firstCard = this;
    hasFlippedCard = true;
    return;
  }

  secondCard = this;
  turns++;
  updateTurnMessage();
  checkForMatch();
}

function checkForMatch() {
  lockBoard = true;
  const isMatch = $(firstCard).data("name") === $(secondCard).data("name");

  if (isMatch) {
    disableCards();
    matchedPairs++;
    checkGameEnd();
  } else {
    unflipCards();
    checkGameEnd();
  }
}

function checkGameEnd() {
  if (matchedPairs === gameImageCount) {
    setTimeout(() => {
      updateGameMessage(`🎉 Congratulations! You won in ${turns} turns!`);
      showNewGamePrompt();
    }, 500);
  } else if (turns >= maxTurns) {
    setTimeout(() => {
      updateGameMessage(
        `Game Over! You ran out of turns. Found ${matchedPairs} pairs.`
      );
      showNewGamePrompt();
    }, 500);
  } else {
    updateGameMessage(
      `Turns: ${turns}/${maxTurns} | Pairs found: ${matchedPairs}/${gameImageCount}`
    );
  }
}

function showNewGamePrompt() {
  $(".replay-button").show().focus();
}

function resetGame() {
  matchedPairs = 0;
  turns = 0;
  $(".game-board").empty();
  updateGameMessage(`Turns: 0/${maxTurns} | Pairs found: 0/${gameImageCount}`);
  $(".replay-button").hide();
  createGameBoard();
}

function updateTurnMessage() {
  updateGameMessage(
    `Turns: ${turns}/${maxTurns} | Pairs found: ${matchedPairs}/${gameImageCount}`
  );
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

function handleNewGameButton() {
  $(".replay-button").on("click", () => {
    resetGame();
  });
}

function updateGameMessage(message) {
  $(".game-message").text(message);
}

$(document).ready(() => {
  createGameBoard();
  handleNewGameButton();
  updateGameMessage(`Turns: 0/${maxTurns} | Pairs found: 0/${gameImageCount}`);
  $(".replay-button").hide();
});

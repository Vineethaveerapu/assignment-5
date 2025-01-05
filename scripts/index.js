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
let gamePlayedCount = parseInt(sessionStorage.getItem("gamePlayedCount")) || 0;
let gameWinCount = parseInt(sessionStorage.getItem("gameWinCount")) || 0;
let gameLossCount = parseInt(sessionStorage.getItem("gameLossCount")) || 0;

function updateGameStats() {
  $("#games-played").text(gamePlayedCount);
  $("#wins").text(gameWinCount);
  $("#losses").text(gameLossCount);
}

function incrementGameStats() {
  gamePlayedCount++;
  if (matchedPairs === gameImageCount) {
    gameWinCount++;
  } else {
    gameLossCount++;
  }
  sessionStorage.setItem("gamePlayedCount", gamePlayedCount);
  sessionStorage.setItem("gameWinCount", gameWinCount);
  sessionStorage.setItem("gameLossCount", gameLossCount);
  updateGameStats();
}

function flipCard() {
  const isGameOver = matchedPairs === gameImageCount || turns >= maxTurns;
  if (lockBoard || $(this).is(firstCard) || isGameOver) return;

  $(this).addClass("card-flipped");

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
    incrementGameStats();
    setTimeout(() => {
      updateGameMessage(
        `<span>🎉 Congratulations! You won in ${turns} turns!</span>`
      );
      handleDialog();
    }, 500);
  } else if (turns >= maxTurns) {
    incrementGameStats();
    setTimeout(() => {
      updateGameMessage(
        `<span>Game Over! You ran out of turns. Found ${matchedPairs} pairs.</span>`
      );
      handleDialog();
    }, 500);
  } else {
    updateGameMessage(
      `<span>Turns: ${turns}/${maxTurns}</span> <span>Pairs found: ${matchedPairs}/${gameImageCount}</span>`
    );
  }
}

function resetGame() {
  matchedPairs = 0;
  turns = 0;
  $(".game-board").empty();
  updateGameMessage(
    `<span>Turns: 0/${maxTurns}</span> <span>Pairs found: 0/${gameImageCount}</span>`
  );
  createGameBoard();
}

function handleDialog() {
  const dialog = document.getElementById("game-over-dialog");
  dialog.showModal();

  $(document).on("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) {
      dialog.close();
    }
  });
}

function handleReplayButton() {
  $("#replay-button").on("click", () => {
    resetGame();
    document.getElementById("game-over-dialog").close();
  });
}

function updateTurnMessage() {
  updateGameMessage(
    `<span>Turns: ${turns}/${maxTurns}</span> <span>Pairs found: ${matchedPairs}/${gameImageCount}</span>`
  );
}

function disableCards() {
  $(firstCard).off("click", flipCard).addClass("matched");
  $(secondCard).off("click", flipCard).addClass("matched");
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    $(firstCard).removeClass("card-flipped");
    $(secondCard).removeClass("card-flipped");
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

function updateGameMessage(message) {
  $(".game-message").html(message);
}

// eslint-disable-next-line no-unused-vars
function openDialog() {
  const dialog = document.getElementById("game-over-dialog");
  dialog.showModal();
}

function openWelcomeDialog() {
  const dialog = document.getElementById("welcome-dialog");
  dialog.showModal();

  $("#turns-left").text(maxTurns);
  $("#pairs-left").text(gameImageCount);
  $("#start-button").on("click", () => {
    dialog.close();
    $(".game-container").fadeIn(1500);
  });
}

function handleGameStatsButton() {
  $("#game-stats-button").on("click", () => {
    const dialog = document.getElementById("game-stats");
    dialog.showModal();
  });
}

$(document).ready(() => {
  createGameBoard();
  handleReplayButton();
  updateGameMessage(
    `<span>Turns: 0/${maxTurns}</span> <span>Pairs found: 0/${gameImageCount}</span>`
  );

  // openDialog();
  openWelcomeDialog();
  updateGameStats();
  handleGameStatsButton();
});

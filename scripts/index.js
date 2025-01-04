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
let firstCard, secondCard;

function flipCard() {
  this.classList.toggle("card-flipped");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // second click
    hasFlippedCard = false;
    secondCard = this;

    if (firstCard.dataset.name === secondCard.dataset.name) {
      // it's a match!
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      // add class as matched
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
    } else {
      // not a match
      setTimeout(() => {
        $(".card-flipped:not(.matched)").removeClass("card-flipped");
      }, 1000);
    }
  }
}

function createGameBoard() {
  const gameBoard = document.querySelector(".game-board");

  // shuffle the imagesCollection array and create card images with six pairs (12 total)
  const shuffledImages = imagesCollection.sort(() => Math.random() - 0.5);
  const sixImages = shuffledImages.slice(0, gameImageCount);
  const cardImages = [...sixImages, ...sixImages].sort(
    () => Math.random() - 0.5
  );

  cardImages.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card;

    // create the card image
    const frontImg = document.createElement("img");
    frontImg.classList.add("card-image", "front");
    frontImg.src = `${imagesPath}/${defaultImage}`;
    cardElement.appendChild(frontImg);

    // create the card back
    const backImg = document.createElement("img");
    backImg.classList.add("card-image", "back");
    backImg.src = `${imagesPath}/${card}`;
    cardElement.appendChild(backImg);

    gameBoard.appendChild(cardElement);

    // add event listener to the game board
    $(cardElement).on("click", flipCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createGameBoard();
});

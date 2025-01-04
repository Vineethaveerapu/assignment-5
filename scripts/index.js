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

function createGameBoard() {
  const gameBoard = document.querySelector(".game-board");

  // shuffle the imagesCollection array and create card images with six pairs (12 total)
  const shuffledImages = imagesCollection.sort(() => Math.random() - 0.5);
  const sixImages = shuffledImages.slice(0, 6);
  const cardImages = [...sixImages, ...sixImages].sort(
    () => Math.random() - 0.5
  );

  cardImages.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const img = document.createElement("img");
    img.classList.add("card-image");
    img.src = `${imagesPath}/${card}`;
    cardElement.appendChild(img);

    gameBoard.appendChild(cardElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createGameBoard();
});

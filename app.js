const fastFoodImgArray = [
  {
    name: "fries",
    img: "img/basic/fries.png",
  },
  {
    name: "cheeseburger",
    img: "img/basic/cheeseburger.png",
  },
  {
    name: "hotdog",
    img: "img/basic/hotdog.png",
  },
  {
    name: "ice-cream",
    img: "img/basic/ice-cream.png",
  },
  {
    name: "milkshake",
    img: "img/basic/milkshake.png",
  },
  {
    name: "pizza",
    img: "img/basic/pizza.png",
  },
];

const newYearImgArray = [
  {
    name: "candy",
    img: "img/newYear/candy.png",
  },
  {
    name: "deer",
    img: "img/newYear/deer.png",
  },
  {
    name: "gifts",
    img: "img/newYear/gifts.png",
  },
  {
    name: "santa",
    img: "img/newYear/santa.png",
  },
  {
    name: "gingerman",
    img: "img/newYear/gingerman.png",
  },
  {
    name: "tree",
    img: "img/newYear/tree.png",
  },
];

const gridDisplay = document.querySelector("#grid");
const result = document.querySelector("#result");
const moves = document.querySelector("#moves");
const rounds = document.querySelector("#rounds");
const accuracy = document.querySelector("#accuracy");
const modal = document.getElementById("myModal");
const modalBody = document.getElementById("modalBody");
const startButton = document.getElementById("startButton");
const centerBlock = document.getElementById("centerBlock");
const span = document.getElementsByClassName("close")[0];
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let nbRound = 0;
let nbMoves = 0;
let accuracyResult = 100;
let cardArray = [];

function prepareArray(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  let newArr = shuffled.slice(0, n);

  return [...newArr, ...newArr];
}

span.onclick = function () {
  modal.style.display = "none";
};
startButton.onclick = function () {
  for (let i = 3; i < 7; i++) {
    gridDisplay.classList.remove("_" + i);
  }

  const imageSet = document.getElementById("imageSet").value;
  const nbImages = document.getElementById("nbImages").value;

  gridDisplay.classList.add("_" + nbImages);

  let arr = imageSet === "fastfood" ? fastFoodImgArray : newYearImgArray;
  centerBlock.style.display = "none";
  clearBord();
  cardArray = prepareArray(arr, nbImages);
  cardArray.sort(() => 0.5 - Math.random());
  createBoard();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function clearBord() {
  let cards = document.getElementsByTagName("img");
  while (cards.length > 0) {
    cards[0].remove();
  }
  cardsWon = [];
  cardArray = [];
  nbRound += 1;
  nbMoves = 0;

  rounds.textContent = nbRound;
  moves.textContent = 0;
  result.textContent = 0;
}

function createBoard() {
  for (let i = 0; i < cardArray.length; i++) {
    const card = document.createElement("img");
    card.setAttribute("src", "img/blank.png");
    card.setAttribute("data-id", i);
    card.addEventListener("click", flipCard);
    gridDisplay.append(card);
  }
}
//createBoard();

function checkMatch() {
  nbMoves += 1;
  moves.textContent = nbMoves;
  const cards = document.querySelectorAll("img");
  const optionOneId = cardsChosenId[0];
  const optionTwoId = cardsChosenId[1];
  if (optionOneId === optionTwoId) {
    cards[optionOneId].setAttribute("src", "img/blank.png");
    cards[optionTwoId].setAttribute("src", "img/blank.png");
    alert("You have clicked the same image!");
  } else if (cardsChosen[0] === cardsChosen[1]) {
    // alert("You found the match!");
    const audio = new Audio("./sound/tink.wav");
    audio.play();

    cards[optionOneId].classList.add("hide");
    cards[optionTwoId].classList.add("hide");
    cards[optionOneId].removeEventListener("click", flipCard);
    cards[optionTwoId].removeEventListener("click", flipCard);
    cardsWon.push(cardsChosen);
  } else {
    cards[optionOneId].setAttribute("src", "img/blank.png");
    cards[optionTwoId].setAttribute("src", "img/blank.png");
  }
  result.textContent = cardsWon.length;

  cardsChosen = [];
  cardsChosenId = [];

  countAcuracy();

  if (cardsWon.length === cardArray.length / 2) {
    // result.innerHTML = "Congratulations, you found them all!";
    modalBody.innerHTML = `
    <p>You have made <strong>${nbMoves}</strong> steps! </p> 
    <p>Your accuracy was <strong>${accuracyResult.toFixed(2)}%</strong></p>
    `;
    modal.style.display = "block";
    centerBlock.style.display = "block";
  }
}

function flipCard() {
  const cardId = this.getAttribute("data-id");
  cardsChosen.push(cardArray[cardId].name);
  cardsChosenId.push(cardId);
  this.setAttribute("src", cardArray[cardId].img);

  if (cardsChosen.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

function countAcuracy() {
  accuracyResult = (cardsWon.length / nbMoves) * 100;
  accuracy.textContent = accuracyResult.toFixed(2);
}

//fireworks
window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var canvas,
  ctx,
  w,
  h,
  particles = [],
  probability = 0.04,
  xPoint,
  yPoint;

function onLoad() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
  console.log(canvas);
  if (!!canvas) {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
}

function updateWorld() {
  update();
  paint();
  window.requestAnimationFrame(updateWorld);
}

function update() {
  if (particles.length < 500 && Math.random() < probability) {
    createFirework();
  }
  var alive = [];
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].move()) {
      alive.push(particles[i]);
    }
  }
  particles = alive;
}

function paint() {
  ctx.globalCompositeOperation = "xor";
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw(ctx);
  }
}

function createFirework() {
  xPoint = Math.random() * (w - 200) + 100;
  yPoint = Math.random() * (h - 200) + 100;
  var nFire = Math.random() * 50 + 100;
  var c =
    "rgb(" +
    ~~(Math.random() * 200 + 55) +
    "," +
    ~~(Math.random() * 200 + 55) +
    "," +
    ~~(Math.random() * 200 + 55) +
    ")";
  for (var i = 0; i < nFire; i++) {
    var particle = new Particle();
    particle.color = c;
    var vy = Math.sqrt(25 - particle.vx * particle.vx);
    if (Math.abs(particle.vy) > vy) {
      particle.vy = particle.vy > 0 ? vy : -vy;
    }
    particles.push(particle);
  }
}

function Particle() {
  this.w = this.h = Math.random() * 4 + 1;

  this.x = xPoint - this.w / 2;
  this.y = yPoint - this.h / 2;

  this.vx = (Math.random() - 0.5) * 10;
  this.vy = (Math.random() - 0.5) * 10;

  this.alpha = Math.random() * 0.5 + 0.5;

  this.color;
}

Particle.prototype = {
  gravity: 0.05,
  move: function () {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.alpha -= 0.01;
    if (
      this.x <= -this.w ||
      this.x >= screen.width ||
      this.y >= screen.height ||
      this.alpha <= 0
    ) {
      return false;
    }
    return true;
  },
  draw: function (c) {
    c.save();
    c.beginPath();

    c.translate(this.x + this.w / 2, this.y + this.h / 2);
    c.arc(0, 0, this.w, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.globalAlpha = this.alpha;

    c.closePath();
    c.fill();
    c.restore();
  },
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let isGameOver = false;

const basket = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 40,
  width: 80,
  height: 20,
  dx: 5,
  color: "#4a90e2"
};

const objects = [];
const objectRadius = 10;
const objectSpeed = 2;
const objectColors = ["#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"];
const keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function drawBasket() {
  ctx.fillStyle = basket.color;
  drawRoundedRect(basket.x, basket.y, basket.width, basket.height, 10);
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawObject(object) {
  ctx.fillStyle = object.color;
  ctx.beginPath();
  ctx.arc(object.x, object.y, objectRadius, 0, Math.PI * 2);
  ctx.fill();
}

function generateObject() {
  const x = Math.random() * (canvas.width - objectRadius * 2) + objectRadius;
  const color = objectColors[Math.floor(Math.random() * objectColors.length)];
  objects.push({ x: x, y: -objectRadius * 2, color: color });
}

function updateObjects() {
  objects.forEach((object, index) => {
    object.y += objectSpeed;

    if (
      object.y + objectRadius > basket.y &&
      object.x > basket.x &&
      object.x < basket.x + basket.width
    ) {
      score++;
      document.getElementById("score").innerText = score;
      objects.splice(index, 1);
    }

    if (object.y > canvas.height) {
      isGameOver = true;
      endGame();
    }
  });
}

function moveBasket() {
  if (keys["ArrowRight"] && basket.x + basket.width < canvas.width) {
    basket.x += basket.dx;
  } else if (keys["ArrowLeft"] && basket.x > 0) {
    basket.x -= basket.dx;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  objects.forEach(drawObject);
}

function update() {
  moveBasket();
  updateObjects();
}

function gameLoop() {
  if (!isGameOver) {
    draw();
    update();
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOverPopup").style.display = "block";
}

function restartGame() {
  score = 0;
  isGameOver = false;
  objects.length = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("gameOverPopup").style.display = "none";
  gameLoop();
}

function startGame() {
  document.getElementById("instructionPopup").style.display = "none";
  gameLoop();
}

setInterval(generateObject, 1000);

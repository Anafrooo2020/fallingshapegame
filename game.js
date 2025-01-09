let score = 0;
let timePlayed = 0;
let gameRunning = false;
let objects = [];
let fallenCount = 0;
let startTime;

const canvas = document.getElementById('gameCanvas');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('startGame');
const finishButton = document.getElementById('finishGame');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d');

// Helper function to generate a random color
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

class Shape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10; // Start off the screen
        this.size = Math.random() * 30 + 20; // Random size
        this.isCircle = Math.random() > 0.5; // Randomly a circle or rectangle
        this.color = getRandomColor(); // Random color
        this.speed = Math.random()/4 ; // Random falling speed
    }

    draw() {
        ctx.beginPath();
        if (this.isCircle) {
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        } else {
            ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.speed;
    }

    clicked(mouseX, mouseY) {
        if (this.isCircle) {
            return Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2) < this.size / 2;
        } else {
            return mouseX >= this.x - this.size / 2 && mouseX <= this.x + this.size / 2 && mouseY >= this.y - this.size / 2 && mouseY <= this.y + this.size / 2;
        }
    }
}

// Game loop that runs every frame
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn a new shape occasionally
    if (Math.random() < 0.01) objects.push(new Shape());

    // Update and draw all shapes
    objects.forEach(obj => {
        obj.update();
        obj.draw();
    });

    // Check if shapes reached the bottom of the screen
    objects.forEach((obj, index) => {
        if (obj.y > canvas.height) {
            fallenCount++;
            objects.splice(index, 1); // Remove fallen shape
        }
    });

    // Game over condition (3 shapes fallen)
    if (fallenCount >= 3) {
        alert("Game Over!");
        finishGame();
    }

    // Update score and time
    scoreDisplay.textContent = "Score: " + score;
    timePlayed = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = "Time: " + timePlayed;

    if (gameRunning) requestAnimationFrame(gameLoop); // Continue the game loop
}

// Start the game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        fallenCount = 0;
        score = 0;
        objects = [];
        startTime = Date.now();
        finishButton.disabled = false;
        gameLoop();
    }
}

// Finish the game
function finishGame() {
    gameRunning = false;
    alert("Game Over! Final Score: " + score);
    finishButton.disabled = true;
}

// Handle mouse clicks (check if a shape is clicked)
function handleMouseClick(e) {
    if (!gameRunning) return;

    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    objects.forEach((obj, index) => {
        if (obj.clicked(mouseX, mouseY)) {
            objects.splice(index, 1); // Remove clicked shape
            score++; // Increase score
        }
    });
}

// Event listeners
canvas.addEventListener("click", handleMouseClick);
startButton.addEventListener("click", startGame);
finishButton.addEventListener("click", finishGame);

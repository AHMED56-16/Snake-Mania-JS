let inputDirection = { x: 0, y: 0 }
const foodSound = new Audio("./Assets/food.mp3");
const gameOverSound = new Audio("./Assets/gameover.mp3");
const moveSound = new Audio("./Assets/move.mp3");
let score = 0;
let speed = 5;
let lastPaintTime = 0;
let snakeArray = [
    { x: 13, y: 15 },
];
food = { x: 6, y: 7 };
const gameArea = document.getElementById("gameArea");
const scoreBox = document.querySelector(".scoreBox");
const highScoreBox = document.querySelector(".highScoreBox");

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Check collision with itself
    for (let i = 1; i < snakeArray.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Check collision with the edges of the game area
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    // Update snake position and Food
    if (isCollide(snakeArray)) {
        gameOverSound.play();
        inputDirection = { x: 0, y: 0 };
        score = 0;
        scoreBox.innerHTML = "Score: " + score; 
        alert("Game Over! Press any key to start again.");
        snakeArray = [{ x: 13, y: 15 }];
    }

    // If you have eaten the food, increment the score by 1 and regenerate the food
    if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > highScoreValue) {
            highScoreValue = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreValue));
            highScoreBox.innerHTML = "High Score: " + highScoreValue;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArray.unshift({ x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move the snake
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] };
    }
    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;

    // Display snake and food
    gameArea.innerHTML = "";
    snakeArray.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index == 0) {
            snakeElement.classList.add("snakeHead");
        } else {
            snakeElement.classList.add("snake");
        }
        gameArea.appendChild(snakeElement);
    });

    // Display food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("snakeFood");
    gameArea.appendChild(foodElement);
}

// Game Logic
let highScore = localStorage.getItem("highScore");
if (highScore == null) {
    highScoreValue = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue));
} else {
    highScoreValue = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScoreValue;
}
window.requestAnimationFrame(main);

window.addEventListener("keydown", e => {
    inputDirection = { x: 0, y: 1 };
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case "ArrowDown":
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case "ArrowLeft":
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case "ArrowRight":
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }
});

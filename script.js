function addNote() {
    let noteText = document.getElementById('noteInput').value;
    if (noteText.trim() !== '') {
        let note = createNoteElement(noteText);
        document.body.appendChild(note);
        makeDraggable(note);
        saveNoteToStorage(noteText);
        document.getElementById('noteInput').value = '';
    } else {
        alert('Please add text');
    }
}

function removeLastNote() {
    let notes = document.getElementsByClassName('note');
    if (notes.length > 0) {
        let lastNote = notes[notes.length - 1];
        lastNote.remove();
        removeLastNoteFromStorage();

        if (gameContainer.style.display !== "none") {
            gameContainer.style.display = "none";
    }
}
}

function createNoteElement(noteText) {
    let note = document.createElement('div');
    note.className = 'note';
    note.innerHTML = noteText;
    return note;
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.style.position = 'absolute';
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = e.clientX;
        pos2 = e.clientY;
        let element = e.target;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        function elementDrag(e) {
            e.preventDefault();
            pos3 = pos1 - e.clientX;
            pos4 = pos2 - e.clientY;
            pos1 = e.clientX;
            pos2 = e.clientY;

            element.style.top = (element.offsetTop - pos4) + 'px';
            element.style.left = (element.offsetLeft - pos3) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

function saveNoteToStorage(note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function removeLastNoteFromStorage() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    if (notes.length > 0) {
        notes.pop();
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function loadNotesFromStorage() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        let newNote = createNoteElement(note);
        document.body.appendChild(newNote);
        makeDraggable(newNote);
    });
}

loadNotesFromStorage();


const gameContainer = document.getElementById("gameContainer");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");


document.body.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("note") && e.target.innerText === ".snake") {
        gameContainer.style.display = "block"; 
        startSnakeGame();
    }
});

    // THE SNAKE GAME ISNT MY CODE

function startSnakeGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const box = 20;
    const canvasSize = 400;
    let snake = [{ x: 200, y: 200 }];
    let food = { x: 0, y: 0 };
    let score = 0;
    let dx = 0;
    let dy = 0;

    function drawSnakePart(snakePart) {
        ctx.fillStyle = "green";
        ctx.fillRect(snakePart.x, snakePart.y, box, box);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snakePart.x, snakePart.y, box, box);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function drawFood() {
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    function update() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        const ateFood = snake[0].x === food.x && snake[0].y === food.y;

        if (ateFood) {
            score += 10;
            createFood();
        } else {
            snake.pop();
        }
    }

    function createFood() {
        food.x = Math.floor(Math.random() * (canvasSize / box)) * box;
        food.y = Math.floor(Math.random() * (canvasSize / box)) * box;
    }

    function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvasSize ||
        snake[0].y < 0 ||
        snake[0].y >= canvasSize
    ) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            clearInterval(game);
            alert("Game Over! Your score: " + score);
        }
    }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        drawSnake();
        drawFood();
        drawScore();
        update();
        checkCollision();
    }

    createFood();
    let game = setInterval(gameLoop, 100);

    document.addEventListener("keydown", (e) => {
        const keyPressed = e.key;
        if (keyPressed === "ArrowLeft" && dx !== box) {
            dx = -box;
            dy = 0;
        }
        if (keyPressed === "ArrowRight" && dx !== -box) {
            dx = box;
            dy = 0;
        }
        if (keyPressed === "ArrowUp" && dy !== box) {
            dx = 0;
            dy = -box;
        }
        if (keyPressed === "ArrowDown" && dy !== -box) {
            dx = 0;
            dy = box;
        }
    });
}
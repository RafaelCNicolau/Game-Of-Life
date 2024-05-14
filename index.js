const canvas = document.getElementById("canvas");
if (canvas.getContext) {
  const blockSize = 30;
  const boardSize = 25;
  canvas.width = blockSize * boardSize;
  canvas.height = blockSize * boardSize;
  const ctx = canvas.getContext("2d");

  let board = new Array(boardSize)
    .fill(null)
    .map(() => new Array(boardSize).fill(0));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const xPos = i * blockSize;
        const yPos = j * blockSize;

        ctx.strokeStyle = "black";
        ctx.strokeRect(xPos, yPos, blockSize, blockSize);
        if (board[i][j] === 1) {
          ctx.fillStyle = "blue";
          ctx.fillRect(xPos, yPos, blockSize, blockSize);
        }
      }
    }
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cellX = Math.floor(x / blockSize);
    const cellY = Math.floor(y / blockSize);

    board[cellX][cellY] = board[cellX][cellY] == 1 ? 0 : 1;
    draw();
  });

  function getCellValue(i, j) {
    if (i < 0 || i >= boardSize || j < 0 || j >= boardSize) return 0;
    return board[i][j];
  }

  function checkSurroundingCells(i, j) {
    let count = 0;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        if (getCellValue(i + x, j + y) === 1) count++;
      }
    }
    return count;
  }

  function updateGame() {
    const newBoard = new Array(boardSize)
      .fill(null)
      .map(() => new Array(boardSize).fill(0));
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const surroundingCells = checkSurroundingCells(i, j);
        if (surroundingCells < 2 || surroundingCells >= 4) {
          newBoard[i][j] = 0;
        } else if (surroundingCells === 3) {
          newBoard[i][j] = 1;
        } else {
          newBoard[i][j] = board[i][j];
        }
      }
    }
    board = newBoard;
  }
  function rules(b, i, j) {
    const surroundingCells = checkSurroundingCells(i, j);

    if (surroundingCells < 2) {
      b[i][j] = 0;
    }

    if (surroundingCells >= 4) {
      b[i][j] = 0;
    }

    if (surroundingCells === 3) {
      b[i][j] = 1;
    }
  }

  function game() {
    updateGame();
    draw();
  }
  let nInterval;
  function play() {
    nInterval = setInterval(game, 100);
  }
  function reset() {
    stop();
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        board[i][j] = 0;
      }
    }
    draw();
  }
  function stop() {
    clearInterval(nInterval);
  }
}
draw();

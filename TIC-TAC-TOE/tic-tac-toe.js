let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let cells = document.querySelectorAll(".cell");
let status = document.getElementById("status");
let resetBtn = document.getElementById("resetBtn");

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function handleCellClick(event){

    let cell = event.target;
    let index = cell.getAttribute("data-index");

    if(board[index] !== "" || !gameActive){
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.classList.add("taken");

    checkResult();
}

function checkResult(){

    let roundWon = false;
    let winningCells = [];

    for(let i = 0; i < winningCombos.length; i++){

        let [a, b, c] = winningCombos[i];

        if(board[a] !== "" && board[a] === board[b] && board[b] === board[c]){
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if(roundWon){
        status.textContent = "Player " + currentPlayer + " wins!";
        gameActive = false;

        winningCells.forEach(function(index){
            cells[index].classList.add("win");
        });

        return;
    }

    if(!board.includes("")){
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = "Player " + currentPlayer + "'s turn";
}

function resetGame(){

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    status.textContent = "Player X's turn";

    cells.forEach(function(cell){
        cell.textContent = "";
        cell.classList.remove("x", "o", "taken", "win");
    });
}

cells.forEach(function(cell){
    cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", resetGame);

/* Tic Tac Toe */

/* The board is represented with an array of 9 spaces
    By index:
            0 1 2
            3 4 5
            6 7 8

Each space is an object that know if its occupied and by what.*/




// Module pattern for the gameboard since we only need to create one.
const gameBoard = function () {

    const board = [];

    const checkWin = (symbol) => {

        // All possible subsets that lead to a win if they all have the same value: (a 2D array would probably be a better approach to be more scalable)
        const winningSets = [
            [0, 1, 2], // First row
            [3, 4, 5], // Second row
            [6, 7, 8], // Third row
            [0, 3, 6], // First column
            [1, 4, 7], // Second column
            [2, 5, 8], // Third column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6]  // Diagonal top-right to bottom-left
        ];

        // Check each potential winning combination
        for (let i = 0; i < winningSets.length; i++) {
            // try out some destructuring!
            const [a, b, c] = winningSets[i];

            if (board[a].getPiece() === symbol && board[b].getPiece() === symbol && board[c].getPiece() === symbol) {
                return true; // Player wins
            }
        }
        return false; // No winner yet
    };



    const isGameOver = (symbol) => {

        if (checkWin(symbol)) {
            return true;
        }

        // Check if board is filled
        if (board.every(space => space.hasPiece())) {
            return true; // Tie
        }

        return false; // No winner yet
    };

    const initBoard = function () {
        for (let i = 0; i < 9; i++) {
            board.push(createSpace());
        }

        clearBoard();

    };

    const clearBoard = () => {
        board.forEach((space, index) => {
            space.placeMarker(``);
        })
    }

    const createSpace = function () {
        // default to empty string;
        let marker = "";
        const placeMarker = (mark) => (marker = mark);
        const hasPiece = () => (marker === '{ }' || marker === ';');
        const getPiece = () => (marker);

        return { placeMarker, hasPiece, getPiece }
    };

    initBoard();

    return { board, clearBoard, isGameOver, initBoard };;

}();




// Factory pattern for players since we'll need to create multiple.
function createPlayer(name, symbol) {
    let score = 0;

    const increaseScore = () => score++;
    const resetScore = () => score = 0;
    const getScore = () => `${name}'s Score: ${score}`;

    const getName = () => name;
    const getSymbol = () => symbol;

    console.log(`${name} will be ${symbol}`);
    return { getName, getSymbol, increaseScore, resetScore, getScore, getName };
}

// Mediator-type module for the game logic
const playGame = (() => {

    let turnCount = 1;

    const incrementTurnCount = () => turnCount++;

    // actual board represented as an array
    const board = gameBoard;


    // Create players and wrap them up nicely in an object
    const players = (() => {
        let player1Name = "player1";
        let player2Name = "player2";
        const player1 = createPlayer(player1Name, '{ }');
        const player2 = createPlayer(player2Name, ';');

        return { player1, player2 };

    })();

    function endGame(stats, player) {


        console.log('****************');
        console.log("Game over!");
        console.log("Results:");

        if (stats.gameStatus == "win") {
            console.log(`${player.getName()} wins!`);
        } else if (stats.gameStatus === "tie") {
            console.log("It's a tie!");
        }
    }

    // handle turn
    function takeTurn(player) {

        let picking = true;

        while (picking) {

            let target = Math.floor(Math.random() * 9);

            if (!board.board[target].hasPiece()) {
                board.board[target].placeMarker(player.getSymbol());
                picking = false;

            } else {
                console.log("This space already has a piece, choose again!");
            }
        }
        return checkGameStatus(player);
    }

    function checkGameStatus(player) {


        if (board.isGameOver(player.getSymbol())) {
            let stats = { "gameStatus": "win" };
            endGame(stats, player);
            return true;
        }

        return false;
    }

    function runGame() {


        display.refreshGameBoard();


        let playing = true;

        while (playing) {

            console.log(`Turn: ${turnCount}`);

            console.log('---------------');

            // player1 take turn - true if game ends after turn
            if (takeTurn(players.player1)) {
                playing = false;
                break;
            }
            display.refreshGameBoard();

            // player2 take turn 
            if (takeTurn(players.player2)) {
                playing = false;
                break;
            }
            display.refreshGameBoard();

            incrementTurnCount();

        }
    }

    return { runGame, incrementTurnCount };

})();




// UI Module
const display = (() => {

    // Controls
    const newGameButton = document.getElementById("new-game");
    const newGamePopUp = document.getElementById("popup");
    const startGameButton = document.getElementById('start-game');
    const cancelButton = document.getElementById('cancel');

    // Player info
    const p1Score = document.getElementById('p1-score');
    const p2Score = document.getElementById('p2-score');

    // Gameboard
    const gameBoardDisplay = document.querySelector('.game-board');


    gameBoardDisplay.addEventListener('click', (event) => {
        console.log(event.target.id);

        // id format: "space-#"
        const spaceIndex = parseInt(event.target.id.split('-')[1]);
        console.log("spaceIndexString:", spaceIndex);

        if (!gameBoard.board[spaceIndex].hasPiece()) {

            // player 1 - evens, player 2 - odds
            const currentPlayer = turnCount % 2 === 0 ? players.player1 : players.player2;
            gameBoard.board[spaceIndex].placeMarker(currentPlayer.getPiece());
            display.refreshGameBoard(); // refresh UI

            playGame.incrementTurnCount();

        } else {

            console.log("space taken!");

        }
    })


    newGameButton.addEventListener('click', () => {
        newGamePopUp.showModal();
    });

    startGameButton.addEventListener('click', () => {
        newGameButton.textContent = "Reset Game";
        setPlayerNames();
        p1Score.textContent = 0;
        p2Score.textContent = 0;
    });

    function setPlayerNames() {
        const p1Name = document.getElementById('p1-display-name');
        const p2Name = document.getElementById('p2-display-name');

        const p1input = document.getElementById('p1-name').value;
        const p2input = document.getElementById('p2-name').value;

        p1Name.textContent = p1input;
        p2Name.textContent = p2input;
    }

    cancelButton.addEventListener('click', () => {
        newGamePopUp.close();
    });


    const refreshGameBoard = () => {

        gameBoardDisplay.innerHTML = "";

        gameBoard.board.forEach((item, index) => {
            const space = document.createElement('div');
            space.id = `space-${index}`;
            space.classList.add("space");

            space.setAttribute('data-marker', gameBoard.board[index].getPiece());

            gameBoardDisplay.appendChild(space);

        });
    }


    return { refreshGameBoard };

})();

playGame.runGame();
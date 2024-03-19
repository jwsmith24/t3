/* Tic Tac Toe */

// Module pattern for the gameboard since we only need to create one.
const gameBoard = function () {

    const board = [];

    const getBoard = () => board;

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
            return { status: "win" };
        }

        // Check if board is filled
        if (board.every(space => space.hasPiece())) {
            return { status: "tie" }; // Tie
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

    // ensure board is initialized first
    initBoard();

    return { getBoard, clearBoard, isGameOver, initBoard };;

}();




// Factory pattern for players since we'll need to create multiple.
function createPlayer(name, symbol) {
    let score = 0;

    const increaseScore = () => score++;
    const resetScore = () => score = 0;
    const getScore = () => score;

    const getName = () => name;
    const getSymbol = () => symbol;

    const setName = (nickName) => {
        name = nickName;
        console.log(`Name changed to ${getName()}`);
    }

    console.log(`${name} will be ${symbol}`);
    return { getName, getSymbol, increaseScore, resetScore, getScore, getName, setName };
}

// Mediator-type module for the game logic
const playGame = (() => {

    let roundCount = 1;

    const getRound = () => roundCount;
    const getPlayers = () => players;

    const incrementRoundCount = () => roundCount++;


    // actual board represented as an array
    const board = gameBoard.getBoard();
    const boardOptions = gameBoard;


    // Create players and wrap them up nicely in an object
    const players = (() => {
        let player1Name = "Player 1";
        let player2Name = "Player 2";
        const player1 = createPlayer(player1Name, '{ }');
        const player2 = createPlayer(player2Name, ';');

        return { player1, player2 };

    })();




    // Checks all the potential winning subsets to see if all values match a player's symbol.
    function checkGameStatus(player) {

        const result = boardOptions.isGameOver(player.getSymbol());

        if (result.status === "win") {
            return { "gameStatus": "win", player };

        } else if (result.status === "tie") {
            return { "gameStatus": "tie", player };
        }

        return { "gameStatus": "playing", player };
    };

    return { getRound, incrementRoundCount, getPlayers, checkGameStatus };

})();


// UI Module
const display = (() => {

    // Controls
    const newGameButton = document.getElementById("new-game");

    const newGamePopUp = document.getElementById("start-popup");
    const startGameButton = document.getElementById('start-game');
    const cancelButton = document.getElementById('cancel');

    const endGamePopup = document.getElementById('end-popup');
    const gameOverButton = document.getElementById('game-over-button');
    const gameOverCloseButton = document.getElementById('game-over-cancel');

    // Player info
    const p1Name = document.getElementById('p1-display-name');
    const p2Name = document.getElementById('p2-display-name');
    const players = playGame.getPlayers();

    // Gameboard
    const gameBoardDisplay = document.querySelector('.game-board');
    const board = gameBoard.getBoard();
    const boardOptions = gameBoard;


    gameBoardDisplay.addEventListener('click', (event) => {
        // pull in players
        const players = playGame.getPlayers();
        console.log(players);

        // id format: "space-#"
        const spaceIndex = parseInt(event.target.id.split('-')[1]);
        // player 1 - evens, player 2 - odds
        const currentPlayer = playGame.getRound() % 2 === 0 ? players.player1 : players.player2;

        if (!board[spaceIndex].hasPiece()) {

            board[spaceIndex].placeMarker(currentPlayer.getSymbol());
            refreshGameBoard(); // refresh UI
            playGame.incrementRoundCount();

        } else {
            // add a red flash on the space
            console.log("space taken!");

        }

        // Check for end of game.
        const result = playGame.checkGameStatus(currentPlayer);
        const results = document.getElementById('results');


        if (result.gameStatus === "win") {
            results.textContent = `${result.player.getName()} wins!`
            updateScore(result.player);

            endGamePopup.showModal();
        }

    });

    newGameButton.addEventListener('click', () => {
        newGamePopUp.showModal();

    });

    startGameButton.addEventListener('click', (e) => {
        e.preventDefault();
        setPlayerNames();
        newGameButton.textContent = "Reset Game";
        startGame();
        newGamePopUp.close();
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        clearInputs();

        newGamePopUp.close();
    });

    gameOverButton.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
        endGamePopup.close();

    });

    gameOverCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        endGamePopup.close();
    });

    function startGame() {

        resetBoard();
        clearInputs();
    };

    function resetScore() {
        const p1Score = document.getElementById('p1-score');
        const p2Score = document.getElementById('p2-score');
        p1Score.textContent = 0;
        p2Score.textContent = 0;
    }

    function updateScore(player) {
        const p1Score = document.getElementById('p1-score');
        const p2Score = document.getElementById('p2-score');

        player.increaseScore();
        const newScore = player.getScore();

        if (player.getSymbol() === ';') {
            p2Score.textContent = newScore;

        } else {
            p1Score.textContent = newScore;
        }




    }

    function setPlayerNames() {
        const p1input = document.getElementById('p1-name');
        const p2input = document.getElementById('p2-name');

        p1Name.textContent = p1input.value;
        players.player1.setName(p1input.value);
        p2Name.textContent = p2input.value;
        players.player2.setName(p2input.value);

    }

    function clearInputs() {
        const p1input = document.getElementById('p1-name');
        const p2input = document.getElementById('p2-name');

        p1input.value = '';
        p2input.value = '';


    };

    // Clear the array and upate the display
    const resetBoard = () => {
        boardOptions.clearBoard();
        refreshGameBoard();


    };


    const refreshGameBoard = () => {

        gameBoardDisplay.innerHTML = "";

        board.forEach((item, index) => {

            const space = document.createElement('div');
            space.id = `space-${index}`;
            space.classList.add("space");

            space.setAttribute('data-marker', board[index].getPiece());

            gameBoardDisplay.appendChild(space);

        });
    };


    return { refreshGameBoard };

})();

display.refreshGameBoard();
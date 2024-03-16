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

    const isGameOver = (symbol) => {

        // Look for winning combinations
        const winningSets = [
            [board[0], board[1], board[2]], // First row
            [board[3], board[4], board[5]], // Second row
            [board[6], board[7], board[8]], // Third row
            [board[0], board[3], board[6]], // First column
            [board[1], board[4], board[7]], // Second column
            [board[2], board[5], board[8]], // Third column
            [board[0], board[4], board[8]], // Diagonal top-left to bottom-right
            [board[2], board[4], board[6]]  // Diagonal top-right to bottom-left
        ];

        // Check each potential winning combination
        for (let i = 0; i < winningSets.length; i++) {

            // use destructuring to keep it clean!
            const [a, b, c] = winningSets[i];
            if (a.getPiece() === symbol && b.getPiece() === symbol && c.getPiece() === symbol) {
                return true; // Player wins
            }
        }

        return false; // No winner yet
    };

    const initBoard = function () {
        for (let i = 0; i < 9; i++) {
            board.push(createSpace());
        }

        clearBoard();

    };

    const displayBoard = () => {

        let row1 = '', row2 = '', row3 = '';
        board.forEach((space, index) => {

            if (index <= 2) {
                row1 += `${space.getPiece()} `;
            } else if (index > 2 && index < 6) {
                row2 += `${space.getPiece()} `;
            } else {
                row3 += `${space.getPiece()} `;
            }
        })
        console.log(row1);
        console.log(row2);
        console.log(row3);
    };

    const clearBoard = () => {
        board.forEach((space, index) => {
            space.placeMarker(`_`);
        })
    }

    const createSpace = function () {
        // default to empty string;
        let marker = "";
        const placeMarker = (mark) => (marker = mark);
        const hasPiece = () => (marker === 'X' || marker === 'O');
        const getPiece = () => (marker);

        return { placeMarker, hasPiece, getPiece }
    };

    // Place spaces onto the board, don't need to expose this.
    initBoard();

    return { board, clearBoard, displayBoard, isGameOver };;

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


    const board = gameBoard;

    // Create players and wrap them up nicely in an object
    const players = (() => {
        let player1Name = "player1";
        let player2Name = "player2";
        const player1 = createPlayer(player1Name, 'X');
        const player2 = createPlayer(player2Name, 'O');

        return { player1, player2 };

    })();

    function endGame(stats, player) {

        board.displayBoard();
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
                console.log("Space already has a piece, choose again!");
            }
        }
        return checkGameStatus(player);
    }

    function checkGameStatus(player) {

        if (board.isGameOver(player.getSymbol())) {
            let stats = { "gameStatus": "win" };
            endGame(stats, player);
            return true
        }

        return false;
    }

    function runGame() {

        let playing = true;
        let turnCount = 1;
        while (playing) {

            console.log(`Turn: ${turnCount}`);
            board.displayBoard();
            console.log('---------------');

            // player1 take turn - true if game ends after turn
            if (takeTurn(players.player1)) {
                break;
            }

            // player2 take turn 
            if (takeTurn(players.player2)) {
                break;
            }

            // end game when board is full after 9 turns
            if (turnCount === 9) {
                playing = false;
                let status = { "gameStatus": "tie" };
                endGame(status)
            }

            turnCount++;
        }
    }

    runGame();

})();

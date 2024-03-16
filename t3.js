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
        const r1 = board.slice(0, 3);
        const r2 = board.slice(3, 6);
        const r3 = board.slice(6, 9);
        const rows = [r1, r2, r3];

        const c1 = [board[0], board[3], board[6]];
        const c2 = [board[1], board[4], board[7]];
        const c3 = [board[2], board[5], board[8]];
        const cols = [c1, c2, c3];

        const d1 = [board[0], board[4], board[8]];
        const d2 = [board[6], board[4], board[2]];
        const diags = [d1, d2];

        // check rows
        for (let row = 0; row < rows.length; row++) {
            if (row[0] == symbol && row[1] == symbol && row[2] == symbol) {
                return true;
            }
        }

        // check columns
        for (let col = 0; col < cols.length; col++) {
            if (col[0] == symbol && col[1] == symbol && col[2] == symbol) {
                return true;
            }
        }

        // check diagnols
        for (let diag = 0; diag < diags.length; diag++) {
            if (diag[0] == symbol && diag[1] == symbol && diag[2] == symbol) {
                return true;
            }
        }

        return false;


    }

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
            space.placeMarker(`${index}`);
        })
    }

    const createSpace = function () {
        // default to empty string;
        let marker = "";
        const placeMarker = (mark) => (marker = mark);
        const hasPiece = () => (marker !== "");
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


    // handle turn
    function takeTurn(player, target) {

        let picking = true;

        while (picking) {
            if (!board.board[target].hasPiece()) {
                board.board[target].placeMarker(player.getSymbol());
                picking = false;

            } else {
                console.log("Space already has a piece, choose again!");
            }
        }



        // check if any win conditions exist

    }

    function endGame() {
        console.log("Game over!");
        console.log("Winner");
    }

    function runGame() {

        let playing = true;
        let turnCount = 1;
        while (playing) {

            console.log(`Turn: ${turnCount}`);
            board.displayBoard();
            console.log('---------------');

            // player1 take turn
            // check win condition
            if (board.isGameOver(players.player1.getSymbol())) {
                playing = false;
                break;

            }
            // player2 take turn 
            // check win condition
            if (board.isGameOver(players.player2.getSymbol())) {
                playing = false;
                break;
            }

            if (turnCount === 9) {
                console.log("It's a tie!")
                playing = false;
            }

            turnCount++;
        }
    }

    runGame();

})();

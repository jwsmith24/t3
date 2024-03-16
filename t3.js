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

    return { board, clearBoard, displayBoard };;

}();


gameBoard.displayBoard();







// Mediator-type module for the game logic
const playGame = (() => {


    // Factory pattern for players since we'll need to create multiple, but inside the module.
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

    // wrap up players in an object
    const players = (() => {
        let player1Name = "player1";
        let player2Name = "player2";
        const player1 = createPlayer(player1Name, 'X');
        const player2 = createPlayer(player2Name, 'O');

        return { player1, player2 };

    })();







})();

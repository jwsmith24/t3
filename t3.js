/* Tic Tac Toe */

/* The board is represented with an array of 9 spaces
    By index:
            0 1 2
            3 4 5
            6 7 8

Each space is an object that know if its occupied and by what.*/

// Module pattern for the gameboard since we only need to access it once.
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
        board.forEach((space) => {
            space.placeMarker('_');
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



// Player constructor
// Players enter their name, choose the symbol they want to use, and choose their color.
function createPlayer(name, symbol, color) {

    const rollDice = () => {
        console.log("rolllllllling!");
    }
    return { name, symbol, color, rollDice };
}


const player1 = createPlayer("p1", "%", "blue");
console.log(player1);
player1.rollDice();


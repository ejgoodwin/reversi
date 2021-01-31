'use strict';

const boardEl = document.querySelector('.board');
let board = [
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0]
]

// Create board
function createBoard() {
	board.forEach((row, index) => {
		const boardRow = document.createElement('div');
		boardRow.classList.add('board-row', `board-row--${index}`);
		row.forEach((item, index) => {
			const square = document.createElement('button');
			square.classList.add('board-square', `board-square--${index}`);
			boardRow.appendChild(square);
		})
		boardEl.appendChild(boardRow)
	})
}

// Initial state
function startGame() {
	// get squares
	const squares_3_3 = document.querySelector('.board-row--3 .board-square--3');
	const squares_3_4 = document.querySelector('.board-row--3 .board-square--4');
	const squares_4_3 = document.querySelector('.board-row--4 .board-square--3');
	const squares_4_4 = document.querySelector('.board-row--4 .board-square--4');
	// assign colours
	squares_3_3.classList.add('square-black');
	squares_3_4.classList.add('square-white');
	squares_4_3.classList.add('square-white');
	squares_4_4.classList.add('square-black');
	// assign values to board array
	board[3][3] = 'b';
	board[3][4] = 'w';
	board[4][3] = 'w';
	board[4][4] = 'b';
}

// find available moves
function availableMoves(player) {
	// find black counter
	// check all directions for white
	// if white counter, check again until clear space

	board.forEach((row, rowIndex) => {
		row.forEach((square, squareIndex) => {
			if (square === player) {
				checkNorth(player, rowIndex, squareIndex);
				checkSouth(player, rowIndex, squareIndex);
				checkEast(player, rowIndex, squareIndex);
				checkWest(player, rowIndex, squareIndex);
				// checkSouthEast(player, rowIndex, squareIndex);
				// checkSouthWest(player, rowIndex, squareIndex);
				// checkNorthWest(player, rowIndex, squareIndex);
				// checkNorthEast(player, rowIndex, squareIndex);
			}
		});
	});
}

function checkEast(player, rowIndex, squareIndex) {
	squareIndex += 1;
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = squareIndex; squareIndex < board[rowIndex].length; squareIndex++) {
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				console.log(`available move: ${rowIndex}, ${squareIndex}`);
				const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
				availableMove.classList.add('available-move');
				break;
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkNorth(player, rowIndex, squareIndex) {
	rowIndex -= 1;
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = rowIndex; rowIndex > 0; rowIndex--) {
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				console.log(`available move: ${rowIndex}, ${squareIndex}`);
				const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
				availableMove.classList.add('available-move');
				break;
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkSouth(player, rowIndex, squareIndex) {
	rowIndex += 1;
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = rowIndex; rowIndex < 7; rowIndex++) {
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				console.log(`available move: ${rowIndex}, ${squareIndex}`);
				const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
				availableMove.classList.add('available-move');
				break;
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkWest(player, rowIndex, squareIndex) {
	squareIndex -= 1;
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {

		for (let i = squareIndex; squareIndex > 0; squareIndex--) {
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				console.log(`available move: ${rowIndex}, ${squareIndex}`);
				const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
				availableMove.classList.add('available-move');
				break;
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

createBoard();
startGame();
availableMoves('b');

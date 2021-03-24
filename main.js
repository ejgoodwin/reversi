'use strict';

const boardEl = document.querySelector('.board');
const playerTag = document.querySelector('.players-turn');
let board = [
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0]
];
let currentPlayer = 'b';

//let eastFlip = [];
let southFlip = [];
let westFlip = [];
let northFlip = [];

// Create board
function createBoard() {
	board.forEach((row, index) => {
		const boardRow = document.createElement('div');
		const boardRowNum = index;
		boardRow.classList.add('board-row', `board-row--${index}`);
		row.forEach((item, index) => {
			const square = document.createElement('button');
			square.classList.add('board-square', `board-square--${index}`);
			square.dataset.available = 'not_available';
			square.dataset.row = boardRowNum;
			square.dataset.col = index;
			boardRow.appendChild(square);
		})
		boardEl.appendChild(boardRow)
	})
}

// Initial state
function startGame() {
	// assign values to board array.
	board[3][3] = 'b';
	board[3][4] = 'w';
	board[3][5] = 'w';
	board[4][3] = 'w';
	board[4][4] = 'b';

	// Who's go
	playerTag.innerHTML = currentPlayer;
	console.log('currentPlayer ' + currentPlayer);

	// add classes to squares to colour them.
	colourSquares();

	// show available moves.
	availableMoves(currentPlayer);
}

function colourSquares() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j] === 'b') {
				const flipit = document.querySelector(`.board-row--${i} .board-square--${j}`);
				flipit.classList.remove('square-white');
				flipit.classList.add('square-black');
			} else if (board[i][j] === 'w') {
				const flipit = document.querySelector(`.board-row--${i} .board-square--${j}`);
				flipit.classList.remove('square-black');
				flipit.classList.add('square-white');
			}
		}
	}
}

// Add event listener to buttons.
function initButtons() {
	const boardButtonsArr = document.querySelectorAll('.board-square');
	boardButtonsArr.forEach((button) => {
		button.addEventListener('click', (e) => handleSquareClick(e));
	});
}

function nextPlayer() {
	if (currentPlayer === 'b') {
		currentPlayer = 'w';
	} else {
		currentPlayer = 'b';
	}
}

function handleSquareClick(e) {
	let clickedSquare = e.target;
	const clickedRow = clickedSquare.dataset.row;
	const clickedCol = clickedSquare.dataset.col;
	// console.log(clickedSquare.dataset.col);
	if (clickedSquare.dataset.available === 'available') {
		// find all squares that need to flip
		checkEast(currentPlayer, clickedRow, clickedCol, true);
		//checkSouth(currentPlayer, clickedRow, clickedCol, true);
		checkWest(currentPlayer, clickedRow, clickedCol, true);
		checkNorth(currentPlayer, clickedRow, clickedCol, true);

		// Switch to next player
		nextPlayer();
		playerTag.innerHTML = currentPlayer;
		console.log('currentPlayer ' + currentPlayer);

		resetAvailableMoves();
		availableMoves(currentPlayer);
		console.log(clickedSquare);	
	}
}

function resetAvailableMoves() {
	const availableMoves = document.querySelectorAll('[data-available="available"]');
	availableMoves.forEach((item) => {
		item.dataset.available = 'not_available';
		item.dataset.direction = '';
	})
}

function flipSquares(coords) {
	coords.forEach((item) => {
		board[item.rowIndex][item.squareIndex] = currentPlayer;
	});
	colourSquares();
}

// find available moves
function availableMoves(player) {
	console.log(player)
	// find player's counter
	// check all directions for opponent
	// if opponent counter, check again until clear space

	board.forEach((row, rowIndex) => {
		row.forEach((square, squareIndex) => {
			if (square === player) {
				checkNorth(player, rowIndex, squareIndex, false);
				checkSouth(player, rowIndex, squareIndex, false);
				checkEast(player, rowIndex, squareIndex, false);
				checkWest(player, rowIndex, squareIndex, false);
				// checkSouthEast(player, rowIndex, squareIndex);
				// checkSouthWest(player, rowIndex, squareIndex);
				// checkNorthWest(player, rowIndex, squareIndex);
				// checkNorthEast(player, rowIndex, squareIndex);
			}
		});
	});
}

function checkEast(player, rowIndex, squareIndex, flipping) {
	squareIndex += 1;
	// If next square does is the opponent's.
	let eastFlip = [];
	if (board[rowIndex][squareIndex] != player 
		&& board[rowIndex][squareIndex] != 0) {
		// Loop over row to find which squares can be flipped.
		for (let i = squareIndex; squareIndex < board[rowIndex].length; squareIndex++) {
			// Track squares that will need to be flipped.
			eastFlip.push({rowIndex, squareIndex});
			// When you reach an available square. 
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				console.log(`available move: ${rowIndex}, ${squareIndex}`);
				if (flipping) {
					console.log('east' + eastFlip);
					flipSquares(eastFlip);
					break;
				} else {
					const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
					availableMove.classList.add('available-move');
					availableMove.dataset.available = 'available';
					availableMove.dataset.direction = 'east';
					break;
				}
				
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkNorth(player, rowIndex, squareIndex, flipping) {
	rowIndex -= 1;
	let northFlip = [];
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = rowIndex; rowIndex > 0; rowIndex--) {
			northFlip.push({rowIndex, squareIndex});
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				if (flipping) {
					console.log('north' + northFlip);
					flipSquares(northFlip);
					break;
				} else {
					console.log(`available move: ${rowIndex}, ${squareIndex}`);
					const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
					availableMove.classList.add('available-move');
					availableMove.dataset.available = 'available';
					availableMove.dataset.direction = 'north';
					break;
				}
				
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkSouth(player, rowIndex, squareIndex, flipping) {
	rowIndex += 1;
	let southFlip = [];
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = rowIndex; rowIndex < 7; rowIndex++) {
			southFlip.push({rowIndex, squareIndex});
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				if (flipping) {
					console.log('south' + southFlip);
					flipSquares(southFlip);
					break;
				} else { 
					console.log(`available move: ${rowIndex}, ${squareIndex}`);
					const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
					availableMove.classList.add('available-move');
					availableMove.dataset.available = 'available';
					availableMove.dataset.direction = 'south';
					break;
				}
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

function checkWest(player, rowIndex, squareIndex, flipping) {
	squareIndex -= 1;
	let westFlip = [];
	if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] != 0) {
		for (let i = squareIndex; squareIndex > 0; squareIndex--) {
			westFlip.push({rowIndex, squareIndex});
			if (board[rowIndex][squareIndex] != player && board[rowIndex][squareIndex] === 0) {
				if (flipping) {
					console.log('west' + westFlip);
					flipSquares(westFlip);
					break;
				} else { 
					console.log(`available move: ${rowIndex}, ${squareIndex}`);
					const availableMove = document.querySelector(`.board-row--${rowIndex} .board-square--${squareIndex}`)
					availableMove.classList.add('available-move');
					availableMove.dataset.available = 'available';
					availableMove.dataset.direction = 'west';
					break;
				}
			} else if (board[rowIndex][squareIndex] == null) {
				break;
			}
		}
	}
}

createBoard();
startGame();
initButtons();

// TODO
// refactor 'check' functions to be able to check for available moves
// and also implement paths from clicked squares, 
// e.g. checkWest(player, rowIndex, squareIndex, flipping)
// flipping = true/false.


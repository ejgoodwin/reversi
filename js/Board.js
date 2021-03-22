// TODO: broken because of shallow/deep copying.
// 2d array will not be copied, so needs changing to 1d array.

import GameLogic from './GameLogic.js';
import Player from './Player.js';

class Board {
	constructor() {
		this.board = [
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,'b','b','w',0,0,0,
			0,0,0,'w','b',0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0
		];
		this.boardEl = document.querySelector('.board');
		this.currentPlayer = null;
		this.nextPlayer = null;
		this.player = new Player();
	}

	_renderBoard() {
		this.board.forEach((row, index) => {

			//Create square button.
			const square = document.createElement('button');
			// Add classes and data attributes.
			square.classList.add('board-square');
			square.dataset.position = index;
			// Add event listener.
			square.addEventListener('click', (e) => this._handleSquareClick(e));

			// row.forEach((item, index) => {
			// 	// Create square button.
			// 	const square = document.createElement('button');
			// 	// Add classes and data attributes.
			// 	square.classList.add('board-square');
			// 	square.dataset.position = `${boardRowNum}-${index}`;
			// 	// Add event listener.
			// 	square.addEventListener('click', (e) => this._handleSquareClick(e));
			// 	boardRow.appendChild(square);
			// });
			this.boardEl.appendChild(square);
		});
	}

	_handleSquareClick(e) {
		// Get clicked square's array index.
		const position = parseInt(e.target.dataset.position);

		// Check clicked square is available.
		if (this.board[position] != 0) {
			return;
		}

		const currentPlayer = this.player.returnCurrentPlayer();
		const nextPlayer = this.player.returnNextPlayer();

		const takeTurn = new GameLogic([...this.board], position, currentPlayer, nextPlayer);
		const newBoard = takeTurn.checkNextItem();
		
		if (newBoard) {
			this.board = newBoard;
			this._colourSquares();
			// Next player.
			this.player.changePlayer();
			console.log(currentPlayer);
		}
	}

	_colourSquares() {
		// Loop through board array to find the black and white positions.
		// Set data attribute for the squares should be black or white.
		//console.log(this.board)
		const squaresAll = document.querySelectorAll('.board-square')
		this.board.forEach((square, rowIndex) => {
			if (square === 'b') {
				squaresAll[rowIndex].dataset.player = 'b';
			} else if(square === 'w') {
				squaresAll[rowIndex].dataset.player = 'w';
			};
		});
	}

	checkWinner() {

	}

	init() {
		this._renderBoard();
		this._colourSquares();
	}
}

export default Board;
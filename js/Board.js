import GameLogic from './GameLogic.js';
import Player from './Player.js';

class Board {
	constructor() {
		this.board = [
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,'b','w',0,0,0,
			0,0,0,'w','b',0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0
		];
		this.prevBoard = [];
		this.boardEl = document.querySelector('.board');
		this.backButton = document.querySelector('.back-btn');
		this.player = new Player();
		this.wrongSquareEl = document.querySelector('.wrong-square');
		this.playerMessageEl = document.querySelector('.current-player');
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
			this.boardEl.appendChild(square);
		});

		this.backButton.addEventListener('click', this._handleBackButton.bind(this));
		this.updatePlayerMessage();
	}

	updatePlayerMessage() {
		this.playerMessageEl.dataset.player = this.player.getCurrentPlayer();
	}

	wrongSquareMessage() {
		this.wrongSquareEl.innerHTML = 'Square unavailable, try again!';
		setTimeout(() => {
			this.wrongSquareEl.innerHTML = '';
		}, 2000);
	}

	_handleBackButton() {
		console.log(this.board);
		console.log(this.prevBoard);
		// Assign the previous board to the current board.
		this.board = this.prevBoard;
		// Colour square to show prev (now current) board.
		this._colourSquares();
		// Switch player back.
		this.player.changePlayer();
		this.updatePlayerMessage();
		// Add `disabled` attribute to only allow one back move.
		this.backButton.setAttribute('disabled', true);
	}

	_handleSquareClick(e) {
		// Get clicked square's array index.
		const position = parseInt(e.target.dataset.position);
		// Check clicked square is available.
		if (this.board[position] != 0) {
			return;
		}

		const currentPlayer = this.player.getCurrentPlayer();
		const nextPlayer = this.player.getNextPlayer();
		const takeTurn = new GameLogic([...this.board], position, currentPlayer, nextPlayer);
		const newBoard = takeTurn.checkNextItem();
		// If the click results in a successful move, assign new board state to board.
		if (newBoard.successfulMove) {
			this.prevBoard = this.board;
			this.board = newBoard.newBoard;
			this._colourSquares();
			// Next player.
			this.player.changePlayer();
			this.updatePlayerMessage();
			console.log(currentPlayer);
		} else { // if clicked square is not available, show message.
			this.wrongSquareMessage();
		}

		// Enable back button.
		if (this.prevBoard.length > 0) {
			this.backButton.removeAttribute('disabled');
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
			} else if (square === 0) {
				squaresAll[rowIndex].dataset.player = '';
			}
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
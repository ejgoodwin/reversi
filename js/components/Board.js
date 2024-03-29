import BoardEvaluation from './BoardEvaluation.js';
import Player from './Player.js';
import gameConfig from '../gameConfig.js';

class Board {
	constructor() {
		this.game = document.querySelector('.game');
		this.boardEl = this.game.querySelector('.board');
		this.historyButtonBack = this.game.querySelector('[data-direction="back"]');
		this.historyButtonForward = this.game.querySelector('[data-direction="forward"]');
		this.wrongSquareEl = this.game.querySelector('.wrong-square');
		this.playerMessageEl = this.game.querySelector('.current-player');
		this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
		this.player = new Player();
		this.evaluate = new BoardEvaluation();
	}

	_renderBoard() {
		gameConfig.board.forEach((row, index) => {
			//Create square button.
			const square = document.createElement('button');
			// Add classes and data attributes.
			square.classList.add('board-square');
			square.dataset.position = index;
			// Add event listener.
			square.addEventListener('click', (e) => this._handleSquareClick(e));
			this.boardEl.appendChild(square);
		});
		// Add history button event listeners
		this.historyButtonBack.addEventListener('click', (e) => this._handleHistoryButton(e));
		this.historyButtonForward.addEventListener('click', (e) => this._handleHistoryButton(e));
		// Add available moves checkbox event listener
		this.toggleAvailableMoves.addEventListener('click', this._handleCheckbox.bind(this));
		this._updatePlayerMessage();
		gameConfig.addToPrevBoard(gameConfig.board);
	}

	_updatePlayerMessage() {
		this.playerMessageEl.dataset.player = gameConfig.currentPlayer;
	}

	_wrongSquareMessage() {
		this.wrongSquareEl.innerHTML = 'Square unavailable, try again!';
		setTimeout(() => {
			this.wrongSquareEl.innerHTML = '';
		}, 2000);
	}

	_handleHistoryButton(e) {
		if (e.target.dataset.direction === 'back') {
			gameConfig.gameHistory--;
		} else if (e.target.dataset.direction === 'forward') {
			gameConfig.gameHistory++;
		}

		// Add disabled for forward and back when you reach end or start of prevBoard array.
		if (gameConfig.gameHistory < gameConfig.prevBoard.length-1) {
			this.historyButtonForward.removeAttribute('disabled');
			this.boardEl.classList.add('board--locked');
		} else {
			this.historyButtonForward.setAttribute('disabled', '');
			this.boardEl.classList.remove('board--locked');

		}
		if (gameConfig.gameHistory === 0) {
			this.historyButtonBack.setAttribute('disabled', '');
		} else {
			this.historyButtonBack.removeAttribute('disabled');
		}
		// Assign the previous board to the current board.
		gameConfig.board = gameConfig.prevBoard[gameConfig.gameHistory];
		// Colour square to show prev (now current) board.
		this._colourSquares();
		// Switch player back.
		gameConfig.changePlayer();
		this._updatePlayerMessage();
		// Remove and reapply available squares.
		this._removeAvailableSquares();
		this._checkWinner();
	}

	_handleCheckbox() {
		if (this.toggleAvailableMoves.checked) {
			this.game.classList.add('show-hints');
		} else {
			this.game.classList.remove('show-hints');
		}
	}

	_handleSquareClick(e) {
		// Get clicked square's array index.
		gameConfig.selectedPosition = parseInt(e.target.dataset.position);
		// Check clicked square is available.
		if (gameConfig.board[gameConfig.selectedPosition] != 0) {
			return;
		}
		// Make a move.
		this._makeMove();
		// Enable back buttons.
		this.historyButtonBack.removeAttribute('disabled');
	}

	_makeMove() {
		const move = this.player.makeMove();
		// If move is successful -> colour squares, check for winner.
		if (move) {
			this._colourSquares();
			this._updatePlayerMessage();
			// Remove available square colours
			this._removeAvailableSquares();
			// Check if any winners.
			this._checkWinner();
			// Run again as computer player.
			if (!gameConfig.human) {
				setTimeout(() => {
					this._makeMove();
				}, 500);
				this._checkWinner();
			}
		} else { // if clicked square is not available, show message.
			this._wrongSquareMessage();
		}
	}

	_colourSquares() {
		// Loop through board array to find the black and white positions.
		// Set data attribute for the squares should be black or white.
		const squaresAll = document.querySelectorAll('.board-square');
		gameConfig.board.forEach((square, rowIndex) => {
			if (square === 'b') {
				squaresAll[rowIndex].dataset.player = 'b';
			} else if(square === 'w') {
				squaresAll[rowIndex].dataset.player = 'w';
			} else if (square === 0) {
				squaresAll[rowIndex].dataset.player = '';
			}
		});
	}

	_colourAvailableSquares(availableSquares) {
		const squaresAll = document.querySelectorAll('.board-square');
		availableSquares.forEach((available) => {
			squaresAll[available].dataset.available = true;
		});
	}

	_removeAvailableSquares() {
		const squaresAll = document.querySelectorAll('.board-square');
		squaresAll.forEach((square) => {
			square.dataset.available = false;
		});
	}

	_checkWinner() {
		const availableSquares = this.evaluate.evaluateBoard();
		this._colourAvailableSquares(availableSquares);
		// Find winner if no available squares.
		if (availableSquares.length === 0) {
			const results = this.evaluate.returnResult();
			this._displayResults(results);
		}
	}

	_displayResults(results) {
		console.log(results)
		const winnerEl = document.querySelector('.results');
		winnerEl.querySelector('.results-black').innerHTML = results.b;
		winnerEl.querySelector('.results-white').innerHTML = results.w;
		if (results['b'] === results['w']) {
			winnerEl.dataset.winner = 'draw';

		} else if (results['b'] > results['w']) {
			winnerEl.dataset.winner = 'black';
		} else {
			winnerEl.dataset.winner = 'white';
		}
		// Disable back button when there is a winner.
		// this.backButton.setAttribute('disabled', true);
		// this.forwardButton.setAttribute('disabled', true);
	}

	init() {
		this._renderBoard();
		this._colourSquares();
		this._checkWinner();
	}
}

export default Board;
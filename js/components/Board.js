import GameLogic from './GameLogic.js';
import Player from './Player.js';
import BoardEvaluation from './BoardEvaluation.js';

class Board {
	constructor() {
		this.game = document.querySelector('.game');
		// this.board = [
		// 	0,0,0,0,0,0,0,0,
		// 	0,0,0,0,0,0,0,0,
		// 	0,0,0,0,0,0,0,0,
		// 	0,0,0,'b','w',0,0,0,
		// 	0,0,0,'w','b',0,0,0,
		// 	0,0,0,0,0,0,0,0,
		// 	0,0,0,0,0,0,0,0,
		// 	0,0,0,0,0,0,0,0
		// ];
		this.board = {
			black: [{row:3, col:3}, {row:4, col:4}],
			white: [{row:3, col:4}, {row:4, col:3}]
		}
		this.prevBoard = [];
		this.boardEl = this.game.querySelector('.board');
		this.backButton = this.game.querySelector('.back-btn');
		this.wrongSquareEl = this.game.querySelector('.wrong-square');
		this.playerMessageEl = this.game.querySelector('.current-player');
		this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');

		this.player = new Player();
		this.currentPlayer = this.player.getCurrentPlayer();
		this.nextPlayer = this.player.getNextPlayer();
		
		this.evaluate = new BoardEvaluation();
		this.evaluate.setBoard(this.board);
		this.evaluate.setPlayers(this.currentPlayer, this.nextPlayer);
		this.evaluate.evaluateBoard();
	}

	_renderBoard() {
		for (let row = 0; row < 8; row++) {
			for(let col = 0; col < 8; col++) {
				//Create square button.
				const square = document.createElement('button');
				// Add classes and data attributes.
				square.classList.add('board-square');
				square.dataset.row = row;
				square.dataset.col = col;
				// Add event listener.
				square.addEventListener('click', (e) => this._handleSquareClick(e));
				this.boardEl.appendChild(square);
			}
			
		}
		// Add back button event listener
		this.backButton.addEventListener('click', this._handleBackButton.bind(this));
		// Add available moves checkbox event listener
		this.toggleAvailableMoves.addEventListener('click', this._handleCheckbox.bind(this));
		this._updatePlayerMessage();
	}

	_updatePlayerMessage() {
		this.playerMessageEl.dataset.player = this.player.getCurrentPlayer();
	}

	_wrongSquareMessage() {
		this.wrongSquareEl.innerHTML = 'Square unavailable, try again!';
		setTimeout(() => {
			this.wrongSquareEl.innerHTML = '';
		}, 2000);
	}

	_handleBackButton() {
		// Assign the previous board to the current board.
		this.board = this.prevBoard;
		// Colour square to show prev (now current) board.
		this._colourSquares();
		// Switch player back.
		this.player.changePlayer();
		this._updatePlayerMessage();
		// Add `disabled` attribute to only allow one back move.
		this.backButton.setAttribute('disabled', '');
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
		const positionRow = parseInt(e.target.dataset.row);
		const positionCol = parseInt(e.target.dataset.col);
		const position = {row:positionRow, col:positionCol};
		// console.log(position);
		// Check clicked square is available.
		const availBlack = this.board.black.find(item => item = position);
		const availWhite = this.board.white.find(item => item = position);
		if (availBlack || availWhite) { // if this combination exists in board -> this square is taken.
			return;
		}
		// Get player info.
		const currentPlayer = this.player.getCurrentPlayer();
		const nextPlayer = this.player.getNextPlayer();
		// Take a turn.
		const takeTurn = new GameLogic(currentPlayer, nextPlayer);
		takeTurn.setPosition(position);
		takeTurn.setBoard([...this.board]);
		const newBoard = takeTurn.checkNextItem();
		// If the click results in a successful move, assign new board state to board.
		if (newBoard.successfulMove) {
			this.prevBoard = this.board;
			this.board = newBoard.newBoard;
			this._colourSquares();
			// Next player.
			this.player.changePlayer();
			this._updatePlayerMessage();
			// Remove available square colours
			this._removeAvailableSquares();
			// console.log(currentPlayer);
		} else { // if clicked square is not available, show message.
			this._wrongSquareMessage();
		}

		// Enable back button.
		if (this.prevBoard.length > 0) {
			this.backButton.removeAttribute('disabled');
		}

		// Check if any winners
		this._checkWinner();
	}

	_colourSquares() {
		// Find squares with corresponding row/col data attributes.
		this.board.white.forEach(whiteSquare => {
			// console.log(whiteSquare);
			this.game.querySelector(`[data-row="${whiteSquare.row}"][data-col="${whiteSquare.col}"]`).dataset.player = 'w';
		});
		this.board.black.forEach(blackSquare => {
			// console.log(blackSquare);
			this.game.querySelector(`[data-row="${blackSquare.row}"][data-col="${blackSquare.col}"]`).dataset.player = 'b';
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
		})
	}

	_checkWinner() {
		const currentPlayer = this.player.getCurrentPlayer();
		const nextPlayer = this.player.getNextPlayer();
		this.evaluate = new BoardEvaluation(currentPlayer, nextPlayer);
		this.evaluate.setBoard([...this.board]);
		const availableSquares = this.evaluate.evaluateBoard();
		this._colourAvailableSquares(availableSquares);
		// Find winner if no available squares.
		if (availableSquares.length === 0) {
			const results = this.evaluate.returnResult();
			this._displayResults(results);
		}
	}

	_displayResults(results) {
		const winnerEl = document.querySelector('.results-winner');
		document.querySelector('.results').classList.add('show-results');
		document.querySelector('.results-black').innerHTML = results['b'];
		document.querySelector('.results-white').innerHTML = results['w'];
		if (results['b'] === results['w']) {
			winnerEl.innerHTML = 'Draw!';
		} else if (results['b'] > results['w']) {
			winnerEl.innerHTML = 'Black wins!';
		} else {
			winnerEl.innerHTML = 'White wins!';
		}
		// Disable back button when there is a winner.
		this.backButton.setAttribute('disabled', true);
	}

	init() {
		this._renderBoard();
		this._colourSquares();
	}
}

export default Board;
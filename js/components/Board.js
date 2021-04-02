import GameLogic from './GameLogic.js';
import Player from './Player.js';
import BoardEvaluation from './BoardEvaluation.js';
import SearchAI from './SearchAI.js';

class Board {
	constructor() {
		this.game = document.querySelector('.game');
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
		this.boardEl = this.game.querySelector('.board');
		this.backButton = this.game.querySelector('.back-btn');
		this.player = new Player();
		this.wrongSquareEl = this.game.querySelector('.wrong-square');
		this.playerMessageEl = this.game.querySelector('.current-player');
		this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
		this.minimax = new SearchAI();
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
		const position = parseInt(e.target.dataset.position);
		// Check clicked square is available.
		if (this.board[position] != 0) {
			return;
		}

		let currentPlayer = this.player.getCurrentPlayer();
		let nextPlayer = this.player.getNextPlayer();
		const takeTurn = new GameLogic(currentPlayer, nextPlayer);
		takeTurn.setPosition(position);
		takeTurn.setBoard([...this.board]);
		console.time('checkNext');
		const newBoard = takeTurn.checkNextItem();
		console.timeEnd('checkNext');
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
			console.log(currentPlayer);

			// Use minimax for next player
			currentPlayer = this.player.getCurrentPlayer();
			nextPlayer = this.player.getNextPlayer();
			this.minimax.setBoard([...this.board]);
			this.minimax.setPlayers(currentPlayer, nextPlayer);
			const aiMove = this.minimax.runSearch();
			console.log(aiMove);
			// Apply that move
			const aiTurn = new GameLogic(currentPlayer, nextPlayer);
			aiTurn.setPosition(aiMove);
			aiTurn.setBoard([...this.board]);
			const newAiBoard = aiTurn.checkNextItem();
			console.log(aiTurn);
			if (newAiBoard.successfulMove) {
				this.prevBoard = this.board;
				this.board = newAiBoard.newBoard;
				this._colourSquares();

				// Next player.
				this.player.changePlayer();
				this._updatePlayerMessage();
				// Remove available square colours
				this._removeAvailableSquares();
			}
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
		// Loop through board array to find the black and white positions.
		// Set data attribute for the squares should be black or white.
		//console.log(this.board)
		const squaresAll = document.querySelectorAll('.board-square');
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
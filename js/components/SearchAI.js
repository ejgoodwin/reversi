import GameLogic from './GameLogic.js';

class SearchAI {
	constructor() {
		this.board = null;
		this.currentPlayer = null;
		this.nextPlayer = null;
		this.logic = null;
		this.weightedBoard = [
			99,-8,8,6,6,8,-8,99,
			-8,-24,-4,-3,-3,-4,-24,-8,
			8,-4,7,4,4,7,-4,8,
			6,0,0,0,0,0,0,6,
			6,0,0,0,0,0,0,6,
			8,-4,7,4,4,7,-4,8,
			-8,-24,-4,-3,-3,-4,-24,-8,
			99,-8,8,6,6,8,-8,99
		];
	}

	setBoard(board) {
		this.board = board;
	}

	setPlayers(currentPlayer, nextPlayer) {
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.createLogicInstance();
	}

	createLogicInstance() {
		this.logic = new GameLogic(this.currentPlayer, this.nextPlayer);
	}

	runSearch() {
		const selectedMove = this.minimax(this.board, this.currentPlayer, 4).index;
		return selectedMove;
	}

	minimax(testBoard, player, depth) {
		// Find available squares.
		const availSquares = this.evaluateBoard(testBoard);

		// If end of depth, see who has the best score.
		if (depth === 0 || availSquares.length < 1) {
			const score = this.boardValue(player);
			return {score: score};
		}

		// Start min/max
		if (player === 'w') {
	 		let bestScore = {};
			bestScore.score = -1000;
			// loop through available squares.
			for (let i = 0; i < availSquares.length; i++) {
				// assign player to the current square.
				testBoard[availSquares[i]] = player;
				// store result of minimax -> returns 'bestScore', i.e. {score, index}
				let result = this.minimax(testBoard, 'b', depth-1);
				// Find the MAXIMUM score
				if (result.score > bestScore.score) {					
					bestScore.score = result.score - depth;
					bestScore.index = availSquares[i];
				}
				// Reset current square to null 
				// -> next iteration needs to see state of board prior to that potential move
				testBoard[availSquares[i]] = 0;
			}
			return bestScore;
		} else {
			let bestScore = {};
			bestScore.score = 1000;
			for (let i = 0; i < availSquares.length; i++) {
				testBoard[availSquares[i]] = player;
				let result = this.minimax(testBoard, 'w', depth-1);
				// Find the MINIMUM score
				if (result.score < bestScore.score) {
					bestScore.score = result.score - depth;
					bestScore.index = availSquares[i];
				}
				testBoard[availSquares[i]] = 0;
			}
			return bestScore;
		}
	}

	boardValue(player) {
		let score = 0;
		this.weightedBoard.forEach((weight, index) => {
			if (this.board[index] === player) {
				if (player === 'w') {
					score += weight;
				} else {
					score -= weight;
				}
			}
		});
		return score;
	}

	evaluateBoard(board) {
		// Check that there are no more available moves:
		// Loop through array and checkNextItem() for `0` squares.
		const availableSquares = [];
		// console.log(board);
		board.forEach((item, index) => {
			if (item === 0) {
				// Pass the position and fresh copy of board to GameLogic.
				this.logic.setPosition(index);
				this.logic.setBoard([...board]);
				let nextItem = this.logic.checkNextItem();
				if (nextItem.successfulMove === true) {
					// This move is available -> add it to the array.
					availableSquares.push(index);
				}
			}
		});
		// Return an array of available squares (empty if non available).
		return availableSquares;
	}
}

export default SearchAI;
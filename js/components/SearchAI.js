import GameLogic from './GameLogic.js';

class SearchAI {
	constructor() {
		this.board = null;
		this.currentPlayer = null;
		this.nextPlayer = null;
		this.logic = null;
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
		// console.log(this.currentPlayer);
		// this.minimax(this.board, this.currentPlayer, 3);
		const selectedMove = this.minimax(this.board, this.currentPlayer, 5).index;
		return selectedMove;
	}

	minimax(testBoard, player, depth) {
		// Find available squares.
		// console.log(testBoard);
		const availSquares = this.evaluateBoard(testBoard);
		// Check who's winning on current board state.
		let black = 0;
		let white = 0;
		for (let i = 0; i < testBoard.length; i++) {
			if (testBoard[i] === 'b') {
				black++;
			}
			if (testBoard[i] === 'w') {
				white++;
			}
		}
		// Added last minute
		// TODO: change this to an array giving weights to squares
		if (testBoard[0] === 'w' ||
			testBoard[7] === 'w' ||
			testBoard[56] === 'w' ||
			testBoard[63] === 'w') {
			white += 50;
		} else if (testBoard[0] === 'b' ||
			testBoard[7] === 'b' ||
			testBoard[56] === 'b' ||
			testBoard[63] === 'b') {
			black += 50; 
		}
		if (depth === 0 && black > white) {
			return {score:-100};
		} else if (depth === 0 && black < white) {
			return {score:100};
		}

		// Start min/max
		if (player === 'w') {
	 		let bestScore = {};
			bestScore.score = -1000;
			// loop through available squares.
			for (let i = 0; i < availSquares.length; i++) {
				// console.log(availSquares)
				// console.log(depth);
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
			// console.log(bestScore);
			return bestScore;
		}
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
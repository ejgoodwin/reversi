import gameConfig from '../gameConfig.js';
import GameLogic from './GameLogic.js';

class SearchAI {
	constructor() {
		this.logic = new GameLogic();
	}

	runSearch() {
		return this._minimax([...gameConfig.board], gameConfig.currentPlayer, 0).index;
	}

	_minimax(testBoard, player, depth) {
		// Find available squares.
		const availSquares = this._evaluateBoard(testBoard);

		// If end of depth, see who has the best score.
		if (depth === 4 || availSquares.length < 1) {
			const score = this._boardValue(player, testBoard);
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
				// store result of _minimax
				let result = this._minimax(testBoard, 'b', depth+1);
				// Find the MAXIMUM score
				if (result.score > bestScore.score) {					
					bestScore.score = result.score;
					bestScore.index = availSquares[i];
				}
				// Reset current square to null 
				// -> next iteration needs to see state of board prior to that potential move
				testBoard[availSquares[i]] = 0;
			}
			// console.log(bestScore);
			return bestScore;
		} else {
			let bestScore = {};
			bestScore.score = 1000;
			for (let i = 0; i < availSquares.length; i++) {
				testBoard[availSquares[i]] = player;
				let result = this._minimax(testBoard, 'w', depth+1);
				// Find the MINIMUM score
				if (result.score < bestScore.score) {
					bestScore.score = result.score;
					bestScore.index = availSquares[i];
				}
				testBoard[availSquares[i]] = 0;
			}
			// console.log(bestScore);
			return bestScore;
		}
	}

	_boardValue(player, testBoard) {
		let score = 0;
		// Compare player's squares agains weighted board.
		gameConfig.weightedBoard.forEach((weight, index) => {
			if (testBoard[index] === player) {
				if (player === 'w') {
					score += weight;
				} else {
					score -= weight;
				}
			}
		});
		return score;
	}

	_evaluateBoard(board) {
		// Check that there are no more available moves:
		// Loop through array and checkNextItem() for `0` squares.
		const availableSquares = [];
		board.forEach((item, index) => {
			if (item === 0) {
				// Pass the position and fresh copy of board to GameLogic.
				this.logic.setPosition(index);
				this.logic.setBoard([...board]);
				this.logic.setPlayers(gameConfig.currentPlayer, gameConfig.nextPlayer);
				let nextItem = this.logic.checkNextItem();
				if (nextItem.successfulMove) {
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
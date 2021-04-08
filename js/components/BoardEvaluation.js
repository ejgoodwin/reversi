import gameConfig from '../gameConfig.js';
import GameLogic from './GameLogic.js';

class BoardEvaluation {
	constructor() {
		this.logic = new GameLogic();
	}

	evaluateBoard() {
		this.logic.setPlayers(gameConfig.currentPlayer, gameConfig.nextPlayer);
		// Check that there are no more available moves:
		// Loop through array and checkNextItem() for `0` squares.
		const availableSquares = [];
		gameConfig.board.forEach((item, index) => {
			if (item === 0) {
				// Pass the position and fresh copy of board to GameLogic.
				this.logic.setPosition(index);
				this.logic.setBoard([...gameConfig.board]);
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

	returnResult() {
		// Store results in an object that will be returned.
		const results = {'b':0, 'w':0};
		// Loop through the board items and add 1 to corresponding key/value.
		gameConfig.board.forEach((item) => {
			if (item === 'b') {
				results['b'] += 1;
			} else if (item === 'w') {
				results['w'] += 1;
			}
		});
		return results;
	}
}

export default BoardEvaluation;
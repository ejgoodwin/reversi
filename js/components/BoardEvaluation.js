import GameLogic from './GameLogic.js';

class BoardEvaluation {
	constructor(currentPlayer, nextPlayer) {
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.boardCurrentState = [];
		this.logic = new GameLogic(this.currentPlayer, this.nextPlayer);
	}

	setBoard(board) {
		this.boardCurrentState = board;
	}

	evaluateBoard() {
		// Check that there are no more available moves:
		// Loop through array and checkNextItem() for `0` squares.
		const availableSquares = [];
		this.boardCurrentState.forEach((item, index) => {
			if (item === 0) {
				// Pass the position and fresh copy of board to GameLogic.
				this.logic.setPosition(index);
				this.logic.setBoard([...this.boardCurrentState]);
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
		this.boardCurrentState.forEach((item) => {
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
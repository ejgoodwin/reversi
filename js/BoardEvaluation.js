import GameLogic from './GameLogic.js';

class BoardEvaluation {
	constructor(currentPlayer, nextPlayer) {
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.boardCurrentState = [];
	}

	setBoard(board) {
		this.boardCurrentState = board;
	}

	evaluateBoard() {
		// Check that there are no more available moves:
		// Loop through array and call game logic for `0` squares
		const availableSquares = [];
		console.log('current' + this.currentPlayer)
		this.boardCurrentState.forEach((item, index) => {
			if (item === 0) {
				let logic = new GameLogic([...this.boardCurrentState], this.currentPlayer, this.nextPlayer);
				logic.setPosition(index);
				let nextItem = logic.checkNextItem();
				// console.log(nextItem);
				if (nextItem.successfulMove === true) {
					// There must be other moves available.
					console.log('successfulMove');
					availableSquares.push(index);
				}
			}
			// No more moves available so decide result.
			//return this.returnResult();
		})
		// -> if successful move does not return for any iteration, there are no moves available.
		// Loop through array, keep track of `b` and `w`.
		// Highest wins.
		return availableSquares;
	}

	returnResult() {
		const results = {'b':0, 'w':0};
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
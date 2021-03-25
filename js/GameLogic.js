// TODO: add `while` statements for northeast & nortwest to find edge of board.

class GameLogic {
	constructor(board, position, currentPlayer, nextPlayer) {
		this.boardState = board;
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.position = position;
		this.successfulMove = false;
	}

	checkNextItem() {
		let condition;
		let decrement;
		let increment;
		let calcVar;
		let remainder = this.position % 8;

		// North
		if (this.boardState[this.position - 8] === this.nextPlayer) {
			condition = 0;
			decrement = 8;
			this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'north');
		}

		// South.
		if (this.boardState[this.position + 8] === this.nextPlayer) {
			condition = 64;
			increment = 8;
			this._evaluationFunctionPositive([...this.boardState], condition, increment, 's');
		}

		// Check position is not at right edge of board.
		if (remainder != 7) {
			// Northeast.
			if (this.boardState[this.position - 7] === this.nextPlayer &&
				remainder != 7) {
				condition = 0;
				decrement = 7;
				this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'ne');
			}

			// East.
			if (this.boardState[this.position + 1] === this.nextPlayer) {
				calcVar = this.position % 8;
				condition = this.position+(7-calcVar);
				increment = 1;
				this._evaluationFunctionPositive([...this.boardState], condition, increment, 'e');
			}

			// Southeast.
			if (this.boardState[this.position + 9] === this.nextPlayer) {
				condition = this.position;
				increment = 9;
				// Find most southeasterly square.
				while (condition % 8 != 7 ) {
					condition += increment;
				}
				this._evaluationFunctionPositive([...this.boardState], condition, increment, 'se');
			}
		}

		// Check position is not at left edge of board.
		if (remainder != 0) {
			// Southwest.
			if (this.boardState[this.position + 7] === this.nextPlayer) {
				condition = this.position;
				increment = 7;
				// Find most southwesterly square.
				while (condition % 8 != 0) {
					condition += increment;
				}
				this._evaluationFunctionPositive([...this.boardState], condition, increment, 'sw');
			}

			// West.
			if (this.boardState[this.position - 1] === this.nextPlayer) {
				calcVar = this.position % 8;
				condition = this.position-calcVar;
				decrement = 1;
				this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'w');
			}

			// Northwest.
			if (this.boardState[this.position - 9] === this.nextPlayer) {
				condition = 0;
				decrement = 9;
				this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'nw');
			}
		}
		return {newBoard: this.boardState, successfulMove: this.successfulMove};
	}

	_evaluationFunctionPositive(board, condition, increment, direction) {
		board[this.position] = this.currentPlayer;
		for (let i = this.position+increment; i < condition; i += increment) {
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) break;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i+increment] === this.currentPlayer) {
					this.boardState = board;
					console.log('direction: ' + direction);
					this.successfulMove = true;
					return;
				}
			}
		};
	}

	_evaluationFunctionNegative(board, condition, decrement, direction) {
		board[this.position] = this.currentPlayer;
		for (let i = this.position-decrement; i >= condition; i -= decrement) {
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) break;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i-decrement] === this.currentPlayer) {
					this.boardState = board;
					console.log('direction: ' + direction);
					this.successfulMove = true;
					return;
				}
			}
		};
	}
}

export default GameLogic;
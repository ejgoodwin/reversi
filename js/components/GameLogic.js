class GameLogic {
	constructor(currentPlayer, nextPlayer) {
		this.boardState = [];
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.position = null;
		this.successfulMove = false;
	}

	setPosition(position) {
		this.position = position;
	}

	setBoard(board) {
		this.boardState = board;
	}

	checkNextItem() {
		let condition;
		let decrement;
		let increment;
		let calcVar;
		let remainder = this.position % 8;
		this.successfulMove = false;

		// North
		if (this.boardState[this.position - 8] === this.nextPlayer) {
			condition = 0;
			decrement = 8;
			this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'n');
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
			if (this.boardState[this.position - 7] === this.nextPlayer) {
				condition = this.position;
				decrement = 7;
				// Find most northeasterly square.
				while (condition % 8 != 7 && condition >= 0) {
					condition -= decrement;
				}
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
				while (condition % 8 != 7 && condition >= 0) {
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
				condition = this.position;
				decrement = 9;
				// Find most northwesterly square.
				while (condition % 8 != 0) {
					condition -= decrement;
				}
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
				if (board[i+increment] === 0) {
					return;
				} else if (board[i+increment] === this.currentPlayer) {
					this.boardState = board;
					// console.log('direction: ' + direction + ' increment: ' + increment + ' condition: ' + condition);
					this.successfulMove = true;
					return;
				} 
			}
		};
	}

	_evaluationFunctionNegative(board, condition, decrement, direction) {
		// console.log('checking')
		board[this.position] = this.currentPlayer;
		for (let i = this.position-decrement; i > condition; i -= decrement) {
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) break;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i-decrement] === 0) {
					return;
				} else if (board[i-decrement] === this.currentPlayer) {
					this.boardState = board;
					// console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);
					this.successfulMove = true;
					return;
				}
			}
		};
	}
}

export default GameLogic;
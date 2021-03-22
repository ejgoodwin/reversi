// TODO: clean up, use evaluation functions.

class GameLogic {
	constructor(board, position, currentPlayer, nextPlayer) {
		this.boardState = board;
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.position = position;
	}

	checkNextItem() {
		// North
		if (this.boardState[this.position - 8] === this.nextPlayer) {
			let initialExp = -8;
			let x = Math.floor(this.position/8);
			let condition = this.position-(x * 8);
			let increment = -8;
			this._evaluationFunctionNegative([...this.boardState], initialExp, condition, increment);
			//this._checkNorth([...this.boardState], this.position);
		}

		// East
		if (this.boardState[this.position + 1] === this.nextPlayer) {
			let initialExp = 1;
			let x = this.position % 8;
			let condition = this.position+(7-x);
			let increment = 1;
			this._evaluationFunctionPositive([...this.boardState], initialExp, condition, increment);
			//this._checkEast([...this.boardState], this.position);
		}

		return this.boardState;
	}

	_checkNorth(board, index) {
		// Flip clicked square.
		board[index] = this.currentPlayer;
		// Find loop limit.
		const divided = Math.floor(index/8);
		const limit = index-(divided * 8);
		for (let i = index-8; i >= limit; i -= 8) {
			if (board[i] === this.currentPlayer) return;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i-8] === this.currentPlayer) {
					this.boardState = board;
					return;
				}
			}
		}
	}

	_checkEast(board, index) {
		// Flip clicked square.
		board[index] = this.currentPlayer;
		const x = index % 8;
		for (let i = index+1; i <= index+(7-x); i++) {
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) return;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i+1] === this.currentPlayer) {
					this.boardState = board;
					return;
				}
			}
		};
	}

	_evaluationFunctionPositive(board, initialExp, condition, increment) {
		board[this.position] = this.currentPlayer;
		for (let i = this.position+initialExp; i <= condition; i += increment) {
			console.log('i = ' + i);
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) break;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i+initialExp] === this.currentPlayer) {
					this.boardState = board;
					return;
				}
			}
		};
	}

	_evaluationFunctionNegative(board, initialExp, condition, increment) {
		board[this.position] = this.currentPlayer;
		for (let i = this.position+initialExp; i >= condition; i -= increment) {
			console.log('i = ' + i);
			// If the next square belongs to currentPlayer, cannot be flipped -> break.
			if (board[i] === this.currentPlayer) break;
			// Check next item -> if it belongs to opponent, flip it to currentPlayer.
			if (board[i] === this.nextPlayer) {
				board[i] = this.currentPlayer;
				if (board[i-initialExp] === this.currentPlayer) {
					this.boardState = board;
					return;
				}
			}
		};
	}
}

export default GameLogic;
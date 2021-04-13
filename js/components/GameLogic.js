import gameConfig from '../gameConfig.js';

/*
	Take a selected position and check all directions for a viable path.
	A viable path must:
	- Start with currentPlayer (selected square)
	- Followed by opponent square
	- Followed by either opponent or currentPlayer
	- Must end on currentPlayer
*/

class GameLogic {
	constructor() {
		this.currentPlayer = gameConfig.currentPlayer;
		this.nextPlayer = gameConfig.nextPlayer;
		this.board = gameConfig.board;
		this.successfulMove = false;
		this.position = gameConfig.selectedPosition;
		this.toFlip = [];
		this.potentialFlip = [];
	}

	setPlayers(currentIn, nextIn) {
		this.currentPlayer = currentIn;
		this.nextPlayer = nextIn;
	}

	setBoard(boardIn) {
		this.board = boardIn;
	}

	setPosition(positionIn) {
		this.position = positionIn;
	}

	checkNextItem() {
		let condition;
		let decrement;
		let increment;
		let calcVar;
		let remainder = this.position % 8;
		this.successfulMove = false;

		// North
		// Board row - 8
		// check if that is in opponent
		let checkNorth = this.board.white.find(item => item = {row:gameConfig.row-8, col:gameConfig.col});
		if(checkNorth) {
			for (let i=gameConfig.row-8; i>0; i--) {
				checkNorth = this.board.white.find(item => item = {row:gameConfig.row-i, col:gameConfig.col});
				checkNorthCurrentP = this.board.black.find(item => item = {row:gameConfig.row-i, col:gameConfig.col});
				if (!checkNorth && !checkNorthCurrentP) { // Not in either colour, so not viable route
					break;
				} else if (checkNorth) { // Opponent - flip and check next
					this.board.black.push({row:gameConfig.row-i, col:gameConfig.col});
					// Filter the white array to remove this square from it?
				}
			}

		}

		if (this.board[this.position - 8] === this.nextPlayer) {
			condition = 0;
			decrement = 8;
			this._evaluationFunctionNegative([...this.board], condition, decrement, 'n');
		}

		// South.
		if (this.board[this.position + 8] === this.nextPlayer) {
			condition = 64;
			increment = 8;
			this._evaluationFunctionPositive([...this.board], condition, increment, 's');
		}

		// Check position is not at right edge of board.
		if (remainder != 7) {
			// Northeast.
			if (this.board[this.position - 7] === this.nextPlayer) {
				condition = this.position;
				decrement = 7;
				// Find most northeasterly square.
				while (condition % 8 != 7 && condition >= 0) {
					condition -= decrement;
				}
				this._evaluationFunctionNegative([...this.board], condition, decrement, 'ne');
			}

			// East.
			if (this.board[this.position + 1] === this.nextPlayer) {
				calcVar = this.position % 8;
				condition = this.position+(7-calcVar);
				increment = 1;
				this._evaluationFunctionPositive([...this.board], condition, increment, 'e');
			}

			// Southeast.
			if (this.board[this.position + 9] === this.nextPlayer) {
				condition = this.position;
				increment = 9;
				// Find most southeasterly square.
				while (condition % 8 != 7 && condition >= 0) {
					condition += increment;
				}
				this._evaluationFunctionPositive([...this.board], condition, increment, 'se');
			}
		}

		// Check position is not at left edge of board.
		if (remainder != 0) {
			// Southwest.
			if (this.board[this.position + 7] === this.nextPlayer) {
				condition = this.position;
				increment = 7;
				// Find most southwesterly square.
				while (condition % 8 != 0) {
					condition += increment;
				}
				this._evaluationFunctionPositive([...this.board], condition, increment, 'sw');
			}

			// West.
			if (this.board[this.position - 1] === this.nextPlayer) {
				calcVar = this.position % 8;
				condition = this.position-calcVar;
				decrement = 1;
				this._evaluationFunctionNegative([...this.board], condition, decrement, 'w');
			}

			// Northwest.
			if (this.board[this.position - 9] === this.nextPlayer) {
				condition = this.position;
				decrement = 9;
				// Find most northwesterly square.
				while (condition % 8 != 0) {
					condition -= decrement;
				}
				this._evaluationFunctionNegative([...this.board], condition, decrement, 'nw');
			}
		}
		return {newBoard:this.board, successfulMove:this.successfulMove};
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
					this.board = board;
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
					this.board = board;
					// console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);
					this.successfulMove = true;
					return;
				}
			}
		};
	}
}

export default GameLogic;
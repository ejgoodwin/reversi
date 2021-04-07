/*
	Class to look after player and board information.
	Getter and setter methods return and update values.
*/

class GameConfig {
	constructor() {
		this.currentPlayer = 'b';
		this.nextPlayer = 'w';
		this.board = [
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,'b','w',0,0,0,
			0,0,0,'w','b',0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,0
		];
	}

	changePlayer() {
		if (this.currentPlayer === 'b') {
			this.nextPlayer = 'b';
			this.currentPlayer = 'w';
		} else {
			this.nextPlayer = 'w';
			this.currentPlayer ='b';
		}
	}

	getNextPlayer() {
		return this.nextPlayer;
	}

	getCurrentPlayer() {
		return this.currentPlayer;
	}

	getBoard() {
		return this.board;
	}
}

export default GameConfig;
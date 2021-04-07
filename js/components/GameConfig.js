/*
	Class to look after player and board information.
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
		this.prevBoard =[];
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

	addToPrevBoard(boardIn) {
		this.prevBoard.push(boardIn);
	}

	getPrevBoard() {
		return this.prevBoard;
	}
}

export default GameConfig;
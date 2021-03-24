class Player {
	constructor() {
		this.currentPlayer = 'b';
		this.nextPlayer = 'w';
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
}

export default Player;
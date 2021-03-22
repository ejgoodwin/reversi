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

	returnNextPlayer() {
		return this.nextPlayer;
	}

	returnCurrentPlayer() {
		return this.currentPlayer;
	}
}

export default Player;
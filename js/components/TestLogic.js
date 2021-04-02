class TestLogic {
	constructor() {
		this.currentPlayer = null;
		this.nextPlayer = null;
		this.board = null;
	}

	setPlayers(currentPlayer, nextPlayer) {
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
	}

	setBoard(board) {
		this.board = board;
	}

	checkNextItems(currentSquare) {
		// North
		// console.log(this.board);
		// console.log(this.currentPlayer);
		let directionPoss = true;
		// currentSquare.row -= 1;
		directionPoss = this.board.white.find(item => currentSquare);
		console.log(directionPoss);
		// do {
		// 	console.log(currentSquare);
		// 	currentSquare.row -= 1;
		// 	directionPoss = this.board.white.find(item => currentSquare);
		// } while (directionPoss);
	}
}

export default TestLogic;
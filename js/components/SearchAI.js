import GameLogic from './GameLogic.js';

class SearchAI {
	constructor() {
		this.board = null;
		this.currentPlayer = null;
		this.nextPlayer = null;
		this.logic = null;
		this.weightedBoard = [
			99,-8,20,15,15,20,-8,99,
			-8,-24,-4,-3,-3,-4,-24,-8,
			20,-4,6,4,4,6,-4,20,
			15,-3,4,0,0,4,-3,15,
			15,-3,4,0,0,4,-3,15,
			20,-4,6,4,4,6,-4,20,
			-8,-24,-4,-3,-3,-4,-24,-8,
			99,-8,20,15,15,20,-8,99
		];
		this.patterns = [
			[1,2,3,4,5,6],
			[15,23,31,39,47,55],
			[57,58,59,60,61,62],
			[8,16,24,32,40,48]
		];
	}

	setBoard(board) {
		this.board = board;
	}

	setPlayers(currentPlayer, nextPlayer) {
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.createLogicInstance();
	}

	createLogicInstance() {
		this.logic = new GameLogic(this.currentPlayer, this.nextPlayer);
	}

	runSearch() {
		console.log(this.currentPlayer)
		const selectedMove = this.minimax(this.board, this.currentPlayer, 0).index;
		return selectedMove;
	}

	minimax(testBoard, player, depth) {
		// Find available squares.
		const availSquares = this.evaluateBoard(testBoard);

		// If end of depth, see who has the best score.
		if (depth === 2 || availSquares.length < 1) {
			const score = this.boardValue(player, testBoard);
			return {score: score};
		}

		// Start min/max
		if (player === 'w') {
	 		let bestScore = {};
			bestScore.score = -1000;
			// loop through available squares.
			for (let i = 0; i < availSquares.length; i++) {
				// assign player to the current square.
				testBoard[availSquares[i]] = player;
				// store result of minimax -> returns 'bestScore', i.e. {score, index}
				let result = this.minimax(testBoard, 'b', depth+1);
				// Find the MAXIMUM score
				
				if (result.score > bestScore.score) {					
					bestScore.score = result.score;
					bestScore.index = availSquares[i];
				}
				// console.log(result);
				// console.log(bestScore);
				// console.log(depth);
				// Reset current square to null 
				// -> next iteration needs to see state of board prior to that potential move
				testBoard[availSquares[i]] = 0;
			}
			// console.log(bestScore);
			return bestScore;
		} else {
			let bestScore = {};
			bestScore.score = 1000;
			for (let i = 0; i < availSquares.length; i++) {
				testBoard[availSquares[i]] = player;
				let result = this.minimax(testBoard, 'w', depth+1);
				// Find the MINIMUM score
				if (result.score < bestScore.score) {
					bestScore.score = result.score;
					bestScore.index = availSquares[i];
				}
				testBoard[availSquares[i]] = 0;
			}
			// console.log(bestScore);
			return bestScore;
		}
	}

	boardValue(player, testBoard) {
		let score = 0;
		// Compare player's squares agains weighted board.
		this.weightedBoard.forEach((weight, index) => {
			if (testBoard[index] === player) {
				if (player === 'w') {
					score += weight;
				} else {
					score -= weight;
				}
			}
		});

		return score;
	}

	evaluateBoard(board) {
		// Check that there are no more available moves:
		// Loop through array and checkNextItem() for `0` squares.
		const availableSquares = [];
		// console.log(board);
		board.forEach((item, index) => {
			if (item === 0) {
				// Pass the position and fresh copy of board to GameLogic.
				this.logic.setPosition(index);
				this.logic.setBoard([...board]);
				let nextItem = this.logic.checkNextItem();
				if (nextItem.successfulMove === true) {
					// This move is available -> add it to the array.
					availableSquares.push(index);
				}
			}
		});
		// Return an array of available squares (empty if non available).
		return availableSquares;
	}
}

export default SearchAI;
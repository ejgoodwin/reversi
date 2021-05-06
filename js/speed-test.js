let count = 0;
let position = 60;
// let board = [
// 	0,0,0,0,0,0,0,0,
// 	0,0,0,0,0,0,0,0,
// 	0,0,0,0,0,0,0,0,
// 	0,0,0,'b','w',0,0,0,
// 	0,0,0,'w','b',0,0,0,
// 	0,0,0,0,0,0,0,0,
// 	0,0,0,0,0,0,0,0,
// 	0,0,0,0,0,0,0,0
// 	];
let board = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "b",
    "b",
    "b",
    0,
    0,
    0,
    0,
    "w",
    "w",
    "b",
    0,
    0,
    0,
    0,
    0,
    "w",
    "b",
    "w",
    0,
    0,
    0,
    0,
    0,
    "w",
    "b",
    0,
    "w",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];
const weightedBoard = [
	99,-8,20,15,15,20,-8,99,
	-8,-24,-4,-3,-3,-4,-24,-8,
	20,-4,6,4,4,6,-4,20,
	15,-3,4,0,0,4,-3,15,
	15,-3,4,0,0,4,-3,15,
	20,-4,6,4,4,6,-4,20,
	-8,-24,-4,-3,-3,-4,-24,-8,
	99,-8,20,15,15,20,-8,99
	];
const board2 = ['0', '0', 'b'];
const nextPlayer = 'w';
const currentPlayer = 'b';
let successfulMove = false;

// MINIMAX
function minimax(testBoard, player, depth) {
	count += 1;
	// Find available squares.
	const availSquares = evaluateBoard(testBoard);
	// If end of depth, see who has the best score.
	if (depth === 8 || availSquares.length < 1) {
		const score = boardValue(player, testBoard);
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
			// store result of minimax
			let result = minimax(testBoard, 'b', depth+1);
			// Find the MAXIMUM score
			if (result.score > bestScore.score) {					
				bestScore.score = result.score;
				bestScore.index = availSquares[i];
			}
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
			let result = minimax(testBoard, 'w', depth+1);
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

function boardValue(player, testBoard) {
	let score = 0;
	// Compare player's squares agains weighted board.
	weightedBoard.forEach((weight, index) => {
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

function evaluateBoard(board) {
	// Check that there are no more available moves:
	// Loop through array and checkNextItem() for `0` squares.
	const availableSquares = [];
	board.forEach((item, index) => {
		if (item === 0) {
			position = index;
			// Pass the position and fresh copy of board to GameLogic.
			checkNextItem([...board]);
			if (successfulMove) {
				// This move is available -> add it to the array.
				availableSquares.push(index);
			}
		}
	});
	// Return an array of available squares (empty if non available).
	return availableSquares;
}


// CHECK NEXT ITEM
function checkNextItem(board) {
	let condition;
	let decrement;
	let increment;
	let calcVar;
	let remainder = position % 8;
	successfulMove = false;
	// North
	if (board[position - 8] === nextPlayer) {
		condition = 0;
		decrement = 8;
		_evaluationFunctionNegative([...board], condition, decrement, 'n');
	}

	// South.
	if (board[position + 8] === nextPlayer) {
		condition = 64;
		increment = 8;
		_evaluationFunctionPositive([...board], condition, increment, 's');
	}

	// Check position is not at right edge of board.
	if (remainder != 7) {
		// Northeast.
		if (board[position - 7] === nextPlayer) {
			condition = position;
			decrement = 7;
			// Find most northeasterly square.
			while (condition % 8 != 7 && condition >= 0) {
				condition -= decrement;
			}
			_evaluationFunctionNegative([...board], condition, decrement, 'ne');
		}

		// East.
		if (board[position + 1] === nextPlayer) {
			calcVar = position % 8;
			condition = position+(7-calcVar);
			increment = 1;
			_evaluationFunctionPositive([...board], condition, increment, 'e');
		}

		// Southeast.
		if (board[position + 9] === nextPlayer) {
			condition = position;
			increment = 9;
			// Find most southeasterly square.
			while (condition % 8 != 7 && condition >= 0) {
				condition += increment;
			}
			_evaluationFunctionPositive([...board], condition, increment, 'se');
		}
	}

	// Check position is not at left edge of board.
	if (remainder != 0) {
		// Southwest.
		if (board[position + 7] === nextPlayer) {
			condition = position;
			increment = 7;
			// Find most southwesterly square.
			while (condition % 8 != 0) {
				condition += increment;
			}
			_evaluationFunctionPositive([...board], condition, increment, 'sw');
		}

		// West.
		if (board[position - 1] === nextPlayer) {
			calcVar = position % 8;
			condition = position-calcVar;
			decrement = 1;
			_evaluationFunctionNegative([...board], condition, decrement, 'w');
		}

		// Northwest.
		if (board[position - 9] === nextPlayer) {
			condition = position;
			decrement = 9;
			// Find most northwesterly square.
			while (condition % 8 != 0) {
				condition -= decrement;
			}
			_evaluationFunctionNegative([...board], condition, decrement, 'nw');
		}
	}
	return;
}

function _evaluationFunctionPositive(board, condition, increment, direction) {
	board[position] = currentPlayer;
	for (let i = position+increment; i < condition; i += increment) {
		// If the next square belongs to currentPlayer, cannot be flipped -> break.
		if (board[i] === currentPlayer) break;
		// Check next item -> if it belongs to opponent, flip it to currentPlayer.
		if (board[i] === nextPlayer) {
			board[i] = currentPlayer;
			if (board[i+increment] === 0) {
				return;
			} else if (board[i+increment] === currentPlayer) {
				// board = board;
				// console.log('direction: ' + direction + ' increment: ' + increment + ' condition: ' + condition);
				successfulMove = true;
				return;
			} 
		}
	};
}

function _evaluationFunctionNegative(board, condition, decrement, direction) {
	board[position] = currentPlayer;
	for (let i = position-decrement; i > condition; i -= decrement) {
		// If the next square belongs to currentPlayer, cannot be flipped -> break.
		if (board[i] === currentPlayer) break;
		// Check next item -> if it belongs to opponent, flip it to currentPlayer.
		if (board[i] === nextPlayer) {
			board[i] = currentPlayer;
			if (board[i-decrement] === 0) {
				return;
			} else if (board[i-decrement] === currentPlayer) {
				// board = board;
				// console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);
				successfulMove = true;
				return;
			}
		}
	};
}


// RUN
console.time('minmax');
let posNew = minimax(board, currentPlayer, 0);
console.timeEnd('minmax');
console.log(posNew);
console.log(board);
console.log("count: " + count);

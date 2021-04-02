import SquareNode from './SquareNode.js';

class TestLogic {
	constructor(currentPlayer, nextPlayer) {
		this.position = null;
		this.boardState = [];
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.successfulMove = false;
	}

	setPosition(position) {
		this.position = position;
	}

	setBoard(board) {
		this.boardState = board;
	}

	// create a node, setting initialMove to true.
	createNodes() {
		const initialSquare = new SquareNode(this.position, true, 'all', [...this.boardState], this.currentPlayer, this.nextPlayer);
		// -> this expands node into all directions.
		// -> returns an array of new nodes.
		const nodeArr = initialSquare.expandNode();
		// loop through new nodes.
		const flipSquares = [];
		nodeArr.forEach((node) => {
			// -> take one and expand.
			let potentialFlips = [];
			let nodeInfo = node.getNodeInfo();
			potentialFlips.push(nodeInfo.position);
			let expand = true;
			do {
				let newNode = node.expandNode();
				newNode.checkGoal();
				nodeInfo = newNode.getNodeInfo();
				console.log(newNode);
				// Add position to flip array.
				potentialFlips.push(nodeInfo.position);
				// Check goal/expand states.
				if (nodeInfo.directionFail) {
					expand = false;
					break;
				} else if (newNode.goalReached) {
					console.log('goal');
					flipSquares.push(...potentialFlips);
					expand = false;
					this.successfulMove = true;
					break;
				}
			} while(expand);
			console.log(flipSquares)
			if (flipSquares.length > 0) {
				this.boardState[this.position] = this.currentPlayer;
				flipSquares.forEach((item) => {
					this.boardState[item] = this.currentPlayer;
				})
			}
			
		});
		return {newBoard: this.boardState, successfulMove: this.successfulMove};
	}

	
	// -> loop until goal reached or direction fails.
	// if goal is reached, array of positions will be returned.
	// -> add to that array for each of the directions.
	// -> use that array to flip squares on board.

	// maybe for() and do...while()?
}

export default TestLogic;

// TIMING FUNCTIONS
// https://developer.mozilla.org/en-US/docs/Web/API/Console/time
// let counter = 0;
// function foo() {
//   for(let i = 0; i < 63; i++) {
//     counter += i;
//   }
// }

// console.time ('foo');
// foo();
// console.timeEnd('foo');
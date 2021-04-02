import Player from './Player.js';

class SquareNode {
	constructor(position, initialMove, direction, board, currentPlayer, nextPlayer) {
		this.initialMove = initialMove;
		this.direction = direction;
		this.position = position;
		this.board = board;
		this.nextSquare = null;
		this.endCondition = null;
		this.goalReached = false;
		this.expandNext = false;
		this.directionFail = false;
		this.setNextSquare();
		this.currentPlayer = currentPlayer;
		this.nextPlayer = nextPlayer;
		this.setBoard();
	}

	setBoard() {
		this.board[this.position] = this.currentPlayer;
	}

	getNodeInfo() {
		const nodeInfo = {
			goalReached: this.goalReached,
			expandNext: this.expandNext,
			directionFail: this.directionFail,
			position: this.position
		}
		return nodeInfo;
	}

	checkGoal() {
		// if direction has reached end of board and cannot expand further -> no goal.
		if (this.endCondition) {
			this.directionFail = true;
		} else { // Check next square for goal.
			if (this.board[this.position] === this.currentPlayer) {
				this.goalReached = true;
			} else if (this.board[this.position] === 0) {
				this.directionFail = true;
			} else if (this.board[this.position] === this.nextPlayer) {
				this.expandNext = true;
			}
		}
	}

	expandNode() {
		// If this is the initial node, expand into all directions.
		if (this.initialMove) {
			const newNodeArray = [];
			if (this.board[this.position-8] === this.nextPlayer) {
				const north = new SquareNode(this.position-8, false, 'n', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(north);
			}
			if (this.board[this.position-7] === this.nextPlayer) {
				const northEast = new SquareNode(this.position-7, false, 'ne', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(northEast);
			}
			if (this.board[this.position+1] === this.nextPlayer) {
				const east = new SquareNode(this.position+1, false, 'e', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(east);
			}
			if (this.board[this.position+9] === this.nextPlayer) {
				const southEast = new SquareNode(this.position+9, false, 'se', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(southEast);
			}
			if (this.board[this.position+8] === this.nextPlayer) {
				const south = new SquareNode(this.position+8, false, 's', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(south);
			}
			if (this.board[this.position+7] === this.nextPlayer) {
				const southWest = new SquareNode(this.position+7, false, 'sw', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(southWest);
			}
			if (this.board[this.position-1] === this.nextPlayer) {
				const west = new SquareNode(this.position-1, false, 'w', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(west);
			}
			if (this.board[this.position-9] === this.nextPlayer) {
				const northWest = new SquareNode(this.position-9, false, 'nw', [...this.board], this.currentPlayer, this.nextPlayer);
				newNodeArray.push(northWest);
			}
			// Return array of new nodes for viable directions.
			return newNodeArray;
		} else {
			// return a new node
			const newNode = new SquareNode(this.nextSquare, false, this.direction, this.board, this.currentPlayer, this.nextPlayer);
			return newNode;
		}
	}

	setNextSquare() {
		switch (this.direction) {
			case 'n':
				this.nextSquare = this.position - 8;
				this.endCondition = this.position < 7;
				break;
			case 'ne':
				this.nextSquare = this.position - 7;
				this.endCondition = this.position % 8 === 7;
				break;
			case 'e':
				this.nextSquare = this.position + 1;
				this.endCondition = this.position % 8 === 7;
				break;
			case 'se':
				this.nextSquare = this.position + 9;
				this.endCondition = this.position % 8 === 7;
				break;
			case 's':
				this.nextSquare = this.position + 8;
				this.endCondition = this.position > 56;
				break;
			case 'sw':
				this.nextSquare = this.position + 7;
				this.endCondition = this.position % 8 === 0;
				break;
			case 'w':
				this.nextSquare = this.position - 1;
				this.endCondition = this.position % 8 === 0;
				break;
			case 'nw':
				this.nextSquare = this.position - 9;
				this.endCondition = this.position % 8 === 0;
				break;
			case 'all':
				break;
		}
	}
}

export default SquareNode;
const gameConfig = {
	board: [
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,'b','w',0,0,0,
		0,0,0,'w','b',0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0
	],
	weightedBoard: [
		99,-8,20,15,15,20,-8,99,
		-8,-24,-4,-3,-3,-4,-24,-8,
		20,-4,6,4,4,6,-4,20,
		15,-3,4,0,0,4,-3,15,
		15,-3,4,0,0,4,-3,15,
		20,-4,6,4,4,6,-4,20,
		-8,-24,-4,-3,-3,-4,-24,-8,
		99,-8,20,15,15,20,-8,99
	],
	patterns: [
		[1,2,3,4,5,6],
		[15,23,31,39,47,55],
		[57,58,59,60,61,62],
		[8,16,24,32,40,48]
	],
	prevBoard: [],
	addToPrevBoard: function(boardIn) {
		this.prevBoard.push(boardIn);
	},
	gameHistory: 0,
	selectedPosition: null,
	currentPlayer: 'b',
	nextPlayer: 'w',
	changePlayer: function() {
		if (this.currentPlayer === 'b') {
			this.nextPlayer = 'b';
			this.currentPlayer = 'w';
		} else {
			this.nextPlayer = 'w';
			this.currentPlayer ='b';
		}
		this.human = !this.human;
	},
	human: true
}

export default gameConfig;
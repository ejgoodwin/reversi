import gameConfig from '../gameConfig.js';
import GameLogic from './GameLogic.js';
import SearchAI from './SearchAI.js';

/*
	Player is in control of making a move.
	It will decide which route to take based on whether the player is human or computer.
*/

class Player {
	constructor() {
		this.logic = new GameLogic();
		this.minimax = new SearchAI();
	}

	makeMove() {
		// Run minimax to get position if it is the computer player's turn.
		if (!gameConfig.human) {
			gameConfig.selectedPosition = this.minimax.runSearch();
		}
		this.logic.setPosition(gameConfig.selectedPosition);
		this.logic.setPlayers(gameConfig.currentPlayer, gameConfig.nextPlayer);
		const newBoard = this.logic.checkNextItem();
		// If the click results in a successful move, assign new board state to board.
		if (newBoard.successfulMove) {
			gameConfig.board = newBoard.newBoard;
			gameConfig.prevBoard = gameConfig.board;
			// Next player.
			gameConfig.changePlayer();
			return true
		} else { // If move is unsuccessful, return false.
			return false;
		}
	}
}

export default Player;
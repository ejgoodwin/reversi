class BoardConfig {
	getConfig() {
		const config = {
			gameContainer = document.querySelector('.game');
			boardContainer = gameContainer.querySelector('.board');
			backButton = gameContainer.querySelector('.back-btn');
			wrongSquareEl = gameContainer.querySelector('.wrong-square');
			playerMessageEl = gameContainer.querySelector('.current-player');
			toggleAvailableMoves = gameContainer.querySelector('.hint-checkbox');
		}
	}
}

export default BoardConfig;
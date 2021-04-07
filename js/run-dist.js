/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _GameConfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _SearchAI_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);





class Board {
  constructor() {
    this.game = document.querySelector('.game');
    this.boardEl = this.game.querySelector('.board');
    this.backButton = this.game.querySelector('.back-btn');
    this.wrongSquareEl = this.game.querySelector('.wrong-square');
    this.playerMessageEl = this.game.querySelector('.current-player');
    this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
    this.prevBoard = [];
    this.gameConfig = new _GameConfig_js__WEBPACK_IMPORTED_MODULE_1__.default();
    this.board = this.gameConfig.getBoard();
    this.minimax = new _SearchAI_js__WEBPACK_IMPORTED_MODULE_3__.default();
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default();
    this.evaluate = new _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_2__.default();
  }

  _renderBoard() {
    this.board.forEach((row, index) => {
      //Create square button.
      const square = document.createElement('button'); // Add classes and data attributes.

      square.classList.add('board-square');
      square.dataset.position = index; // Add event listener.

      square.addEventListener('click', e => this._handleSquareClick(e));
      this.boardEl.appendChild(square);
    }); // Add back button event listener

    this.backButton.addEventListener('click', this._handleBackButton.bind(this)); // Add available moves checkbox event listener

    this.toggleAvailableMoves.addEventListener('click', this._handleCheckbox.bind(this));

    this._updatePlayerMessage();
  }

  _updatePlayerMessage() {
    this.playerMessageEl.dataset.player = this.gameConfig.getCurrentPlayer();
  }

  _wrongSquareMessage() {
    this.wrongSquareEl.innerHTML = 'Square unavailable, try again!';
    setTimeout(() => {
      this.wrongSquareEl.innerHTML = '';
    }, 2000);
  }

  _handleBackButton() {
    // Assign the previous board to the current board.
    this.board = this.prevBoard; // Colour square to show prev (now current) board.

    this._colourSquares(); // Switch player back.


    this.gameConfig.changePlayer();

    this._updatePlayerMessage(); // Add `disabled` attribute to only allow one back move.


    this.backButton.setAttribute('disabled', ''); // Remove and reapply available squares.

    this._removeAvailableSquares();

    this._checkWinner();
  }

  _handleCheckbox() {
    if (this.toggleAvailableMoves.checked) {
      this.game.classList.add('show-hints');
    } else {
      this.game.classList.remove('show-hints');
    }
  }

  _handleSquareClick(e) {
    // Get clicked square's array index.
    const position = parseInt(e.target.dataset.position); // Check clicked square is available.

    if (this.board[position] != 0) {
      return;
    } // Make a move.


    this._makeMove(position, true); // Enable back button.


    if (this.prevBoard.length > 0) {
      this.backButton.removeAttribute('disabled');
    }
  }

  _makeMove(position, humanPlayer) {
    let currentPlayer = this.gameConfig.getCurrentPlayer();
    let nextPlayer = this.gameConfig.getNextPlayer(); // Run minimax to get position if it is the computer player's turn.

    if (!humanPlayer) {
      this.minimax.setBoard([...this.board]);
      this.minimax.setPlayers(currentPlayer, nextPlayer);
      position = this.minimax.runSearch();
    }

    this.logic.setPlayers(currentPlayer, nextPlayer);
    this.logic.setPosition(position);
    this.logic.setBoard([...this.board]);
    const newBoard = this.logic.checkNextItem(); // If the click results in a successful move, assign new board state to board.

    if (newBoard.successfulMove) {
      this.prevBoard = this.board;
      this.board = newBoard.newBoard;

      this._colourSquares(); // Next player.


      this.gameConfig.changePlayer();

      this._updatePlayerMessage(); // Remove available square colours


      this._removeAvailableSquares();
    } else {
      // if clicked square is not available, show message.
      this._wrongSquareMessage();

      return;
    } // Check if any winners


    this._checkWinner();

    if (humanPlayer) {
      // Make a move for computer player
      setTimeout(() => {
        this._makeMove(null, false);
      }, 500); // Check if any winners after computer's move.

      this._checkWinner();
    }
  }

  _colourSquares() {
    // Loop through board array to find the black and white positions.
    // Set data attribute for the squares should be black or white.
    const squaresAll = document.querySelectorAll('.board-square');
    this.board.forEach((square, rowIndex) => {
      if (square === 'b') {
        squaresAll[rowIndex].dataset.player = 'b';
      } else if (square === 'w') {
        squaresAll[rowIndex].dataset.player = 'w';
      } else if (square === 0) {
        squaresAll[rowIndex].dataset.player = '';
      }
    });
  }

  _colourAvailableSquares(availableSquares) {
    const squaresAll = document.querySelectorAll('.board-square');
    availableSquares.forEach(available => {
      console.log(squaresAll[available]);
      squaresAll[available].dataset.available = true;
    });
  }

  _removeAvailableSquares() {
    const squaresAll = document.querySelectorAll('.board-square');
    squaresAll.forEach(square => {
      square.dataset.available = false;
    });
  }

  _checkWinner() {
    const currentPlayer = this.gameConfig.getCurrentPlayer();
    const nextPlayer = this.gameConfig.getNextPlayer();
    this.evaluate.setPlayers(currentPlayer, nextPlayer);
    this.evaluate.setBoard([...this.board]);
    console.log(currentPlayer);
    const availableSquares = this.evaluate.evaluateBoard();

    this._colourAvailableSquares(availableSquares); // Find winner if no available squares.


    if (availableSquares.length === 0) {
      console.log(this.board);
      const results = this.evaluate.returnResult();

      this._displayResults(results);
    }
  }

  _displayResults(results) {
    const winnerEl = document.querySelector('.results-winner');
    document.querySelector('.results').classList.add('show-results');
    document.querySelector('.results-black').innerHTML = results['b'];
    document.querySelector('.results-white').innerHTML = results['w'];

    if (results['b'] === results['w']) {
      winnerEl.innerHTML = 'Draw!';
    } else if (results['b'] > results['w']) {
      winnerEl.innerHTML = 'Black wins!';
    } else {
      winnerEl.innerHTML = 'White wins!';
    } // Disable back button when there is a winner.


    this.backButton.setAttribute('disabled', true);
  }

  init() {
    this._renderBoard();

    this._colourSquares();

    this._checkWinner();
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Board);

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class GameLogic {
  constructor() {
    this.boardState = [];
    this.currentPlayer = null;
    this.nextPlayer = null;
    this.position = null;
    this.successfulMove = false;
  }

  setPosition(position) {
    this.position = position;
  }

  setBoard(board) {
    this.boardState = board;
  }

  setPlayers(currentPlayer, nextPlayer) {
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
  }

  checkNextItem() {
    let condition;
    let decrement;
    let increment;
    let calcVar;
    let remainder = this.position % 8;
    this.successfulMove = false; // North

    if (this.boardState[this.position - 8] === this.nextPlayer) {
      condition = 0;
      decrement = 8;

      this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'n');
    } // South.


    if (this.boardState[this.position + 8] === this.nextPlayer) {
      condition = 64;
      increment = 8;

      this._evaluationFunctionPositive([...this.boardState], condition, increment, 's');
    } // Check position is not at right edge of board.


    if (remainder != 7) {
      // Northeast.
      if (this.boardState[this.position - 7] === this.nextPlayer) {
        condition = this.position;
        decrement = 7; // Find most northeasterly square.

        while (condition % 8 != 7 && condition >= 0) {
          condition -= decrement;
        }

        this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'ne');
      } // East.


      if (this.boardState[this.position + 1] === this.nextPlayer) {
        calcVar = this.position % 8;
        condition = this.position + (7 - calcVar);
        increment = 1;

        this._evaluationFunctionPositive([...this.boardState], condition, increment, 'e');
      } // Southeast.


      if (this.boardState[this.position + 9] === this.nextPlayer) {
        condition = this.position;
        increment = 9; // Find most southeasterly square.

        while (condition % 8 != 7 && condition >= 0) {
          condition += increment;
        }

        this._evaluationFunctionPositive([...this.boardState], condition, increment, 'se');
      }
    } // Check position is not at left edge of board.


    if (remainder != 0) {
      // Southwest.
      if (this.boardState[this.position + 7] === this.nextPlayer) {
        condition = this.position;
        increment = 7; // Find most southwesterly square.

        while (condition % 8 != 0) {
          condition += increment;
        }

        this._evaluationFunctionPositive([...this.boardState], condition, increment, 'sw');
      } // West.


      if (this.boardState[this.position - 1] === this.nextPlayer) {
        calcVar = this.position % 8;
        condition = this.position - calcVar;
        decrement = 1;

        this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'w');
      } // Northwest.


      if (this.boardState[this.position - 9] === this.nextPlayer) {
        condition = this.position;
        decrement = 9; // Find most northwesterly square.

        while (condition % 8 != 0) {
          condition -= decrement;
        }

        this._evaluationFunctionNegative([...this.boardState], condition, decrement, 'nw');
      }
    }

    return {
      newBoard: this.boardState,
      successfulMove: this.successfulMove
    };
  }

  _evaluationFunctionPositive(board, condition, increment, direction) {
    board[this.position] = this.currentPlayer;

    for (let i = this.position + increment; i < condition; i += increment) {
      // If the next square belongs to currentPlayer, cannot be flipped -> break.
      if (board[i] === this.currentPlayer) break; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i + increment] === 0) {
          return;
        } else if (board[i + increment] === this.currentPlayer) {
          this.boardState = board; // console.log('direction: ' + direction + ' increment: ' + increment + ' condition: ' + condition);

          this.successfulMove = true;
          return;
        }
      }
    }

    ;
  }

  _evaluationFunctionNegative(board, condition, decrement, direction) {
    // console.log('checking')
    board[this.position] = this.currentPlayer;

    for (let i = this.position - decrement; i > condition; i -= decrement) {
      // If the next square belongs to currentPlayer, cannot be flipped -> break.
      if (board[i] === this.currentPlayer) break; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i - decrement] === 0) {
          return;
        } else if (board[i - decrement] === this.currentPlayer) {
          this.boardState = board; // console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);

          this.successfulMove = true;
          return;
        }
      }
    }

    ;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (GameLogic);

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/*
	Class to look after player and board information.
	Getter and setter methods return and update values.
*/
class GameConfig {
  constructor() {
    this.currentPlayer = 'b';
    this.nextPlayer = 'w';
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'b', 'w', 0, 0, 0, 0, 0, 0, 'w', 'b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  changePlayer() {
    if (this.currentPlayer === 'b') {
      this.nextPlayer = 'b';
      this.currentPlayer = 'w';
    } else {
      this.nextPlayer = 'w';
      this.currentPlayer = 'b';
    }
  }

  getNextPlayer() {
    return this.nextPlayer;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getBoard() {
    return this.board;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (GameConfig);

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


class BoardEvaluation {
  constructor() {
    this.currentPlayer = null;
    this.nextPlayer = null;
    this.boardCurrentState = [];
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default();
  }

  setBoard(board) {
    this.boardCurrentState = board;
  }

  setPlayers(currentPlayer, nextPlayer) {
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
  }

  evaluateBoard() {
    this.logic.setPlayers(this.currentPlayer, this.nextPlayer); // Check that there are no more available moves:
    // Loop through array and checkNextItem() for `0` squares.

    const availableSquares = [];
    this.boardCurrentState.forEach((item, index) => {
      if (item === 0) {
        // Pass the position and fresh copy of board to GameLogic.
        this.logic.setPosition(index);
        this.logic.setBoard([...this.boardCurrentState]);
        let nextItem = this.logic.checkNextItem();

        if (nextItem.successfulMove === true) {
          // This move is available -> add it to the array.
          availableSquares.push(index);
        }
      }
    }); // Return an array of available squares (empty if non available).

    return availableSquares;
  }

  returnResult() {
    // Store results in an object that will be returned.
    const results = {
      'b': 0,
      'w': 0
    }; // Loop through the board items and add 1 to corresponding key/value.

    this.boardCurrentState.forEach(item => {
      if (item === 'b') {
        results['b'] += 1;
      } else if (item === 'w') {
        results['w'] += 1;
      }
    });
    return results;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (BoardEvaluation);

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


class SearchAI {
  constructor() {
    this.board = null;
    this.currentPlayer = null;
    this.nextPlayer = null;
    this.logic = null;
    this.weightedBoard = [99, -8, 20, 15, 15, 20, -8, 99, -8, -24, -4, -3, -3, -4, -24, -8, 20, -4, 6, 4, 4, 6, -4, 20, 15, -3, 4, 0, 0, 4, -3, 15, 15, -3, 4, 0, 0, 4, -3, 15, 20, -4, 6, 4, 4, 6, -4, 20, -8, -24, -4, -3, -3, -4, -24, -8, 99, -8, 20, 15, 15, 20, -8, 99];
    this.patterns = [[1, 2, 3, 4, 5, 6], [15, 23, 31, 39, 47, 55], [57, 58, 59, 60, 61, 62], [8, 16, 24, 32, 40, 48]];
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
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default();
    this.logic.setPlayers(this.currentPlayer, this.nextPlayer);
  }

  runSearch() {
    console.log(this.currentPlayer);
    const selectedMove = this.minimax(this.board, this.currentPlayer, 0).index;
    return selectedMove;
  }

  minimax(testBoard, player, depth) {
    // Find available squares.
    const availSquares = this.evaluateBoard(testBoard); // If end of depth, see who has the best score.

    if (depth === 2 || availSquares.length < 1) {
      const score = this.boardValue(player, testBoard);
      return {
        score: score
      };
    } // Start min/max


    if (player === 'w') {
      let bestScore = {};
      bestScore.score = -1000; // loop through available squares.

      for (let i = 0; i < availSquares.length; i++) {
        // assign player to the current square.
        testBoard[availSquares[i]] = player; // store result of minimax -> returns 'bestScore', i.e. {score, index}

        let result = this.minimax(testBoard, 'b', depth + 1); // Find the MAXIMUM score

        if (result.score > bestScore.score) {
          bestScore.score = result.score;
          bestScore.index = availSquares[i];
        } // console.log(result);
        // console.log(bestScore);
        // console.log(depth);
        // Reset current square to null 
        // -> next iteration needs to see state of board prior to that potential move


        testBoard[availSquares[i]] = 0;
      } // console.log(bestScore);


      return bestScore;
    } else {
      let bestScore = {};
      bestScore.score = 1000;

      for (let i = 0; i < availSquares.length; i++) {
        testBoard[availSquares[i]] = player;
        let result = this.minimax(testBoard, 'w', depth + 1); // Find the MINIMUM score

        if (result.score < bestScore.score) {
          bestScore.score = result.score;
          bestScore.index = availSquares[i];
        }

        testBoard[availSquares[i]] = 0;
      } // console.log(bestScore);


      return bestScore;
    }
  }

  boardValue(player, testBoard) {
    let score = 0; // Compare player's squares agains weighted board.

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
    const availableSquares = []; // console.log(board);

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
    }); // Return an array of available squares (empty if non available).

    return availableSquares;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (SearchAI);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const board = new _components_Board_js__WEBPACK_IMPORTED_MODULE_0__.default();
board.init();
}();
/******/ })()
;
//# sourceMappingURL=run-dist.js.map
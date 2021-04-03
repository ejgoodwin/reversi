/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _SearchAI_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);





class Board {
  constructor() {
    this.game = document.querySelector('.game');
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'b', 'w', 0, 0, 0, 0, 0, 0, 'w', 'b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.prevBoard = [];
    this.boardEl = this.game.querySelector('.board');
    this.backButton = this.game.querySelector('.back-btn');
    this.player = new _Player_js__WEBPACK_IMPORTED_MODULE_1__.default();
    this.wrongSquareEl = this.game.querySelector('.wrong-square');
    this.playerMessageEl = this.game.querySelector('.current-player');
    this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
    this.minimax = new _SearchAI_js__WEBPACK_IMPORTED_MODULE_3__.default();
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
    this.playerMessageEl.dataset.player = this.player.getCurrentPlayer();
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


    this.player.changePlayer();

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
    }

    let currentPlayer = this.player.getCurrentPlayer();
    let nextPlayer = this.player.getNextPlayer();
    const takeTurn = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(currentPlayer, nextPlayer);
    takeTurn.setPosition(position);
    takeTurn.setBoard([...this.board]);
    console.time('checkNext');
    const newBoard = takeTurn.checkNextItem();
    console.timeEnd('checkNext'); // If the click results in a successful move, assign new board state to board.

    if (newBoard.successfulMove) {
      this.prevBoard = this.board;
      this.board = newBoard.newBoard;

      this._colourSquares(); // Next player.


      this.player.changePlayer();

      this._updatePlayerMessage(); // Remove available square colours


      this._removeAvailableSquares();

      console.log(currentPlayer); // Use minimax for next player

      currentPlayer = this.player.getCurrentPlayer();
      nextPlayer = this.player.getNextPlayer();
      this.minimax.setBoard([...this.board]);
      this.minimax.setPlayers(currentPlayer, nextPlayer);
      const aiMove = this.minimax.runSearch();
      console.log(aiMove); // Apply that move

      const aiTurn = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(currentPlayer, nextPlayer);
      aiTurn.setPosition(aiMove);
      aiTurn.setBoard([...this.board]);
      const newAiBoard = aiTurn.checkNextItem();
      console.log(aiTurn);

      if (newAiBoard.successfulMove) {
        this.prevBoard = this.board;
        this.board = newAiBoard.newBoard;

        this._colourSquares(); // Next player.


        this.player.changePlayer();

        this._updatePlayerMessage(); // Remove available square colours


        this._removeAvailableSquares();
      }
    } else {
      // if clicked square is not available, show message.
      this._wrongSquareMessage();
    } // Enable back button.


    if (this.prevBoard.length > 0) {
      this.backButton.removeAttribute('disabled');
    } // Check if any winners


    this._checkWinner();
  }

  _colourSquares() {
    // Loop through board array to find the black and white positions.
    // Set data attribute for the squares should be black or white.
    //console.log(this.board)
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
    const currentPlayer = this.player.getCurrentPlayer();
    const nextPlayer = this.player.getNextPlayer();
    this.evaluate = new _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_2__.default(currentPlayer, nextPlayer);
    this.evaluate.setBoard([...this.board]);
    const availableSquares = this.evaluate.evaluateBoard();

    this._colourAvailableSquares(availableSquares); // Find winner if no available squares.


    if (availableSquares.length === 0) {
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
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Board);

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class GameLogic {
  constructor(currentPlayer, nextPlayer) {
    this.boardState = [];
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
    this.position = null;
    this.successfulMove = false;
  }

  setPosition(position) {
    this.position = position;
  }

  setBoard(board) {
    this.boardState = board;
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
      this.currentPlayer = 'b';
    }
  }

  getNextPlayer() {
    return this.nextPlayer;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


class BoardEvaluation {
  constructor(currentPlayer, nextPlayer) {
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
    this.boardCurrentState = [];
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(this.currentPlayer, this.nextPlayer);
  }

  setBoard(board) {
    this.boardCurrentState = board;
  }

  evaluateBoard() {
    // Check that there are no more available moves:
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
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(this.currentPlayer, this.nextPlayer);
  }

  runSearch() {
    // console.log(this.currentPlayer);
    // this.minimax(this.board, this.currentPlayer, 3);
    const selectedMove = this.minimax(this.board, this.currentPlayer, 5).index;
    return selectedMove;
  }

  minimax(testBoard, player, depth) {
    // Find available squares.
    // console.log(testBoard);
    const availSquares = this.evaluateBoard(testBoard); // Check who's winning on current board state.

    let black = 0;
    let white = 0;

    for (let i = 0; i < testBoard.length; i++) {
      if (testBoard[i] === 'b') {
        black++;
      }

      if (testBoard[i] === 'w') {
        white++;
      }
    } // Added last minute
    // TODO: change this to an array giving weights to squares


    if (testBoard[0] === 'w' || testBoard[7] === 'w' || testBoard[56] === 'w' || testBoard[63] === 'w') {
      white += 50;
    } else if (testBoard[0] === 'b' || testBoard[7] === 'b' || testBoard[56] === 'b' || testBoard[63] === 'b') {
      black += 50;
    }

    if (depth === 0 && black > white) {
      return {
        score: -100
      };
    } else if (depth === 0 && black < white) {
      return {
        score: 100
      };
    } // Start min/max


    if (player === 'w') {
      let bestScore = {};
      bestScore.score = -1000; // loop through available squares.

      for (let i = 0; i < availSquares.length; i++) {
        // console.log(availSquares)
        // console.log(depth);
        // assign player to the current square.
        testBoard[availSquares[i]] = player; // store result of minimax -> returns 'bestScore', i.e. {score, index}

        let result = this.minimax(testBoard, 'b', depth - 1); // Find the MAXIMUM score

        if (result.score > bestScore.score) {
          bestScore.score = result.score - depth;
          bestScore.index = availSquares[i];
        } // Reset current square to null 
        // -> next iteration needs to see state of board prior to that potential move


        testBoard[availSquares[i]] = 0;
      }

      return bestScore;
    } else {
      let bestScore = {};
      bestScore.score = 1000;

      for (let i = 0; i < availSquares.length; i++) {
        testBoard[availSquares[i]] = player;
        let result = this.minimax(testBoard, 'w', depth - 1); // Find the MINIMUM score

        if (result.score < bestScore.score) {
          bestScore.score = result.score - depth;
          bestScore.index = availSquares[i];
        }

        testBoard[availSquares[i]] = 0;
      } // console.log(bestScore);


      return bestScore;
    }
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
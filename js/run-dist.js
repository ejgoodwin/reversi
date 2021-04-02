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




class Board {
  constructor() {
    this.game = document.querySelector('.game'); // this.board = [
    // 	0,0,0,0,0,0,0,0,
    // 	0,0,0,0,0,0,0,0,
    // 	0,0,0,0,0,0,0,0,
    // 	0,0,0,'b','w',0,0,0,
    // 	0,0,0,'w','b',0,0,0,
    // 	0,0,0,0,0,0,0,0,
    // 	0,0,0,0,0,0,0,0,
    // 	0,0,0,0,0,0,0,0
    // ];

    this.board = {
      black: [{
        row: 3,
        col: 3
      }, {
        row: 4,
        col: 4
      }],
      white: [{
        row: 3,
        col: 4
      }, {
        row: 4,
        col: 3
      }]
    };
    this.prevBoard = [];
    this.boardEl = this.game.querySelector('.board');
    this.backButton = this.game.querySelector('.back-btn');
    this.wrongSquareEl = this.game.querySelector('.wrong-square');
    this.playerMessageEl = this.game.querySelector('.current-player');
    this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
    this.player = new _Player_js__WEBPACK_IMPORTED_MODULE_1__.default();
    this.currentPlayer = this.player.getCurrentPlayer();
    this.nextPlayer = this.player.getNextPlayer();
    this.evaluate = new _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_2__.default();
    this.evaluate.setBoard(this.board);
    this.evaluate.setPlayers(this.currentPlayer, this.nextPlayer);
    this.evaluate.evaluateBoard();
  }

  _renderBoard() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        //Create square button.
        const square = document.createElement('button'); // Add classes and data attributes.

        square.classList.add('board-square');
        square.dataset.row = row;
        square.dataset.col = col; // Add event listener.

        square.addEventListener('click', e => this._handleSquareClick(e));
        this.boardEl.appendChild(square);
      }
    } // Add back button event listener


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
    const positionRow = parseInt(e.target.dataset.row);
    const positionCol = parseInt(e.target.dataset.col);
    const position = {
      row: positionRow,
      col: positionCol
    }; // console.log(position);
    // Check clicked square is available.

    const availBlack = this.board.black.find(item => item = position);
    const availWhite = this.board.white.find(item => item = position);

    if (availBlack || availWhite) {
      // if this combination exists in board -> this square is taken.
      return;
    } // Get player info.


    const currentPlayer = this.player.getCurrentPlayer();
    const nextPlayer = this.player.getNextPlayer(); // Take a turn.

    const takeTurn = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(currentPlayer, nextPlayer);
    takeTurn.setPosition(position);
    takeTurn.setBoard([...this.board]);
    const newBoard = takeTurn.checkNextItem(); // If the click results in a successful move, assign new board state to board.

    if (newBoard.successfulMove) {
      this.prevBoard = this.board;
      this.board = newBoard.newBoard;

      this._colourSquares(); // Next player.


      this.player.changePlayer();

      this._updatePlayerMessage(); // Remove available square colours


      this._removeAvailableSquares(); // console.log(currentPlayer);

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
    // Find squares with corresponding row/col data attributes.
    this.board.white.forEach(whiteSquare => {
      // console.log(whiteSquare);
      this.game.querySelector(`[data-row="${whiteSquare.row}"][data-col="${whiteSquare.col}"]`).dataset.player = 'w';
    });
    this.board.black.forEach(blackSquare => {
      // console.log(blackSquare);
      this.game.querySelector(`[data-row="${blackSquare.row}"][data-col="${blackSquare.col}"]`).dataset.player = 'b';
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
          this.boardState = board;
          console.log('direction: ' + direction + ' increment: ' + increment + ' condition: ' + condition);
          this.successfulMove = true;
          return;
        }
      }
    }

    ;
  }

  _evaluationFunctionNegative(board, condition, decrement, direction) {
    console.log('checking');
    board[this.position] = this.currentPlayer;

    for (let i = this.position - decrement; i > condition; i -= decrement) {
      // If the next square belongs to currentPlayer, cannot be flipped -> break.
      if (board[i] === this.currentPlayer) break; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i - decrement] === 0) {
          return;
        } else if (board[i - decrement] === this.currentPlayer) {
          this.boardState = board;
          console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);
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
/* harmony import */ var _TestLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class BoardEvaluation {
  constructor() {
    this.currentPlayer = null;
    this.nextPlayer = null;
    this.boardCurrentState = [];
    this.logic = new _TestLogic_js__WEBPACK_IMPORTED_MODULE_0__.default(this.currentPlayer, this.nextPlayer);
  }

  setBoard(board) {
    this.boardCurrentState = board;
  }

  setPlayers(currentPlayer, nextPlayer) {
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
  }

  evaluateBoard() {
    // Check that there are no more available moves:
    // Loop through array and checkNextItem() for `0` squares.
    const availableSquares = []; // this.boardCurrentState.forEach((item, index) => {
    // 	if (item === 0) {
    // 		// Pass the position and fresh copy of board to GameLogic.
    // 		this.logic.setPosition(index);
    // 		this.logic.setBoard([...this.boardCurrentState]);
    // 		let nextItem = this.logic.checkNextItem();
    // 		if (nextItem.successfulMove === true) {
    // 			// This move is available -> add it to the array.
    // 			availableSquares.push(index);
    // 		}
    // 	}
    // });

    this.logic.setBoard(this.boardCurrentState);
    this.logic.setPlayers(this.currentPlayer, this.nextPlayer);
    this.boardCurrentState.black.forEach(blackSquare => {
      this.logic.checkNextItems(blackSquare); // console.log(blackSquare);
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
    let directionPoss = true; // currentSquare.row -= 1;

    directionPoss = this.board.white.find(item => currentSquare);
    console.log(directionPoss); // do {
    // 	console.log(currentSquare);
    // 	currentSquare.row -= 1;
    // 	directionPoss = this.board.white.find(item => currentSquare);
    // } while (directionPoss);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (TestLogic);

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
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
// TODO: broken because of shallow/deep copying.
// 2d array will not be copied, so needs changing to 1d array.



class Board {
  constructor() {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'b', 'b', 'w', 0, 0, 0, 0, 0, 0, 'w', 'b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.boardEl = document.querySelector('.board');
    this.currentPlayer = null;
    this.nextPlayer = null;
    this.player = new _Player_js__WEBPACK_IMPORTED_MODULE_1__.default();
  }

  _renderBoard() {
    this.board.forEach((row, index) => {
      //Create square button.
      const square = document.createElement('button'); // Add classes and data attributes.

      square.classList.add('board-square');
      square.dataset.position = index; // Add event listener.

      square.addEventListener('click', e => this._handleSquareClick(e)); // row.forEach((item, index) => {
      // 	// Create square button.
      // 	const square = document.createElement('button');
      // 	// Add classes and data attributes.
      // 	square.classList.add('board-square');
      // 	square.dataset.position = `${boardRowNum}-${index}`;
      // 	// Add event listener.
      // 	square.addEventListener('click', (e) => this._handleSquareClick(e));
      // 	boardRow.appendChild(square);
      // });

      this.boardEl.appendChild(square);
    });
  }

  _handleSquareClick(e) {
    // Get clicked square's array index.
    const position = parseInt(e.target.dataset.position); // Check clicked square is available.

    if (this.board[position] != 0) {
      return;
    }

    const currentPlayer = this.player.returnCurrentPlayer();
    const nextPlayer = this.player.returnNextPlayer();
    const takeTurn = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_0__.default([...this.board], position, currentPlayer, nextPlayer);
    const newBoard = takeTurn.checkNextItem();

    if (newBoard) {
      this.board = newBoard;

      this._colourSquares(); // Next player.


      this.player.changePlayer();
      console.log(currentPlayer);
    }
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
      }

      ;
    });
  }

  checkWinner() {}

  init() {
    this._renderBoard();

    this._colourSquares();
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Board);

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// TODO: individual direction methods work but combined evaluation doesn't.
class GameLogic {
  constructor(board, position, currentPlayer, nextPlayer) {
    this.boardState = board;
    this.currentPlayer = currentPlayer;
    this.nextPlayer = nextPlayer;
    this.position = position;
  }

  checkNextItem() {
    // North
    if (this.boardState[this.position - 8] === this.nextPlayer) {
      let initialExp = -8;
      let x = Math.floor(this.position / 8);
      let condition = this.position - x * 8;
      let increment = -8; //this._evaluationFunctionNegative([...this.boardState], initialExp, condition, increment);

      this._checkNorth([...this.boardState], this.position);
    } // East


    if (this.boardState[this.position + 1] === this.nextPlayer) {
      let initialExp = 1;
      let x = this.position % 8;
      let condition = this.position + (7 - x);
      let increment = 1; //this._evaluationFunctionPositive([...this.boardState], initialExp, condition, increment);

      this._checkEast([...this.boardState], this.position);
    }

    return this.boardState;
  }

  _checkNorth(board, index) {
    // Flip clicked square.
    board[index] = this.currentPlayer; // Find loop limit.

    const divided = Math.floor(index / 8);
    const limit = index - divided * 8;

    for (let i = index - 8; i >= limit; i -= 8) {
      if (board[i] === this.currentPlayer) return; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i - 8] === this.currentPlayer) {
          this.boardState = board;
          return;
        }
      }
    }
  }

  _checkEast(board, index) {
    // Flip clicked square.
    board[index] = this.currentPlayer;
    const x = index % 8;

    for (let i = index + 1; i <= index + (7 - x); i++) {
      // If the next square belongs to currentPlayer, cannot be flipped -> break.
      if (board[i] === this.currentPlayer) return; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i + 1] === this.currentPlayer) {
          this.boardState = board;
          return;
        }
      }
    }

    ;
  }

  _evaluationFunctionPositive(board, initialExp, condition, increment) {
    board[this.position] = this.currentPlayer;

    for (let i = this.position + initialExp; i <= condition; i += increment) {
      console.log('i = ' + i); // If the next square belongs to currentPlayer, cannot be flipped -> break.

      if (board[i] === this.currentPlayer) break; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i + initialExp] === this.currentPlayer) {
          this.boardState = board;
          return;
        }
      }
    }

    ;
  }

  _evaluationFunctionNegative(board, initialExp, condition, increment) {
    board[this.position] = this.currentPlayer;

    for (let i = this.position + initialExp; i >= condition; i -= increment) {
      console.log('i = ' + i); // If the next square belongs to currentPlayer, cannot be flipped -> break.

      if (board[i] === this.currentPlayer) break; // Check next item -> if it belongs to opponent, flip it to currentPlayer.

      if (board[i] === this.nextPlayer) {
        board[i] = this.currentPlayer;

        if (board[i - initialExp] === this.currentPlayer) {
          this.boardState = board;
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

"use strict";
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

  returnNextPlayer() {
    return this.nextPlayer;
  }

  returnCurrentPlayer() {
    return this.currentPlayer;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),
/* 4 */
/***/ (function() {

class BoardEvaluation {
  constructor(board) {
    this.boardCurrentState = board;
  }

  evaluateBoard() {}

  returnResult() {}

}

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);



const board = new _Board_js__WEBPACK_IMPORTED_MODULE_0__.default('Erica');
board.init();
}();
/******/ })()
;
//# sourceMappingURL=run-dist.js.map
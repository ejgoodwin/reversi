/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);




class Board {
  constructor() {
    this.game = document.querySelector('.game');
    this.boardEl = this.game.querySelector('.board');
    this.historyButtonBack = this.game.querySelector('[data-direction="back"]');
    this.historyButtonForward = this.game.querySelector('[data-direction="forward"]');
    this.wrongSquareEl = this.game.querySelector('.wrong-square');
    this.playerMessageEl = this.game.querySelector('.current-player');
    this.toggleAvailableMoves = this.game.querySelector('.hint-checkbox');
    this.player = new _Player_js__WEBPACK_IMPORTED_MODULE_1__.default();
    this.evaluate = new _BoardEvaluation_js__WEBPACK_IMPORTED_MODULE_0__.default();
  }

  _renderBoard() {
    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.board.forEach((row, index) => {
      //Create square button.
      const square = document.createElement('button'); // Add classes and data attributes.

      square.classList.add('board-square');
      square.dataset.position = index; // Add event listener.

      square.addEventListener('click', e => this._handleSquareClick(e));
      this.boardEl.appendChild(square);
    }); // Add history button event listeners

    this.historyButtonBack.addEventListener('click', e => this._handleHistoryButton(e));
    this.historyButtonForward.addEventListener('click', e => this._handleHistoryButton(e)); // Add available moves checkbox event listener

    this.toggleAvailableMoves.addEventListener('click', this._handleCheckbox.bind(this));

    this._updatePlayerMessage();

    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.addToPrevBoard(_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.board);
  }

  _updatePlayerMessage() {
    this.playerMessageEl.dataset.player = _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.currentPlayer;
  }

  _wrongSquareMessage() {
    this.wrongSquareEl.innerHTML = 'Square unavailable, try again!';
    setTimeout(() => {
      this.wrongSquareEl.innerHTML = '';
    }, 2000);
  }

  _handleHistoryButton(e) {
    if (e.target.dataset.direction === 'back') {
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.gameHistory--;
    } else if (e.target.dataset.direction === 'forward') {
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.gameHistory++;
    } // Add disabled for forward and back when you reach end or start of prevBoard array.


    if (_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.gameHistory < _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.prevBoard.length - 1) {
      this.historyButtonForward.removeAttribute('disabled');
      this.boardEl.classList.add('board--locked');
    } else {
      this.historyButtonForward.setAttribute('disabled', '');
      this.boardEl.classList.remove('board--locked');
    }

    if (_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.gameHistory === 0) {
      this.historyButtonBack.setAttribute('disabled', '');
    } else {
      this.historyButtonBack.removeAttribute('disabled');
    } // Assign the previous board to the current board.


    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.board = _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.prevBoard[_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.gameHistory]; // Colour square to show prev (now current) board.

    this._colourSquares(); // Switch player back.


    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.changePlayer();

    this._updatePlayerMessage(); // Remove and reapply available squares.


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
    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.selectedPosition = parseInt(e.target.dataset.position); // Check clicked square is available.

    if (_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.board[_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.selectedPosition] != 0) {
      return;
    } // Make a move.


    this._makeMove(); // Enable back buttons.


    this.historyButtonBack.removeAttribute('disabled');
  }

  _makeMove() {
    const move = this.player.makeMove(); // If move is successful -> colour squares, check for winner.

    if (move) {
      this._colourSquares();

      this._updatePlayerMessage(); // Remove available square colours


      this._removeAvailableSquares(); // Check if any winners.


      this._checkWinner(); // Run again as computer player.


      if (!_gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.human) {
        setTimeout(() => {
          this._makeMove();
        }, 500);

        this._checkWinner();
      }
    } else {
      // if clicked square is not available, show message.
      this._wrongSquareMessage();
    }
  }

  _colourSquares() {
    // Loop through board array to find the black and white positions.
    // Set data attribute for the squares should be black or white.
    const squaresAll = document.querySelectorAll('.board-square');
    _gameConfig_js__WEBPACK_IMPORTED_MODULE_2__.default.board.forEach((square, rowIndex) => {
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
    const availableSquares = this.evaluate.evaluateBoard();

    this._colourAvailableSquares(availableSquares); // Find winner if no available squares.


    if (availableSquares.length === 0) {
      const results = this.evaluate.returnResult();

      this._displayResults(results);
    }
  }

  _displayResults(results) {
    console.log(results);
    const winnerEl = document.querySelector('.results');
    winnerEl.querySelector('.results-black').innerHTML = results.b;
    winnerEl.querySelector('.results-white').innerHTML = results.w;

    if (results['b'] === results['w']) {
      winnerEl.dataset.winner = 'draw';
    } else if (results['b'] > results['w']) {
      winnerEl.dataset.winner = 'black';
    } else {
      winnerEl.dataset.winner = 'white';
    } // Disable back button when there is a winner.
    // this.backButton.setAttribute('disabled', true);
    // this.forwardButton.setAttribute('disabled', true);

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
/* harmony import */ var _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



class BoardEvaluation {
  constructor() {
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__.default();
  }

  evaluateBoard() {
    this.logic.setPlayers(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.currentPlayer, _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.nextPlayer); // Check that there are no more available moves:
    // Loop through array and checkNextItem() for `0` squares.

    const availableSquares = [];
    _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board.forEach((item, index) => {
      if (item === 0) {
        // Pass the position and fresh copy of board to GameLogic.
        this.logic.setPosition(index);
        this.logic.setBoard([..._gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board]);
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

    _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board.forEach(item => {
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
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const gameConfig = {
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'b', 'w', 0, 0, 0, 0, 0, 0, 'w', 'b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  weightedBoard: [99, -8, 20, 15, 15, 20, -8, 99, -8, -24, -4, -3, -3, -4, -24, -8, 20, -4, 6, 4, 4, 6, -4, 20, 15, -3, 4, 0, 0, 4, -3, 15, 15, -3, 4, 0, 0, 4, -3, 15, 20, -4, 6, 4, 4, 6, -4, 20, -8, -24, -4, -3, -3, -4, -24, -8, 99, -8, 20, 15, 15, 20, -8, 99],
  patterns: [[1, 2, 3, 4, 5, 6], [15, 23, 31, 39, 47, 55], [57, 58, 59, 60, 61, 62], [8, 16, 24, 32, 40, 48]],
  prevBoard: [],
  addToPrevBoard: function (boardIn) {
    this.prevBoard.push(boardIn);
  },
  gameHistory: 0,
  selectedPosition: null,
  currentPlayer: 'b',
  nextPlayer: 'w',
  changePlayer: function () {
    if (this.currentPlayer === 'b') {
      this.nextPlayer = 'b';
      this.currentPlayer = 'w';
    } else {
      this.nextPlayer = 'w';
      this.currentPlayer = 'b';
    }

    this.human = !this.human;
  },
  human: true
};
/* harmony default export */ __webpack_exports__["default"] = (gameConfig);

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


class GameLogic {
  constructor() {
    this.currentPlayer = _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.currentPlayer;
    this.nextPlayer = _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.nextPlayer;
    this.board = _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board;
    this.successfulMove = false;
    this.position = _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.selectedPosition;
  }

  setPlayers(currentIn, nextIn) {
    this.currentPlayer = currentIn;
    this.nextPlayer = nextIn;
  }

  setBoard(boardIn) {
    this.board = boardIn;
  }

  setPosition(positionIn) {
    this.position = positionIn;
  }

  checkNextItem() {
    let condition;
    let decrement;
    let increment;
    let calcVar;
    let remainder = this.position % 8;
    this.successfulMove = false; // North

    if (this.board[this.position - 8] === this.nextPlayer) {
      condition = 0;
      decrement = 8;

      this._evaluationFunctionNegative([...this.board], condition, decrement, 'n');
    } // South.


    if (this.board[this.position + 8] === this.nextPlayer) {
      condition = 64;
      increment = 8;

      this._evaluationFunctionPositive([...this.board], condition, increment, 's');
    } // Check position is not at right edge of board.


    if (remainder != 7) {
      // Northeast.
      if (this.board[this.position - 7] === this.nextPlayer) {
        condition = this.position;
        decrement = 7; // Find most northeasterly square.

        while (condition % 8 != 7 && condition >= 0) {
          condition -= decrement;
        }

        this._evaluationFunctionNegative([...this.board], condition, decrement, 'ne');
      } // East.


      if (this.board[this.position + 1] === this.nextPlayer) {
        calcVar = this.position % 8;
        condition = this.position + (7 - calcVar);
        increment = 1;

        this._evaluationFunctionPositive([...this.board], condition, increment, 'e');
      } // Southeast.


      if (this.board[this.position + 9] === this.nextPlayer) {
        condition = this.position;
        increment = 9; // Find most southeasterly square.

        while (condition % 8 != 7 && condition >= 0) {
          condition += increment;
        }

        this._evaluationFunctionPositive([...this.board], condition, increment, 'se');
      }
    } // Check position is not at left edge of board.


    if (remainder != 0) {
      // Southwest.
      if (this.board[this.position + 7] === this.nextPlayer) {
        condition = this.position;
        increment = 7; // Find most southwesterly square.

        while (condition % 8 != 0) {
          condition += increment;
        }

        this._evaluationFunctionPositive([...this.board], condition, increment, 'sw');
      } // West.


      if (this.board[this.position - 1] === this.nextPlayer) {
        calcVar = this.position % 8;
        condition = this.position - calcVar;
        decrement = 1;

        this._evaluationFunctionNegative([...this.board], condition, decrement, 'w');
      } // Northwest.


      if (this.board[this.position - 9] === this.nextPlayer) {
        condition = this.position;
        decrement = 9; // Find most northwesterly square.

        while (condition % 8 != 0) {
          condition -= decrement;
        }

        this._evaluationFunctionNegative([...this.board], condition, decrement, 'nw');
      }
    }

    return {
      newBoard: this.board,
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
          this.board = board; // console.log('direction: ' + direction + ' increment: ' + increment + ' condition: ' + condition);

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
          this.board = board; // console.log('direction: ' + direction + ' decrement: ' + decrement + ' condition: ' + condition);

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
/* 5 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _SearchAI_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);



/*
	Player is in control of making a move.
	It will decide which route to take based on whether the player is human or computer.
*/

class Player {
  constructor() {
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__.default();
    this.minimax = new _SearchAI_js__WEBPACK_IMPORTED_MODULE_2__.default();
  }

  makeMove() {
    // Run minimax to get position if it is the computer player's turn.
    if (!_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.human) {
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.selectedPosition = this.minimax.runSearch();
    }

    this.logic.setPosition(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.selectedPosition);
    this.logic.setPlayers(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.currentPlayer, _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.nextPlayer);
    const newBoard = this.logic.checkNextItem(); // If the click results in a successful move, assign new board state to board.

    if (newBoard.successfulMove) {
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board = newBoard.newBoard;
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.gameHistory++;
      console.log(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.gameHistory);
      _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.prevBoard.push(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board);
      console.log(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.prevBoard); // Next player.

      _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.changePlayer();
      return true;
    } else {
      // If move is unsuccessful, return false.
      return false;
    }
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



class SearchAI {
  constructor() {
    this.logic = new _GameLogic_js__WEBPACK_IMPORTED_MODULE_1__.default();
  }

  runSearch() {
    return this._minimax([..._gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.board], _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.currentPlayer, 0).index;
  }

  _minimax(testBoard, player, depth) {
    // Find available squares.
    const availSquares = this._evaluateBoard(testBoard); // If end of depth, see who has the best score.


    if (depth === 4 || availSquares.length < 1) {
      const score = this._boardValue(player, testBoard);

      return {
        score: score
      };
    } // Start min/max


    if (player === 'w') {
      let bestScore = {};
      bestScore.score = -1000; // loop through available squares.

      for (let i = 0; i < availSquares.length; i++) {
        // assign player to the current square.
        testBoard[availSquares[i]] = player; // store result of _minimax

        let result = this._minimax(testBoard, 'b', depth + 1); // Find the MAXIMUM score


        if (result.score > bestScore.score) {
          bestScore.score = result.score;
          bestScore.index = availSquares[i];
        } // Reset current square to null 
        // -> next iteration needs to see state of board prior to that potential move


        testBoard[availSquares[i]] = 0;
      } // console.log(bestScore);


      return bestScore;
    } else {
      let bestScore = {};
      bestScore.score = 1000;

      for (let i = 0; i < availSquares.length; i++) {
        testBoard[availSquares[i]] = player;

        let result = this._minimax(testBoard, 'w', depth + 1); // Find the MINIMUM score


        if (result.score < bestScore.score) {
          bestScore.score = result.score;
          bestScore.index = availSquares[i];
        }

        testBoard[availSquares[i]] = 0;
      } // console.log(bestScore);


      return bestScore;
    }
  }

  _boardValue(player, testBoard) {
    let score = 0; // Compare player's squares agains weighted board.

    _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.weightedBoard.forEach((weight, index) => {
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

  _evaluateBoard(board) {
    // Check that there are no more available moves:
    // Loop through array and checkNextItem() for `0` squares.
    const availableSquares = [];
    board.forEach((item, index) => {
      if (item === 0) {
        // Pass the position and fresh copy of board to GameLogic.
        this.logic.setPosition(index);
        this.logic.setBoard([...board]);
        this.logic.setPlayers(_gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.currentPlayer, _gameConfig_js__WEBPACK_IMPORTED_MODULE_0__.default.nextPlayer);
        let nextItem = this.logic.checkNextItem();

        if (nextItem.successfulMove) {
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
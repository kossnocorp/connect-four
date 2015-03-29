import assert from 'power-assert';
import I from 'immutable';
import * as connectFour from './';

describe('connectFour', function() {
  describe('createBoard', function() {
    it('creates blank board', function() {
      var result = connectFour.createBoard().toJS();
      var example = [[], [], [], [], [], [], []];
      assert.deepEqual(result, example);
    });
  });

  describe('createGame', function() {
    it('create blank game', function() {
      var result = connectFour.createGame().toJS();
      var example = {
        turns: [],
        board: [[], [], [], [], [], [], []]
      };
      assert.deepEqual(result, example);
    });
  });

  describe('whoseTurn', function() {
    it('returns 1 if turns is empty', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      assert(connectFour.whoseTurn(game) == 1);
    });

    it('returns 2 if last turn was made by first player', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      assert(connectFour.whoseTurn(game) == 1);
    });

    it('returns 2 if last turn that was made by first player is invalid', function() {
      var game = I.fromJS({
        turns: [{ player: 1, column: -1, valid: false }],
        board: [[], [], [], [], [], [], []]
      });
      assert(connectFour.whoseTurn(game) == 1);
    });

    it('returns 1 if last turn was made by second player', function() {
      var game = I.fromJS({
        turns: [
          { player: 1, column: 0, valid: true },
          { player: 2, column: 0, valid: true }
        ],
        board: [[1, 2], [], [], [], [], [], []]
      });
      assert(connectFour.whoseTurn(game) == 1);
    });
  });

  describe('performTurn', function() {
    it('adds turn to turns list', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      var newGame = connectFour.performTurn(game, 0);
      var result = newGame.get('turns').toJS();
      var example = [{ player: 1, column: 0, valid: true }];
      assert.deepEqual(result, example);
    });

    it('adds player to column', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      var newGame = connectFour.performTurn(game, 2);
      var result = newGame.get('board').toJS();
      var example = [[], [], [1], [], [], [], []];
      assert.deepEqual(result, example);
    });
  });

  describe('turnIsValid', function() {
    it('returns true if turn is valid', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      assert(connectFour.turnIsValid(game, 0));
    });

    it('returns false if turn is out of boundaries', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      assert(!connectFour.turnIsValid(game, -1));
      assert(!connectFour.turnIsValid(game, 7));
    });

    it('returns false if column is full', function() {
      var game = I.fromJS({
        turns: [],
        board: [[1, 2, 1, 2, 1, 2], [], [], [], [], [], []]
      });
      assert(!connectFour.turnIsValid(game, 0));
    });

    it('retuns false if board has a winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1, 1, 1, 1],
          [],
          [],
          [],
          [],
          [],
          []
        ]
      });
      assert(!connectFour.turnIsValid(game, 0));
    });
  });

  describe('isFull', function() {
    it('returns false is board is not full', function() {
      var game = I.fromJS({
        turns: [],
        board: [[], [], [], [], [], [], []]
      });
      assert(!connectFour.isFull(game));
    });

    it('returns true is board is full', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0, 1]
        ]
      });
      assert(connectFour.isFull(game));
    });
  });

  describe('winner', function() {
    it('returns player is he is a winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1],
          [2],
          [2, 1],
          [1],
          [1, 1, 2],
          [1, 2, 1, 2],
          [2, 1, 2, 1]
        ]
      });
      assert(connectFour.winner(game) == 1);
    });

    it('returns false if there is no winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1],
          [2],
          [2, 1],
          [1],
          [1, 1, 2],
          [1, 2, 1, 2],
          [2, 1, 1, 2]
        ]
      });
      assert(!connectFour.winner(game));
    });
  });

  describe('verticalWinner', function() {
    it('returns player if he is vertical winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1, 2, 2, 2, 2],
          [],
          [1],
          [],
          [1, 1],
          [],
          [1]
        ]
      });
      assert(connectFour.verticalWinner(game) == 2);
    });

    it('returns false if there is no vertical winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1, 1, 2, 2, 2],
          [],
          [1],
          [],
          [1, 2],
          [],
          [1]
        ]
      });
      assert(!connectFour.verticalWinner(game));
    });
  });

  describe('horizontalWinner', function() {
    it('returns player if he is horizontal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1, 1],
          [1],
          [2],
          [2],
          [2, 1],
          [2],
          [1]
        ]
      });
      assert(connectFour.horizontalWinner(game) == 2);
    });

    it('returns false if there is no horizontal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1, 1],
          [1],
          [1],
          [2],
          [2, 2],
          [2],
          [1]
        ]
      });
      assert(!connectFour.horizontalWinner(game));
    });
  });

  describe('topDiagonalWinner', function() {
    it('returns player if he is top diagonal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [2, 2, 1, 1],
          [1, 2, 1, 2],
          [1, 1, 1],
          [1],
          [2, 1],
          [2],
          [1]
        ]
      });
      assert(connectFour.topDiagonalWinner(game) == 1);
    });

    it('returns false if there is no top diagonal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [2, 1, 2, 2],
          [1, 2, 1, 2],
          [1, 1, 1],
          [1],
          [2, 1],
          [2],
          [1]
        ]
      });
      assert(!connectFour.topDiagonalWinner(game));
    });
  });

  describe('bottomDiagonalWinner', function() {
    it('returns player if he is bottom diagonal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1],
          [2],
          [2, 1],
          [1],
          [1, 1, 1],
          [1, 2, 1, 2],
          [2, 2, 1, 1]
        ]
      });
      assert(connectFour.bottomDiagonalWinner(game) == 1);
    });

    it('returns false if there is no bottom diagonal winner', function() {
      var game = I.fromJS({
        turns: [],
        board: [
          [1],
          [2],
          [2, 1],
          [1],
          [1, 1, 1],
          [1, 2, 1, 2],
          [2, 1, 2, 2]
        ]
      });
      assert(!connectFour.bottomDiagonalWinner(game));
    });
  });

  describe('oppositePlayer', function() {
    it('returns 1 for 2', function() {
      assert(connectFour.oppositePlayer(1) == 2);
    });

    it('returns 2 for 1', function() {
      assert(connectFour.oppositePlayer(2) == 1);
    });
  });
});


import I from 'immutable';

export function createBoard() {
  return I.List(Array(7).fill().map(() => I.List()));
}

export function createGame() {
  return I.Map({
    turns: I.List(),
    board: createBoard()
  });
}

export function whoseTurn(game) {
  var turns = game.get('turns');

  if (turns.isEmpty()) {
    return 1;

  } else {
    var lastTurn = turns.last();
    var player = lastTurn.get('player');
    return lastTurn.get('valid') ? oppositePlayer(player) : player;
  }
}

export function performTurn(game, column) {
  var player = whoseTurn(game);

  return game
    .update('turns', function(turns) {
      return turns.push(I.Map({
        player,
        column,
        valid: turnIsValid(game, column)
      }));
    })
    .update('board', function(board) {
      return board.update(column, function(c) {
        return c.push(player);
      });
    });
}

export function turnIsValid(game, column) {
  var validColumn = column >= 0 && column <= 6;
  var columnHasSpace = validColumn && game.getIn(['board', column]).size < 6;
  var hasWinner = winner(game) != undefined;
  return validColumn && columnHasSpace && !hasWinner;
}

export function isFull(game) {
  return !game.get('board').map(function(column) {
    return column.size >= 6;
  }).contains(false);
}

export function winner(game) {
  return I.List.of(
    verticalWinner(game),
    horizontalWinner(game),
    topDiagonalWinner(game),
    bottomDiagonalWinner(game)
  ).filter((v) => !!v).first();
}

export function verticalWinner(game) {
  var board = game.get('board');

  for (var column = 0; column <= 6; column++) {
    let lastPlayer;
    let connectedCount;

    for (var row = 0; row <= 5; row++) {
      let player = board.getIn([column, row]);

      if (typeof player == 'number' && lastPlayer == player) {
        connectedCount++;
      } else {
        connectedCount = 1;
      }

      if (connectedCount >= 4) return player;

      lastPlayer = player;
    }
  }
}

export function horizontalWinner(game) {
  var board = game.get('board');

  for (var row = 0; row <= 5; row++) {
    let lastPlayer;
    let connectedCount;

    for (var column = 0; column <= 6; column++) {
      let player = board.getIn([column, row]);

      if (typeof player == 'number' && lastPlayer == player) {
        connectedCount++;
      } else {
        connectedCount = 1;
      }

      if (connectedCount >= 4) return player;

      lastPlayer = player;
    }
  }
}

export function topDiagonalWinner(game) {
  var board = game.get('board');
  var shiftedBoard = I.List(Array(12).fill().map(function(__, shiftedColumn) {
    return I.List(Array(6).fill().map(function(__, row) {
      var column = shiftedColumn - row;
      if (column >= 0 && column <= 6) {
        return board.getIn([column, row]);
      }
    }));
  }));

  for (var column = 0; column <= 11; column++) {
    let lastPlayer;
    let connectedCount;

    for (var row = 0; row <= 5; row++) {
      let player = shiftedBoard.getIn([column, row]);

      if (typeof player == 'number' && lastPlayer == player) {
        connectedCount++;
      } else {
        connectedCount = 1;
      }

      if (connectedCount >= 4) return player;

      lastPlayer = player;
    }
  }
}

export function bottomDiagonalWinner(game) {
  var board = game.get('board');
  var shiftedBoard = I.List(Array(12).fill().map(function(__, shiftedColumn) {
    return I.List(Array(6).fill().map(function(__, row) {
      var column = shiftedColumn + row;
      if (column >= 0 && column <= 6) {
        return board.getIn([column, row]);
      }
    }));
  }));

  for (var column = 0; column <= 11; column++) {
    let lastPlayer;
    let connectedCount;

    for (var row = 0; row <= 5; row++) {
      let player = shiftedBoard.getIn([column, row]);

      if (typeof player == 'number' && lastPlayer == player) {
        connectedCount++;
      } else {
        connectedCount = 1;
      }

      if (connectedCount >= 4) return player;

      lastPlayer = player;
    }
  }
}

export function oppositePlayer(player) {
  return player == 1 ? 2 : 1;
}


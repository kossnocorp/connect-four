import * as connectFour from '../game';
import prompt from 'cli-prompt';

console.log("= Connect Four\n");

nextTurn(connectFour.createGame());

function nextTurn(game) {
  console.log(`- Player #${connectFour.whoseTurn(game)}, it's your turn!`)

  renderBoard(game.get('board'));

  var winner = connectFour.winner(game);

  if (winner) {
    console.log(`# Winner is player #${winner}!`);

  } else if (connectFour.isFull(game)) {
    console.log('# Draw!');

  } else {
    prompt('- Choose the column: ', function(columnStr) {
      var column = parseInt(columnStr);

      if (column >= 0 && column <= 6) {
        console.log("\n=============================\n");
        nextTurn(connectFour.performTurn(game, column));

      } else {
        console.log('- Wrong column id!');
        nextTurn(game);
      }
    });
  }
}

function renderBoard(board) {
  var buffer = '';

  buffer += "\n--0---1---2---3---4---5---6--\n";

  for (var row = 5; row >= 0; row--) {
    for (var column = 0; column <= 6; column++) {
      buffer += `| ${board.getIn([column, row]) || ' '} `;
    }

    buffer += "|\n-----------------------------\n";
  }

  console.log(buffer);
}


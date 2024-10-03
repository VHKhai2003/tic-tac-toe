import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={"square" + (highlight ? ' highlight' : '')} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    if (winner.name) {
      status = 'Winner: ' + winner.name;
    }
    else {
      status = 'This game is a draw!'
    }
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // use 2 loop to make the squares
  const size = 3;
  const rows = [];
  for (let i = 0; i < size; i = i + 1) {
    const rowSquares = [];
    for (let j = 0; j < size; j = j + 1) {
      const squareNumber = i * size + j;
      rowSquares.push(<Square key={squareNumber} highlight={winner && winner.line && winner.line.includes(squareNumber)} value={squares[squareNumber]} onSquareClick={() => handleClick(squareNumber)} />);
    }
    rows.push(
      <div key={i} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move, gameHistory) => {
    let description;
    if (move > 0) {
      let coordinate;
      for (let i = 0; i < squares.length; i = i + 1) {
        if (squares[i] !== gameHistory[move - 1][i]) {
          coordinate = {
            x: Math.floor(i / 3),
            y: i % 3
          }
        }
      }
      if (move === currentMove) {
        description = `You are at move #${move}: (${coordinate.x}, ${coordinate.y})`;
      }
      else {
        description = `Go to move #${move}: (${coordinate.x}, ${coordinate.y})`;
      }
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        {
          move === currentMove && move !== 0
            ? description
            : <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {isAscending ? moves : moves.reverse()}
        </ol>
      </div>
      <div className="toggle-button">
        <button onClick={() => setIsAscending(!isAscending)}>toggle</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        name: squares[a],
        line: [a, b, c]
      };
    }
  }
  // check a draw
  if (!squares.some(square => square === null)) {
    // name == null imply to no one wins, and this game is a draw
    return {
      name: null,
      line: null
    }
  }
  return null;
}
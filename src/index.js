import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { deflateRaw } from 'zlib';

function Square(props) {
  return (
    <button className="square" 
    onClick={() => {
      props.onClick({value: 'X'});
    }}>
      {props.value}
    </button>
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
      return squares[a];
    }
  }
  if(squares.indexOf(null) == -1) {
    return "draw";
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return ( <Square value={this.props.squares[i]} onClick={() => {
      this.props.onClick(i) }
    }/>);
  }

  createBoard = () => {
    let board = []

    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(i*3 + j))
      }
      //Create the parent and add the children
      board.push(<div className="board-row">{children}</div>)
    }
    return board
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepCounter: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepCounter + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares }]),
      xIsNext: !this.state.xIsNext,
      stepCounter: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepCounter: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepCounter];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      //desc += " (row: " + row + ", col: " + col + ")";
      return (
        <li key={move}>
          <button onClick={() => {
            this.jumpTo(move)}}>{ (move == this.state.stepCounter) ? <b>{desc}</b> : desc}</button>
        </li>
      )
    })

    let status;
    if (winner == "draw") {
      status = "Game is a Draw!"
    } else if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
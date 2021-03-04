import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            board_history: [{squares: Array(9).fill(null)}],
            players: ['X', 'O'],
            num_of_steps: 0
        };
    }

    handleClick(i){
        const history = this.state.board_history.slice(0, this.state.num_of_steps + 1);
        const _squares_ = history[history.length - 1].squares.slice();
        if(_squares_[i] || calcWinner(_squares_)) return;
        _squares_[i] = this.state.players[this.state.num_of_steps % 2];
        this.setState({
            board_history: history.concat([{squares: _squares_}]),
            num_of_steps: this.state.num_of_steps + 1
        });
    }

    goBackTo(step){
        this.setState({
            num_of_steps: step
        });
    }

    render(){
        const history = this.state.board_history;
        const current_board = history[this.state.num_of_steps].squares;
        
        const moves = history.map((step, move) => {
            const suffix = move === 1 ? 'st':(move === 2 ? 'nd': (move === 3 ? 'rd' : 'th'));
            const dscrptn = move ? `Go to ${move}${suffix} move` : `Go to START`;
            return (
                <li key={move}>
                    <button onClick={() => this.goBackTo(move)}>{dscrptn}</button>
                </li>
            );
        });

        let status;
        const winner = calcWinner(current_board);
        if(winner) status = `👉 ${winner} 👈 has won the game! 🎉👏`;
        else if(this.state.num_of_steps === 9) status = `The game is a draw. 🤝🖖🤜🤛`;
        else status = this.state.num_of_steps ? `This is/was the state after ${this.state.num_of_steps} moves, Next player: ${this.state.players[this.state.num_of_steps % 2]}` : 'Let the game begin!';

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current_board}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
  
// ================================================================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calcWinner(squares){
    const a = [0, 3, 6];
    for (let i = 0; i < 3; i++) {
        // Cols
        if(squares[a[0] + i] && squares[a[1] + i] === squares[a[0] + i] && squares[a[2] + i] === squares[a[0] + i]){
            return squares[a[0] + i];
        }
        // Rows
        if(squares[a[i]] && squares[a[i] + 1] === squares[a[i]] && squares[a[i] + 2] === squares[a[i]]){
            return squares[a[i]];
        }
    }
    // Diags
    if(squares[a[0]] && squares[a[1] + 1] === squares[a[0]] && squares[a[2] + 2] === squares[a[0]]){
        return squares[a[0]];
    }
    if(squares[a[0] + 2] && squares[a[1] + 1] === squares[a[0] + 2] && squares[a[2]] === squares[a[0] + 2]){
        return squares[a[2]];
    }
    return null;
}
  
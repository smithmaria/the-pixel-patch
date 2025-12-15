import xImg from '../assets/X.png'
import oImg from '../assets/O.png'

import '../TicTacToe.css'

const GameBoard = ({ board, onCellClick }) => {
  return (
    <div className='ttt-board'>
      {board.map((cell, index) => (
        <button
          key={index}
          className="ttt-cell"
          onClick={() => onCellClick(index)}
          disabled={!!cell}
        >
          {cell && (
            <img
              className='ttt-img'
              src={cell === 'X' ? xImg : oImg}
              alt={cell}
              draggable={false}
            />
          )}
        </button>
      ))}
    </div>
  )
}

export default GameBoard;

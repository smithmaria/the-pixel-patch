import '../RockPaperScissors.css'

const GameBoard = ({ moves }) => {
  return (
    <>
      {moves.playerImg ? (
        <div className='game-board'>
          <img src={moves.playerImg} alt={`${moves.player} icon`} />
          <img src={moves.cpuImg} alt={`${moves.cpu} icon`} />
        </div>
      ) : (
        <div className='make-move'>Make the first move!</div>
      )}
    </>
  )
} 

export default GameBoard;

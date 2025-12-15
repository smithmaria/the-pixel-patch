import '../TicTacToe.css'

const Scoreboard = ({ playerName, score, myPlayer }) => {
  // For online mode, show scores based on which player you are
  const myScore = myPlayer === 'O' ? score.player2 : score.player1;
  const opponentScore = myPlayer === 'O' ? score.player1 : score.player2;

  return (
    <div className="ttt-scoreboard">
      <div>{playerName || 'You'}: {myScore}</div>
      <div>Ties: {score.ties}</div>
      <div>Opponent: {opponentScore}</div>
    </div>
  )
}

export default Scoreboard;

import '../TicTacToe.css'

const Scoreboard = ({ playerName, score }) => {
  return (
    <div className="ttt-scoreboard">
      <div>{playerName}: {score.player1}</div>
      <div>Ties: {score.ties}</div>
      <div>Opponent: {score.player2}</div>
    </div>
  )
}

export default Scoreboard;
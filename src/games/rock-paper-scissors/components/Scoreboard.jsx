import '../RockPaperScissors.css'

const Scoreboard = ({ playerName, score }) => {
  return (
    <div className='scoreboard'>
      <div>{playerName}: {score.player}</div>
      <div>Ties: {score.ties}</div>
      <div>CPU: {score.cpu}</div>
  </div>
  )
}

export default Scoreboard;

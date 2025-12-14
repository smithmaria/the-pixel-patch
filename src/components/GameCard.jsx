import { Link } from 'react-router-dom';

import './GameCard.css';

const GameCard = ({ imgPath, name, onGameClick }) => {
  return (
    <div onClick={onGameClick} className="game-card">
      <div className='game-img'>
        <img src={imgPath} alt="game image" />
      </div>
      <div className='game-label'>
        <div>{name}</div>
      </div>
    </div>

  )
}

export default GameCard;

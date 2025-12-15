import { Link } from 'react-router-dom';

import './GameCard.css';

const GameCard = ({ img, name, onGameClick }) => {
  return (
    <div onClick={onGameClick} className="game-card">
      <div className='game-img'>
        <img className='game-thumbnail' src={img} alt="game image" />
      </div>
      <div className='game-label'>
        <div>{name}</div>
      </div>
    </div>

  )
}

export default GameCard;

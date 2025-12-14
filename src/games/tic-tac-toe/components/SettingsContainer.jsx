import Button from '../../../components/Button/Button';
import gear from '../../../shared/assets/gear.svg'

import '../TicTacToe.css'

const SettingsContainer = ({ gameCount }) => {
  return (
    <div className='ttt-settings'>
      <div className='ttt-game-count'>Games: {gameCount}</div>
      <div className='ttt-resettings'>
        <Button
          text='End Game'
          padding='1rem 1.2rem'
          fontSize='1.2rem'
        />
        <img src={gear} alt='settings gear icon' />
      </div>
    </div>
  )
}

export default SettingsContainer;

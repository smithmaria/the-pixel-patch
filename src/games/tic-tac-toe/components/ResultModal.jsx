import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';

import '../TicTacToe.css'

const ResultModal = ({ isVisible, result, onPlayAgain, onQuit }) => {
 return (
  <Modal
    isVisible={isVisible}
  >
    {result === 'tie' && 
      <h3 className='ttt-result-header'>It's a tie!</h3>
    }
    {result !== 'tie' &&    
      <h3 className='ttt-result-header'>Player {result} wins!</h3>
    }
    <div className='ttt-result-buttons'>
      <Button 
        onClick={onPlayAgain}
        text='Play Again'
      />
      <Button 
        onClick={onQuit}
        text='Quit'
        color='greenLight'
      />
    </div>
  </Modal>
 )
}

export default ResultModal;

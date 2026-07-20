import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';

const ResultModal = ({ isVisible, message, word, gameStatus, onPlayAgain, onQuit }) => {
  return (
    <Modal
      isVisible={isVisible}
    >
      <h3 className='hangman-result-header'>{message}</h3>
      {gameStatus === 'lost' && (
        <p className='hangman-result-word'>The word was: <strong>{word}</strong></p>
      )}
      <div className='hangman-result-buttons'>
        <Button
          onClick={onPlayAgain}
          text='Play Again'
          color='greenLight'
        />
        <Button
          onClick={onQuit}
          text='Quit'
        />
      </div>
    </Modal>
  )
}

export default ResultModal;

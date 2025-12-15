import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import xImg from '../assets/X.png'
import { createRoom, getRoom, updateRoom } from '../logic/gameRoomApi';
import { getInitialBoard } from '../logic/ticTacToe';
import '../TicTacToe.css'

const ModesModal = ({ isVisible, onClose, onGameStart }) => {
  const navigate = useNavigate();

  const [view, setView] = useState('localOnline');
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocalClick = () => {
    onGameStart({ mode: 'local' });
    onClose?.();
  }

  const handleOnlineClick = () => {
    setView('startGame');
    setError('');
  }

  const handleCreateGame = async () => {
    setLoading(true);
    setError('');
    try {
      const initialState = {
        board: getInitialBoard(),
        currentPlayer: 'X',
        players: { X: true, O: false }
      };
      const data = await createRoom(initialState);
      setGameCode(data.roomId);
      setView('waitingRoom');
      
      // Poll for player 2 to join
      pollForPlayer(data.roomId);
    } catch (err) {
      setError('Failed to create game');
    } finally {
      setLoading(false);
    }
  }

  const pollForPlayer = async (roomId) => {
    const interval = setInterval(async () => {
      try {
        const room = await getRoom(roomId);
        if (room.gameState.players.O) {
          clearInterval(interval);
          onGameStart({ 
            mode: 'online', 
            roomId, 
            player: 'X',
            isHost: true 
          });
          onClose?.();
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000);

    // Store interval ID to clear on cancel
    window.currentPollInterval = interval;
  }

  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      console.log('Attempting to join room:', gameCode);
      const room = await getRoom(gameCode);
      console.log('Room data:', room);
      
      if (!room || !room.gameState) {
        setError('Game not found');
        setLoading(false);
        return;
      }
      
      if (room.gameState.players?.O) {
        setError('Game is full');
        setLoading(false);
        return;
      }
  
      // Mark player O as joined
      const updatedState = {
        ...room.gameState,
        players: { X: true, O: true }
      };
      
      console.log('Updating room with:', updatedState);
      await updateRoom(gameCode, updatedState);
      
      onGameStart({ 
        mode: 'online', 
        roomId: gameCode, 
        player: 'O',
        isHost: false 
      });
      onClose?.();
    } catch (err) {
      console.error('Join error:', err);
      if (err.message?.includes('404')) {
        setError('Game code not found');
      } else if (err.message?.includes('400')) {
        setError('Invalid game code format');
      } else {
        setError('Failed to join game. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    if (window.currentPollInterval) {
      clearInterval(window.currentPollInterval);
    }
    
    if (view === 'startGame') {
      setView('localOnline');
      setGameCode('');
      setError('');
    } else if (view === 'waitingRoom') {
      setView('startGame');
    }
  };

  const handleCancelGame = () => {
    if (window.currentPollInterval) {
      clearInterval(window.currentPollInterval);
    }
    setView('startGame');
    setGameCode('');
  };

  return (
    <Modal isVisible={isVisible}>
      <div className="ttt-modes-modal">
        {view === 'localOnline' &&
        <>
          <div className="ttt-modes-header">
            <h3>Choose Mode</h3>
            <img 
              onClick={() => {navigate('/')}} 
              className="ttt-modes-header-action" 
              src={xImg} 
              alt='cancel icon' 
            />
          </div>
          <div className="ttt-modes-options">
            <div onClick={handleLocalClick}>
              <div>Local</div>
              <div>Two players on the same computer.</div>
            </div>
            <div onClick={handleOnlineClick}>
              <div>Online Lobby</div>
              <div>Create or join an online game room.</div>
            </div>
          </div>
        </>
        }

        {view === 'startGame' && 
          <>
            <div className="ttt-modes-header">
              <h3 style={{marginRight: '8rem'}}>Game Settings</h3>
              <div onClick={handleBack}>←</div>
            </div>
            <div className="ttt-game-code">
              <label htmlFor="gameCode">Game Code</label>
              <input 
                id="gameCode"
                type="text"
                name="gameCode"
                maxLength="10"
                value={gameCode}
                onChange={e => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
              />
              {error && <div className="ttt-error">{error}</div>}
              <Button 
                onClick={handleJoinGame}
                text={loading ? 'Joining...' : 'Join Game'}
                disabled={loading}
                margin='1rem 4rem'
              />
              <div style={{textAlign: 'center', margin: '1rem 0'}}>OR</div>
              <Button 
                onClick={handleCreateGame}
                text={loading ? 'Creating...' : 'Create Game'}
                disabled={loading}
                margin='0 4rem .8rem 4rem'
              />
            </div>
          </>
        }

        {view === 'waitingRoom' &&
          <>
            <div className="ttt-modes-header">
              <h3 style={{marginRight: '8rem'}}>Game Settings</h3>
              <div onClick={handleBack}>←</div>
            </div>
            <div className="ttt-wait-rm-body">
              <div>Lobby Code: {gameCode}</div>
              <div>Waiting for player to join...</div>
              <Button 
                onClick={handleCancelGame}
                text='Cancel Game'
              />
            </div>
          </>
        }
      </div>
    </Modal>
  )
}

export default ModesModal;

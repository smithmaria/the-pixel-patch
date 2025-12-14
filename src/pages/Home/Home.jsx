import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'

import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'
import GameCard from '../../components/GameCard'
import './Home.css'

export function Home() {
  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(searchParams.get('showModal') === 'true');
  const [pendingPath, setPendingPath] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const {settings, saveSettings} = useSettings();

  const onGameClick = (path) => {
    if (!settings?.playerName) {
      setPendingPath(path);
      setShowModal(true);
    } else {
      navigate(path);
    }
  }

  const onSaveName = () => {
    if (!playerName.trim()) {
      setShowError(true);
      return;
    }

    saveSettings({
      ...settings,
      playerName: playerName.trim()
    })

    setShowModal(false);
    setPlayerName('');
    navigate(pendingPath);
  }

  return (
    <>
      <Modal
        isVisible={showModal}
      >
        <div>
          <div className='modal-header'>
            <h3>User Settings</h3>
          </div>
        </div>
        <div className='modal-body'>
          <div>Enter your player name to begin playing.</div>
          <div className='modal-input'>
            <label htmlFor="playerName">
              Player Name
            </label>
            <input 
              id='playerName'
              type='text'
              name='playerName'
              required
              maxLength="15"
              placeholder='Player Name'
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
            />
            {showError &&
            <div className='error-message'>
              Please enter a value to save.
            </div>
            }
          </div>
        </div>
        <div className='modal-buttons'>
          <Button 
            text='Save'
            onClick={onSaveName}
            padding='.8rem 1rem'
            color='greenLight'
          />
          <Button 
            text='Cancel'
            onClick={() => setShowModal(false)}
            padding='.8rem 1rem'
          />
        </div>
      </Modal>
      <div className='games-container'>
        <div className='greeting'>
          {settings?.playerName ? `Hello ${settings.playerName}!` : 'Hello!'}
        </div>
        <GameCard
          imgPath=''
          name='Rock, Paper, Scissors'
          onGameClick={() => onGameClick('/rps')}
        />
        <GameCard
          imgPath=''
          name='Tic Tac Toe'
          onGameClick={() => onGameClick('/tictactoe')}
        />
        <GameCard
          imgPath=''
          name='Wordle'
          onGameClick={() => onGameClick('/wordle')}
        />
        <GameCard
          imgPath=''
          name='Sugar Rush'
          onGameClick={() => onGameClick('/sugarrush')}
        />
      </div>
    </>
  )
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import gear from '../../../shared/assets/gear.svg'

import '../TicTacToe.css'

const SettingsContainer = ({ gameCount, onReset, setShowModal, gameMode }) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

    const gearRef = useRef();
    useEffect(() => {
      const handleClickOutside = (event) => {
        if(gearRef.current && !gearRef.current.contains(event.target)) {
          setShowSettings(false);
        } 
      };
  
      if (showSettings) {
        document.addEventListener('click', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      }
    }, [showSettings]);

  return (
    <div className='ttt-settings'>
      <div className='ttt-game-count'>Games: {gameCount}</div>
      <div className='ttt-resettings'>
        {gameMode === 'local' &&
          <>
            <Button
              text='Reset'
              padding='1rem 1.2rem'
              fontSize='1.2rem'
              onClick={onReset}
            />
            <div className='gear-container' ref={gearRef}>
            <img 
              src={gear} 
              onClick={e => {
                e.stopPropagation();
                setShowSettings(prev => !prev);}} 
              alt='settings gear icon' 
            />
            {showSettings && 
                    <div
                      className='settings-dropdown'
                      onClick={(e) => {e.stopPropagation()}}
                    >
                      <div 
                        onClick={() => {
                          setShowSettings(false);
                          onReset();
                          setShowModal(true);
                        }}
                      >
                        Change Game Mode
                      </div>
                      <div onClick={() => {navigate('/')}}>
                        Return Home
                      </div>
                    </div>
                  }
            </div>
          </>
        }
        {gameMode === 'online' &&
          <Button
            text='End Game' 
            padding='1rem 1.2rem'
            fontSize='1.2rem'
            onClick={() => navigate('/')}
          />
        }
      </div>
    </div>
  )
}

export default SettingsContainer;

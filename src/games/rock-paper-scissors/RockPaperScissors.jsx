import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSettings } from '../../context/SettingsContext'
import { beats, decideWinner, getCpuMove, updateScores } from './logic/game'

import Modal from '../../components/Modal/Modal'
import ShadowButton from '../../components/ShadowButton/ShadowButton'
import Button from '../../components/Button/Button'
import Scoreboard from './components/Scoreboard'
import GameBoard from './components/GameBoard'
import gear from '../../shared/assets/gear.svg'
import rock from './assets/rock.png'
import paper from './assets/paper.png'
import scissors from './assets/scissors.png'

import './RockPaperScissors.css'

const moveImgs = {
  rock: rock,
  paper: paper,
  scissors: scissors
}

export function RockPaperScissors() {
  const { settings, saveSettings } = useSettings();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState(settings?.games.rps.difficulty || 'normal');

  const [gameCount, setGameCount] = useState(0);
  const [score, setScore] = useState({
    player: 0,
    cpu: 0,
    ties: 0
  });
  const [currentMoves, setCurrentMoves] = useState({
    playerImg: '',
    cpuImg: ''
  });
  const [resultMsg, setResultMsg] = useState('');

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

  const onDropdownChange = ( newDifficulty ) => {
    setDifficulty(newDifficulty);
    saveSettings({
      ...settings,
      games: {
        rps: {
          difficulty: newDifficulty
        }
      }
    });
  }

  // Forces animations every move
  const [animationKey, setAnimationKey] = useState(0);
  
  const moves = Object.keys(beats);

  const playRound = (move) => {
    
    const cpuMove = getCpuMove(
      settings?.games.rps.difficulty,
      move
    );
    setCurrentMoves({
      player: move,
      playerImg: moveImgs[move],
      cpu: cpuMove,
      cpuImg: moveImgs[cpuMove]
    });
    setAnimationKey(prev => prev + 1);

    const outcome = decideWinner(move, cpuMove);
    
    setResultMsg(outcome === 'player' ? 'You win!' : outcome === 'cpu' ? 'CPU wins!' : "It's a tie!");
    setGameCount(gameCount + 1);
    setScore((score) => updateScores(score, outcome));
  }

  const onReset = () => {
    setGameCount(0);
    setScore({
      player: 0,
      cpu: 0,
      ties: 0
    });
    setCurrentMoves({
      playerImg: '',
      cpuImg: ''
    })
    setResultMsg('');
  }

  return (
    <>
      <Modal
        isVisible={showModal}
      >
        <div className='modal-header'>
          <h3>Game Settings</h3>
        </div>
        <div className='modal-body'>
          <label htmlFor='difficulty'>Difficulty</label>
          <select
            className='difficulty-dropdown'
            id='difficulty'
            name='difficulty'
            value={difficulty}
            onChange={(e) => {onDropdownChange(e.target.value)}}
          >
            <option value='easy'>Easy</option>
            <option value='normal'>Normal</option>
            <option value='hard'>Hard</option>
          </select>
        </div>
        <div className='modal-buttons'>
          <Button 
            text='Start'
            color='greenLight'
            onClick={() => {
              setShowModal(false);
              onReset();
            }}
          />
          <Button 
            text='Quit'
            onClick={() => {navigate('/')}}
          />
        </div>
      </Modal>
      <div className='rps-container'>
        <div className='rps-left'>
          <div className='moves-container'>
            {moves.map((m) => (
              <ShadowButton
                key={m}
                text={m.toUpperCase()}
                onClick={() => playRound(m)}
              />
            ))}
          </div>
          <div className='settings-container'>
            <div className='game-count'>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
            <div className='game-count'>Games: {gameCount}</div>
            <div className='resettings'>
              <Button 
                text='Reset'
                padding='1rem 1.2rem'
                onClick={() => onReset()}
              />
              <div className='gear-container' ref={gearRef}>
                <img
                  src={gear}
                  alt='settings gear icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(prev => !prev)
                  }
                }
                />
                {showSettings && 
                  <div
                    className='settings-dropdown'
                    onClick={(e) => {e.stopPropagation()}}
                  >
                    <div 
                      onClick={() => {
                        setShowSettings(false);
                        setShowModal(true);
                      }}
                    >
                      Difficulty
                    </div>
                    <div onClick={() => {navigate('/')}}>
                      Return Home
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div className='rps-right'>
          <Scoreboard 
            playerName={settings?.playerName}
            score={score}
          />
          <GameBoard 
            moves={currentMoves}
            resultMsg={resultMsg}
            key={animationKey}
          />
        </div>
      </div>
    </>
  )
}

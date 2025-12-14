import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext'

import Scoreboard from './components/Scoreboard'
import SettingsContainer from './components/SettingsContainer';

import './TicTacToe.css'

export function TicTacToe() {
  const { settings } = useSettings();

  const [gameCount, setGameCount] = useState(0);
  const [score, setScore] = useState({
    player1: 0,
    ties: 0,
    player2: 0
  });

  return (
    <>
      <div className="ttt-container">
        <div className="ttt-left">
          <Scoreboard 
            playerName={settings?.playerName}
            score={score}
          />
          <SettingsContainer
            gameCount={gameCount}
          />
        </div>
        <div className="ttt-right">

        </div>
      </div>
    </>
  )
}

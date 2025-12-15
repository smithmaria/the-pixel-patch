import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext'
import { useNavigate } from 'react-router-dom';

import Scoreboard from './components/Scoreboard'
import GameBoard from './components/Gameboard';
import SettingsContainer from './components/SettingsContainer';
import ResultModal from './components/ResultModal';

import './TicTacToe.css'
import { makeMove, checkWinner, getInitialBoard, getNextPlayer } from './logic/ticTacToe';

export function TicTacToe() {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [board, setBoard] = useState(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const [gameCount, setGameCount] = useState(0);
  const [score, setScore] = useState({
    player1: 0,
    ties: 0,
    player2: 0
  });
  const [result, setResult] = useState(null);

  const [showResultModal, setShowResultModal] = useState(false);

  const handleCellClick = (index) => {
    if (result) return;
    
    const nextBoard = makeMove(board, index, currentPlayer);
    
    if (nextBoard == board) return;
    setBoard(nextBoard);
    
    const outcome = checkWinner(nextBoard);
    
    if (outcome) {
      setResult(outcome);
      setGameCount(prev => prev + 1);
      
      setScore(prev => ({
        player1: prev.player1 + (outcome === 'X'),
        ties: prev.ties + (outcome === 'tie'),
        player2: prev.player2 + (outcome === 'O')
      }));
      setShowResultModal(true);
    } else {
      setCurrentPlayer(getNextPlayer(currentPlayer));
    }
  }

  const resetBoard = () => {
    setBoard(getInitialBoard());
    setCurrentPlayer('X');
    setResult(null);
    setShowResultModal(false);
  }

  return (
    <>
      <ResultModal 
        isVisible={showResultModal}
        result={result}
        onPlayAgain={resetBoard}
        onQuit={() => {navigate('/')}}
      />
      <div className="ttt-container">
        <div className="ttt-left">
          <Scoreboard
            playerName={settings?.playerName}
            score={score}
          />
          <div className='ttt-message'>
          </div>
          <SettingsContainer
            gameCount={gameCount}
            onReset={resetBoard}
          />
        </div>
        <GameBoard 
          board={board}
          onCellClick={handleCellClick}
        />
      </div>
    </>
  )
}

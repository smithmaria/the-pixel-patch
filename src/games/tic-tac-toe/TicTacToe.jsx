import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext'
import { useNavigate } from 'react-router-dom';

import Scoreboard from './components/Scoreboard'
import GameBoard from './components/Gameboard';
import SettingsContainer from './components/SettingsContainer';
import ResultModal from './components/ResultModal';
import ModesModal from './components/ModesModal';

import './TicTacToe.css'
import { makeMove, checkWinner, getInitialBoard, getNextPlayer } from './logic/ticTacToe';
import { getRoom, updateRoom } from './logic/gameRoomApi.js';

export function TicTacToe() {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [board, setBoard] = useState(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameMode, setGameMode] = useState(null); // 'local' or 'online'
  const [roomId, setRoomId] = useState(null);
  const [myPlayer, setMyPlayer] = useState(null); // 'X' or 'O'

  const [gameCount, setGameCount] = useState(0);
  const [score, setScore] = useState({
    player1: 0,
    ties: 0,
    player2: 0
  });
  const [result, setResult] = useState(null);

  const [showModesModal, setShowModesModal] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleGameStart = ({ mode, roomId: id, player }) => {
    setGameMode(mode);
    if (mode === 'online') {
      setRoomId(id);
      setMyPlayer(player);
    }
  };

  // Poll for game state updates in online mode
  useEffect(() => {
    if (gameMode !== 'online' || !roomId) return;

    const interval = setInterval(async () => {
      try {
        const room = await getRoom(roomId);
        const remoteState = room.gameState;
        
        setBoard(remoteState.board);
        setCurrentPlayer(remoteState.currentPlayer);
        
        const outcome = checkWinner(remoteState.board);
        if (outcome && !result) {
          handleGameEnd(outcome);
        }
      } catch (err) {
        console.error('Failed to sync game state:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, roomId, result]);

  const handleCellClick = async (index) => {
    if (result) return;
    
    // Online mode: check if it's my turn
    if (gameMode === 'online' && currentPlayer !== myPlayer) return;
    
    const nextBoard = makeMove(board, index, currentPlayer);
    if (nextBoard === board) return;
    
    setBoard(nextBoard);
    const nextPlayer = getNextPlayer(currentPlayer);
    setCurrentPlayer(nextPlayer);

    // Update remote state if online
    if (gameMode === 'online') {
      try {
        await updateRoom(roomId, {
          board: nextBoard,
          currentPlayer: nextPlayer,
          players: { X: true, O: true }
        });
      } catch (err) {
        console.error('Failed to update game state:', err);
      }
    }
    
    const outcome = checkWinner(nextBoard);
    if (outcome) {
      handleGameEnd(outcome);
    }
  }

  const handleGameEnd = (outcome) => {
    setResult(outcome);
    setGameCount(prev => prev + 1);
    
    setScore(prev => ({
      player1: prev.player1 + (outcome === 'X' ? 1 : 0),
      ties: prev.ties + (outcome === 'tie' ? 1 : 0),
      player2: prev.player2 + (outcome === 'O' ? 1 : 0)
    }));
    setShowResultModal(true);
  }

  const resetBoard = async () => {
    const newBoard = getInitialBoard();
    setBoard(newBoard);
    setCurrentPlayer('X');
    setResult(null);
    setShowResultModal(false);

    if (gameMode === 'online') {
      try {
        await updateRoom(roomId, {
          board: newBoard,
          currentPlayer: 'X',
          players: { X: true, O: true }
        });
      } catch (err) {
        console.error('Failed to reset game:', err);
      }
    }
  }

  return (
    <>
      <ResultModal 
        isVisible={showResultModal}
        result={result}
        onPlayAgain={resetBoard}
        onQuit={() => {navigate('/')}}
      />
      <ModesModal 
        isVisible={showModesModal}
        onClose={() => {setShowModesModal(false)}}
        onGameStart={handleGameStart}
      />
      <div className="ttt-container">
        <div className="ttt-left">
          <Scoreboard
            playerName={settings?.playerName}
            score={score}
            myPlayer={myPlayer}
          />
          {gameMode === 'online' && (
            <div className='ttt-message'>
              {currentPlayer === myPlayer ? 'Your turn' : "Opponent's turn"}
            </div>
          )}
          <SettingsContainer
            gameCount={gameCount}
            onEndGame={() => {navigate('/')}}
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

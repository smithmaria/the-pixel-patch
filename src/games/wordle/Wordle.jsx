import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import ResultModal from './components/ResultModal';
import './Wordle.css';

const gameConfig = {
  maxAttempts: 6,
  wordLength: 5,
};

async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${gameConfig.wordLength}`
  );
  const data = await response.json();
  return data[0];
}

async function isValidWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.ok;
  } catch (error) {
    console.error(`Failed to find word: ${word}`);
    console.error(error);
    return false;
  }
}

export function Wordle() {
  const navigate = useNavigate();

  const [targetWord, setTargetWord] = useState('');
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [grid, setGrid] = useState(
    Array(gameConfig.maxAttempts).fill(null).map(() => 
      Array(gameConfig.wordLength).fill({ letter: '', result: '' })
    )
  );
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [animatingCells, setAnimatingCells] = useState({});

  useEffect(() => {
    getRandomWord().then(word => {
      setTargetWord(word);
      console.log(word);
    });
  }, []);

  const isLetter = (key) => {
    return key.length === 1 && /[a-z]/i.test(key);
  };

  const addLetter = (letter) => {
    if (currentPosition < gameConfig.wordLength) {
      const newGrid = [...grid];
      newGrid[currentAttempt][currentPosition] = { letter, result: '' };
      setGrid(newGrid);
      
      const cellKey = `${currentAttempt}-${currentPosition}`;
      setAnimatingCells(prev => ({ ...prev, [cellKey]: 'bounceIn' }));
      
      setCurrentPosition(currentPosition + 1);
    }
  };

  const removeLetter = () => {
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1;
      const newGrid = [...grid];
      newGrid[currentAttempt][newPosition] = { letter: '', result: '' };
      setGrid(newGrid);
      setCurrentPosition(newPosition);
    }
  };

  const shakeRow = () => {
    for (let col = 0; col < gameConfig.wordLength; col++) {
      const cellKey = `${currentAttempt}-${col}`;
      setAnimatingCells(prev => ({ ...prev, [cellKey]: 'shakeX' }));
    }
  };

  const checkGuess = async (guess) => {
    const isValid = await isValidWord(guess.toLowerCase());
    if (!isValid) return null;

    const targetLetters = targetWord.toLowerCase().split('');
    const guessLetters = guess.toLowerCase().split('');

    return guessLetters.map((letter, index) => {
      if (letter === targetLetters[index]) {
        return 'correct';
      } else if (targetLetters.includes(letter)) {
        return 'misplaced';
      } else {
        return 'incorrect';
      }
    });
  };

  const revealResults = (results) => {
    const delayBetweenTileReveal = 300;
    results.forEach((result, col) => {
      setTimeout(() => {
        const cellKey = `${currentAttempt}-${col}`;
        setAnimatingCells(prev => ({ ...prev, [cellKey]: 'flipInX' }));
        
        setGrid(prevGrid => {
          const newGrid = [...prevGrid];
          newGrid[currentAttempt][col] = { 
            ...newGrid[currentAttempt][col], 
            result 
          };
          return newGrid;
        });
      }, col * delayBetweenTileReveal);
    });
  };

  const submitGuess = async () => {
    if (currentPosition < gameConfig.wordLength) {
      console.error('word incomplete');
      shakeRow();
      alert('Word incomplete!');
      return;
    }

    const userGuess = grid[currentAttempt]
      .map(cell => cell.letter)
      .join('');

    const results = await checkGuess(userGuess);

    if (!results) {
      shakeRow();
      return;
    }

    revealResults(results);

    const isWon = results.every(result => result === 'correct');
    if (isWon) {
      setResultMessage('You win!');
      setShowResultModal(true);
      setIsLocked(true);
      return;
    }

    const nextAttempt = currentAttempt + 1;
    setCurrentAttempt(nextAttempt);
    setCurrentPosition(0);

    if (nextAttempt === gameConfig.maxAttempts) {
      setIsLocked(true);
      setResultMessage('Game Over!');
      setShowResultModal(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked) return;

      if (isLetter(e.key)) {
        addLetter(e.key);
      } else if (e.key === 'Backspace') {
        removeLetter();
      } else if (e.key === 'Enter') {
        submitGuess();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentAttempt, currentPosition, isLocked, targetWord, grid]);

  const handleAnimationEnd = (cellKey) => {
    setAnimatingCells(prev => {
      const newState = { ...prev };
      delete newState[cellKey];
      return newState;
    });
  };

  const resetGame = async () => {
    const newWord = await getRandomWord();
    setTargetWord(newWord);
    console.log(newWord);
    
    setCurrentAttempt(0);
    setCurrentPosition(0);
    setGrid(
      Array(gameConfig.maxAttempts).fill(null).map(() => 
        Array(gameConfig.wordLength).fill({ letter: '', result: '' })
      )
    );
    setShowResultModal(false);
    setResultMessage('');
    setIsLocked(false);
    setAnimatingCells({});
  };

  return (
    <>
      <ResultModal 
        isVisible={showResultModal}
        message={resultMessage}
        onPlayAgain={resetGame}
        onQuit={() => {navigate('/')}}
      />
      <div id="game">
        <div id="wordle-grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const animation = animatingCells[cellKey];
              
              return (
                <div
                  key={cellKey}
                  className={`letter ${cell.result} ${
                    animation ? `animate__animated animate__${animation}` : ''
                  }`}
                  data-row={rowIndex}
                  onAnimationEnd={() => handleAnimationEnd(cellKey)}
                >
                  {cell.letter}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

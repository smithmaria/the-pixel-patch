import { useState, useEffect } from 'react';
import './Hangman.css';

const WORDS = [
  'javascript', 'react', 'component', 'function', 'variable',
  'algorithm', 'database', 'programming', 'developer', 'interface',
  'application', 'framework', 'software', 'computer', 'keyboard'
];

const MAX_WRONG_GUESSES = 6;

export function Hangman() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    } else {
      // Check if won
      const isWon = word.split('').every(l => newGuessed.has(l));
      if (isWon) {
        setGameStatus('won');
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const letter = e.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) {
        handleGuess(letter);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [word, guessedLetters, gameStatus, wrongGuesses]);

  const displayWord = word.split('').map(letter => 
    guessedLetters.has(letter) ? letter : '_'
  ).join(' ');

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="hangman-container">      
      <div className="hangman-drawing">
        <svg width="200" height="250">
          {/* Gallows */}
          <line x1="10" y1="230" x2="150" y2="230" stroke="#333" strokeWidth="4" />
          <line x1="50" y1="230" x2="50" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="50" y1="20" x2="130" y2="20" stroke="#333" strokeWidth="4" />
          <line x1="130" y1="20" x2="130" y2="50" stroke="#333" strokeWidth="4" />
          
          {/* Head */}
          {wrongGuesses >= 1 && (
            <circle cx="130" cy="70" r="20" stroke="#333" strokeWidth="4" fill="none" />
          )}
          
          {/* Body */}
          {wrongGuesses >= 2 && (
            <line x1="130" y1="90" x2="130" y2="150" stroke="#333" strokeWidth="4" />
          )}
          
          {/* Left arm */}
          {wrongGuesses >= 3 && (
            <line x1="130" y1="110" x2="100" y2="130" stroke="#333" strokeWidth="4" />
          )}
          
          {/* Right arm */}
          {wrongGuesses >= 4 && (
            <line x1="130" y1="110" x2="160" y2="130" stroke="#333" strokeWidth="4" />
          )}
          
          {/* Left leg */}
          {wrongGuesses >= 5 && (
            <line x1="130" y1="150" x2="110" y2="190" stroke="#333" strokeWidth="4" />
          )}
          
          {/* Right leg */}
          {wrongGuesses >= 6 && (
            <line x1="130" y1="150" x2="150" y2="190" stroke="#333" strokeWidth="4" />
          )}
        </svg>
      </div>

      <div className="word-display">
        <h2>{displayWord}</h2>
      </div>

      <div className="game-info">
        <p>Wrong guesses: {wrongGuesses} / {MAX_WRONG_GUESSES}</p>
      </div>

      {gameStatus === 'won' && (
        <div className="game-message won">
          <h3>🎉 You Won!</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="game-message lost">
          <h3>💀 Game Over!</h3>
          <p>The word was: <strong>{word}</strong></p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="keyboard">
        {alphabet.map(letter => (
          <button
            key={letter}
            className={`letter-btn ${
              guessedLetters.has(letter) 
                ? word.includes(letter) 
                  ? 'correct' 
                  : 'wrong'
                : ''
            }`}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

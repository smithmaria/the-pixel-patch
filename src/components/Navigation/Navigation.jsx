import { Link, useLocation } from 'react-router-dom';
import './navigation.css'

import logo from '../../shared/assets/pixel-patch-logo.png';
import menuIcon from '../../shared/assets/menu-bars.svg';

const gameTitles = {
  '/rps': 'Rock, Paper, Scissors',
  '/tictactoe': 'Tic Tac Toe',
  '/wordle': 'Wordle',
  '/hangman': 'Hangman',
  '/sugarrush': 'Sugar Rush'
};

export function Navigation() {
const location = useLocation();
const isHomePage = location.pathname === '/';
const gameTitle = gameTitles[location.pathname];

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        {isHomePage && (
          <div></div>
        )}
        
        {isHomePage && (
          <div className='logo-home'>
            <img src={logo} alt='Pixel Patch Logo'/>
          </div>
        )}

        {!isHomePage && (
          <>
            <Link to='/'>
              <div className='logo-game'>
                <img src={logo} alt='Pixel Patch Logo'/>
              </div>
            </Link>
            <div className='game-title'>{gameTitle}</div>
          </>
        )}

        <div className='menu-icon'>
          <img src={menuIcon} alt='Menu'/>
        </div>
      </div>
    </nav>
  )
}

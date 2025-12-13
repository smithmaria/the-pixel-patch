import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Home } from './components/Home'
import { RockPaperScissors } from './games/rock-paper-scissors/RockPaperScissors'
import { TicTacToe } from './games/tic-tac-toe/TicTacToe'
import { Wordle } from './games/wordle/Wordle'

function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/rps" element={<RockPaperScissors />}/>
            <Route path="/tictactoe" element={<TicTacToe />}/>
            <Route path="/wordle" element={<Wordle />}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares
  // const squares = Array(9).fill(null)
  // const [squares, setSquares] = useLocalStorageState(
  //   'squares',
  //   Array(9).fill(null),
  // )

  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])

  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(currentSquares), [
      currentSquares,
    ])
  })

  // 🐨 We'll need the following bits of derived state:
  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares) // ('X' or 'O')
  const winner = calculateWinner(currentSquares) // ('X', 'O', or null)
  const status = calculateStatus(winner, currentSquares, nextValue) // (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }

    const newHistory = history.slice(0, currentStep + 1)
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue

    setHistory([...newHistory, squaresCopy])
    setCurrentStep(newHistory.length)

    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    //
    // 🐨 set the squares to your copy
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  const moves = history.map((stepSquares, step) => {
    const desc = step === 0 ? 'Go to game Start' : `Go to move #${step}`
    const isCurrentStep = step === currentStep
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

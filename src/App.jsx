import { useState, useEffect } from "react"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Dice from "./components/Dice"


export default function App(){
  const {innerWidth, innerHeight} = window

  // States
  const [dice, setDice] = useState([0])
  const [tenzies, setTenzies] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  const [score, setScore] = useState(1)
  const [time, setTime] = useState(0)
  const [intervalID, setIntervalID] = useState(0)
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem('bestScore')) ?? 0
  )
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem('bestTime')) ?? 0
  )

  // Returning an array of 10 random numbers 1 - 6
  const randomNumbers = () => {
    let nums = []

    for(let i = 0; i < 10; i++){
      let number = Math.ceil(Math.random() * 6)
      number ||= 1
      nums.push(number)
    }

    return nums
  }

  // Generating new dice objects
  const newDice = () => {
    const nums = randomNumbers()

    return (
      nums.map(num => ({
        id: nanoid(),
        value: num,
        isHeld: false,
      }))
    )
  }

  // Side effect for handling winning condition
  useEffect(() => {
    const firstDice = dice[0]
    const condition1 = dice.every(die => die.isHeld)
    const condition2 = dice.every(
      die => die.value === firstDice.value
    )

    if(condition1 && condition2) {
      setTenzies(true)
      clearInterval(intervalID)

      if(!bestScore || bestScore > score)
        localStorage.setItem('bestScore', score)

      if(!bestTime || bestTime > time)
        localStorage.setItem('bestTime', time)
    }
  }, [dice])

  // Time tracker
  const trackTime = () => {
    setIntervalID(setInterval(() => {
      setTime(oldTime => oldTime + 1)
    }, 1000))
  }

  // Function that rolls new dice, 
  // while keeping the held ones if needed
  const rollDice = keep => {
    const newValues = newDice()

    if(keep){
      setScore(oldScore => oldScore + 1)

      return dice.map((die, index) => (
          die.isHeld ? die : newValues[index]
      ))
    } else return newValues
  }

  // Handler for changing the isHeld status
  const changeStatus = id => {
    setDice(oldDice => (
      oldDice.map(die => (
        die.id === id ? 
        {...die, isHeld: !die.isHeld} : 
        {...die}
      ))
    ))
  }

  const startGame = () => {
    setMenuOpen(false)
    setTenzies(false)
    setDice(rollDice(false))
    setTime(0), setScore(1)
    trackTime()
  }

  const openMenu = () => {
    setMenuOpen(true)
    clearInterval(intervalID)
  }

  const resetScores = () => {
    localStorage.clear()
    setBestScore(0)
    setBestTime(0)
  }

  // Mapping over the dice array of objects and
  // generating the Markup
  const diceElements = dice.map(
    ({value, id, isHeld}) => (
      <Dice 
        key={id}
        id={id}
        value={value}
        isHeld={isHeld}
        changeStatus={() => changeStatus(id)}
      />
    )
  )
  
  return (
    <>
      {tenzies && <Confetti width={innerWidth} height={innerHeight} />}
      <main>
        <div className="instruction">
          <h1>Tenzies</h1>
          { menuOpen && 
            <p>
              Roll until all dice are the same. 
              Click each die to freeze it at its current value between rolls.
            </p>
          }
        </div>
        <div className="stats">
          { menuOpen ? 
            <>
              <h2>Best score: {bestScore}</h2>
              <h2>Best time: {bestTime}s</h2>
              <h2 onClick={resetScores}>RESET</h2>
            </>
            : 
            <>
              <h2>Current score: {score}</h2>
              <h2>Current time: {time}s</h2>
            </>
          }
        </div>
        { menuOpen ? 
          <button onClick={startGame}>Start Game</button>
          : 
          <>
            <div className="die-wrapper">
              {diceElements}
            </div>
              { tenzies ? 
                <button onClick={startGame}>New Game</button>
                : <>
                    <button onClick={() => setDice(rollDice(true))}>Roll</button>
                    <p className="go-back" onClick={openMenu}>Back to menu</p>
                  </>
              }
          </>
        }
      </main>
    </>
  )
}
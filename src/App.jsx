import { useState, useEffect } from "react"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Dice from "./components/Dice"


export default function App(){
  const {innerWidth, innerHeight} = window

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

  // States
  const [dice, setDice] = useState(newDice())
  const [tenzies, setTenzies] = useState(false)

  // Side effect that looks for a winning condition
  useEffect(() => {
    const firstDice = dice[0]
    const condition1 = dice.every(die => die.isHeld)
    const condition2 = dice.every(
      die => die.value === firstDice.value
    )
    
    if(condition1 && condition2) setTenzies(true)
  }, [dice])

  // Function that rolls new dice, while keeping the held ones
  // Also restarts the game if it's already won and 
  // the dice are rolled
  const rollDice = () => {
    if(tenzies){
      for (const die of dice) die.isHeld = false
      setTenzies(false)
    }

    const newValues = newDice()

    return dice.map((die, index) => (
        die.isHeld ? die : newValues[index]
    ))
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
          <p>
            Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.
          </p>
        </div>
        <div className="die-wrapper">
          {diceElements}    
        </div>
        <button onClick={() => setDice(rollDice())}>
          {tenzies ? 'New Game' : 'Roll'}
        </button>
      </main>
    </>
  )
}
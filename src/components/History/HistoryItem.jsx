import Dice from "../Dice/Dice"
import './HistoryItem.css'

export default function HistoryItem(props){
  const {log} = console

  const {
    id, date, score, time, diceValue, isFavorite, history, setHistory
  } = props

  // Handler for removing an item
  const removeHistoryItem = () => {
    const newHistory = history.filter(item => item.id != id)
    setHistory(newHistory)
  }

  // Handler for toggling the favorite star
  const toggleStar = () => {
    let newHistory = [...history]
    let [selectedGame] = history.filter(item => item.id == id)
    const index = history.indexOf(selectedGame)
    
    selectedGame.isFavorite = !selectedGame.isFavorite
    newHistory.splice(index, 1, selectedGame)
    setHistory(newHistory)
  }

  return (
    <article className="game-info" key={id}>
      <img 
        src="/x.svg" 
        className="game-remove" 
        onClick={removeHistoryItem}
      />
      <div className="game-info-stats">
        <h4>{date} 
          <img 
            src={`/star${isFavorite ? '-color' : ''}.svg`}
            className="favorite-star"
            onClick={toggleStar}
          />
        </h4>
        <p>Score: {score}</p>
        <p>Time: {time}s</p>
      </div>
      <div className="game-info-dice">
        <Dice value={diceValue}/>
      </div>
    </article>
  )
}
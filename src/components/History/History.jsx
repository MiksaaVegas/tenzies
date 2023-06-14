import { useState } from 'react'
import HistoryItem from './HistoryItem'
import './History.css'

export default function History(props){
  const {log} = console
  const {toggle, data, setHistory} = props

  // States
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  // Handler for history clearing
  const clearHistory = () => {
    if(data.some(item => item.isFavorite)){
      const response = confirm(
        'This action will get your whole history removed. Do you wish to proceed?'
      )

      if(response) setHistory([])
    } else setHistory([])
  }

  // Generating markup
  let elements = data.map(item => {
    const {
      id, date, score, time, diceValue, isFavorite
    } = item

    return <HistoryItem
      key={id}
      id={id}
      date={date}
      score={score}
      time={time}
      diceValue={diceValue}
      isFavorite={isFavorite}
      history={data}
      setHistory={setHistory}
    />
  })

  if (favoritesOnly) {
    elements = elements.filter(item => item.props.isFavorite)
  }

  return (
    <div className='history'>
      <div className="history-title">
        <h3>History</h3>
        <ul>
          {
            !!elements.length && 
            // <li><p className="clear-history" onClick={() => setHistory([])}>Clear</p></li>
            <li><p className="clear-history" onClick={clearHistory}>Clear</p></li>
          }
          <li><p className='close-history' onClick={() => toggle(false)}>Close</p></li>
        </ul>
      </div>
      <section className='games-list'>
        <div className="form">
          <label htmlFor="favoriteOnly">Favorites only</label>
          <input 
            type="checkbox" 
            checked={favoritesOnly}
            onChange={() => setFavoritesOnly(oldState => !oldState)}
            id="favoriteOnly" 
          />
        </div>
        {elements}
        {
          !elements.length && 
          <p className='no-history'>No games to show</p>
        }
      </section>
    </div>
  )
}
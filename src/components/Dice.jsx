import './Dice.css'

export default function Dice(props){
  const {
    id,
    value,
    isHeld,
    changeStatus
  } = props

  const classes = 'die' + (isHeld ? ' is-held' : '')

  return(
    <div 
      className={classes} 
      onClick={() => changeStatus(id)}
    >
      <img src={`/src/assets/svg/dice-${value}.svg`} />
    </div>
  )
}
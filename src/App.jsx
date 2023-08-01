import './App.css'
import React from 'react'
import Start from './Start'
import Game from './Game'

export default function App() {
const [start, setStart] = React.useState(false)

  
  return (
    <main>
      {!start && <Start onClick={() => setStart(prev => !prev)}/>}
      {start && <Game />}
    </main>
  )
}

import React from 'react'

export default function Start(props){
  return (
    <div className="start--container">
    <div className="start--display">
    <h2>Quiz</h2>
    <p>some text here</p>
      <button className="start--button" onClick={props.onClick}>Start Quiz</button>
      </div>
    </div>
  )
}
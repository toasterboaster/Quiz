import React from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'

export default function Game() {
  const [questionData, setQuestionData] = React.useState([])
  const [checkScore, setCheckScore] = React.useState(false)
  const [playGame, setPlayGame] = React.useState(0)

/*
  React.useEffect(() => {
    async function getQuestions() {
      const res = await fetch('https://opentdb.com/api.php?amount=5')
      const data = await res.json()
      setQuestionData(formatQuestion(data.results))
    }
    getQuestions()
    //setTimeOut(() => setCheckScore(false),1000)
    //setCheckScore(false)
  }, [playGame])
*/

 React.useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        setQuestionData(formatQuestion(data.results))
      });
   //getQuestions()
  }, [playGame]); 
  
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  function formatQuestion(questionArray) {
    let formatData = questionArray.map((item) => {
      const decodedCorrectAnswer = decode(item.correct_answer);
      const answers = decode(shuffleArray([...item.incorrect_answers, decodedCorrectAnswer]));

      return {
        id: nanoid(),
        question: decode(item.question),
        correctAnswer: decodedCorrectAnswer,
        answers: answers,
        score: 0,
        selectedAnswer: null,
        correctAnswerIndex: answers.indexOf(item.correct_answer),
      }
    })
    return formatData
  }

  function choose(x, indx) {
    setQuestionData(oldData => oldData.map(question => {
      return question.id === x ?
        { ...question, selectedAnswer: indx } : question
    }))
  }

  function checkAnswer() {
    setQuestionData(oldData => oldData.map(question => {
      return question.selectedAnswer === question.correctAnswerIndex ?
        { ...question, score: 1 } :
        question
    }))
    setCheckScore(prev => !prev)
  }

  function resetGame() {
    setPlayGame(prev => prev + 1)
    setCheckScore(false)
    //setTimeOut(() => setCheckScore(false), 0) 
    //setTimeOut(() => setCheckScore(false), 1000)
  }


  let questionArray = questionData.map((question, index) => {

    return (
      <div key={index}>
        <h2 className='question'>{question.question}{question.correctAnswerIndex}</h2>
        <div>
          {question.answers.map((answer, index) => {
            function getStyles(checkScore, index) {
              if (!checkScore) {
                if (question.selectedAnswer == index) {
                  return { backgroundColor: 'lightBlue' }
                } else {
                  return { backgroundColor: '' }
                }
              } else if (checkScore) {
                if (question.selectedAnswer == index && question.score > 0) {
                  return { backgroundColor: 'green' }
                } else if (question.selectedAnswer == index && question.score < 1) {
                  return { backgroundColor: 'red' }
                } else {
                  return { backgroundColor: '' }
                }
              }
            }
            return (
              <button key={index} onClick={() => choose(question.id, index)} style={getStyles(checkScore, index)}>{answer}</button>
            )
          })}
        </div>
        <hr />
      </div>
    )
  })

  let totalScore = 0;
  for (const obj of questionData) {
    // Iterate through the key-value pairs of each object
    for (const [key, value] of Object.entries(obj)) {
      // Check if the key is "score"
      if (key === "score") {
        // Add the value to totalScore
        totalScore += value;
      }
    }
  }


  return (
    <div>
      <section>
        {questionArray}
      </section>
      <div>
        {!checkScore && <button onClick={checkAnswer}>Check answers</button>}
        {checkScore && <span>You scored {totalScore}/5 correct answers</span>}
        {checkScore && <button onClick={resetGame}>Play again</button>}
      </div>
    </div>
  )
}
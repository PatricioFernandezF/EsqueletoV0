"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Definimos el tipo para nuestras preguntas
type Question = {
  question: string
  options: string[]
  correctAnswer: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Array de preguntas
const questions: Question[] = [
  {
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    difficulty: "easy"
  },
  {
    question: "¿Cuál es la raíz cuadrada de 64?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    difficulty: "easy"
  },
  {
    question: "¿Cuánto es 15 x 12?",
    options: ["165", "170", "180", "190"],
    correctAnswer: "180",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el resultado de 5^3?",
    options: ["75", "100", "125", "150"],
    correctAnswer: "125",
    difficulty: "medium"
  },
  {
    question: "¿Cuál es el valor de π (pi) redondeado a dos decimales?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswer: "3.14",
    difficulty: "hard"
  }
]

export function MathMillionaireComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const playSound = (soundName: 'correct' | 'incorrect' | 'final') => {
    const audio = new Audio(`/sounds/${soundName}.mp3`)
    audio.play()
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)

    if (correct) {
      playSound('correct')
      setScore(score + 1)
    } else {
      playSound('incorrect')
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setGameOver(true)
        playSound('final')
      }
    }, 2000)
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const getButtonClass = (option: string) => {
    if (selectedAnswer === null) return "bg-blue-500 hover:bg-blue-600"
    if (option === questions[currentQuestion].correctAnswer) return "bg-green-500"
    if (option === selectedAnswer) return "bg-red-500"
    return "bg-blue-500"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Matemático Millonario</CardTitle>
      </CardHeader>
      <CardContent>
        {!gameOver ? (
          <>
            <h2 className="text-xl mb-4">Pregunta {currentQuestion + 1} de {questions.length}</h2>
            <p className="text-lg mb-6">{questions[currentQuestion].question}</p>
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`${getButtonClass(option)} text-white font-bold py-2 px-4 rounded`}
                >
                  {option}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-lg">Puntuación: {score}</p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl mb-4">¡Juego terminado!</h2>
            <p className="text-xl mb-6">Tu puntuación final es: {score} de {questions.length}</p>
            <Button onClick={restartGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Jugar de nuevo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
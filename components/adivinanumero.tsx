"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

export default function AdivinaNumero() {
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [hints, setHints] = useState<string[]>([])

  useEffect(() => {
    startNewGame()
  }, [difficulty])

  const startNewGame = () => {
    let newTarget
    switch (difficulty) {
      case 'easy':
        newTarget = Math.floor(Math.random() * 100) + 1
        break
      case 'medium':
        newTarget = Math.floor(Math.random() * 1000) + 1
        break
      case 'hard':
        newTarget = Math.floor(Math.random() * 2000) - 1000
        break
      default:
        newTarget = Math.floor(Math.random() * 100) + 1
    }
    setTargetNumber(newTarget)
    setGuess('')
    setMessage('¡Comienza a adivinar!')
    setAttempts(0)
    setGameOver(false)
    setHints([])
    generateInitialHint(newTarget)
  }

  const generateInitialHint = (number: number) => {
    const hints = []
    if (number % 2 === 0) {
      hints.push("El número es par")
    } else {
      hints.push("El número es impar")
    }
    if (number > 0) {
      hints.push("El número es positivo")
    } else if (number < 0) {
      hints.push("El número es negativo")
    } else {
      hints.push("El número es cero")
    }
    setHints(hints)
  }

  const handleGuess = () => {
    const guessNumber = parseInt(guess)
    setAttempts(attempts + 1)

    if (guessNumber === targetNumber) {
      setMessage('¡Correcto! ¡Has adivinado el número!')
      setGameOver(true)
      const newScore = Math.max(100 - attempts * 5, 0)
      setScore(score + newScore)
    } else {
      let hint = guessNumber < targetNumber ? 'mayor' : 'menor'
      if (targetNumber % guessNumber === 0) {
        hint += ' y es múltiplo de tu número'
      }
      setMessage(`Incorrecto. El número es ${hint}.`)
      
      // Generar pista adicional
      if (attempts % 3 === 0) {
        const newHint = generateAdditionalHint()
        setHints([...hints, newHint])
      }
    }
  }

  const generateAdditionalHint = () => {
    const hintOptions = [
      `La suma de sus dígitos es ${String(targetNumber).split('').reduce((a, b) => a + parseInt(b), 0)}`,
      `Tiene ${String(Math.abs(targetNumber)).length} dígitos`,
      `Su último dígito es ${Math.abs(targetNumber) % 10}`,
      targetNumber % 3 === 0 ? "Es divisible por 3" : "No es divisible por 3",
      targetNumber % 5 === 0 ? "Es divisible por 5" : "No es divisible por 5"
    ]
    const newHint = hintOptions[Math.floor(Math.random() * hintOptions.length)]
    return newHint
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Adivina el Número</CardTitle>
        <CardDescription>
          {difficulty === 'easy' && 'Adivina un número entre 1 y 100'}
          {difficulty === 'medium' && 'Adivina un número entre 1 y 1000'}
          {difficulty === 'hard' && 'Adivina un número entre -1000 y 1000'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            defaultValue="easy"
            onValueChange={(value) => setDifficulty(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy">Fácil</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Difícil</Label>
            </div>
          </RadioGroup>
          <Input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Ingresa tu número"
            disabled={gameOver}
          />
          <Button onClick={handleGuess} disabled={gameOver}>
            Adivinar
          </Button>
          <p className="text-sm">{message}</p>
          <p className="text-sm">Intentos: {attempts}</p>
          <p className="text-sm">Puntuación: {score}</p>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Pistas:</p>
            {hints.map((hint, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{hint}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startNewGame} className="w-full">
          {gameOver ? 'Jugar de nuevo' : 'Reiniciar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
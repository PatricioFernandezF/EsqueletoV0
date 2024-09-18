'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const TARGET_RADIUS = 30
const BULLET_RADIUS = 5

interface Target {
  x: number
  y: number
  value: number
  speedX: number
  speedY: number
}

export default function MathShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [problem, setProblem] = useState({ question: '', answer: 0 })
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)

  const generateProblem = () => {
    const operations = ['+', '-', '*']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let a, b, answer

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * 20) + 1
        b = Math.floor(Math.random() * 20) + 1
        answer = a + b
        break
      case '-':
        a = Math.floor(Math.random() * 20) + 10
        b = Math.floor(Math.random() * a)
        answer = a - b
        break
      case '*':
        a = Math.floor(Math.random() * 10) + 1
        b = Math.floor(Math.random() * 10) + 1
        answer = a * b
        break
      default:
        a = 0
        b = 0
        answer = 0
    }

    setProblem({ question: `${a} ${operation} ${b} = ?`, answer })
  }

  const generateTargets = () => {
    const newTargets: Target[] = []
    const correctAnswerIndex = Math.floor(Math.random() * 3)

    for (let i = 0; i < 3; i++) {
      let value: number
      if (i === correctAnswerIndex) {
        value = problem.answer
      } else {
        do {
          value = Math.floor(Math.random() * 40) + 1
        } while (value === problem.answer)
      }
      newTargets.push({
        x: Math.random() * (CANVAS_WIDTH - TARGET_RADIUS * 2) + TARGET_RADIUS,
        y: Math.random() * (CANVAS_HEIGHT - TARGET_RADIUS * 2) + TARGET_RADIUS,
        value,
        speedX: (1 + level * 0.5) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (1 + level * 0.5) * (Math.random() > 0.5 ? 1 : -1),
      })
    }

    // Verificación adicional para asegurar que la solución esté presente
    const hasSolution = newTargets.some(target => target.value === problem.answer)
    if (!hasSolution) {
      console.warn("No se encontró la solución, forzando su inclusión.")
      const randomIndex = Math.floor(Math.random() * 3)
      newTargets[randomIndex].value = problem.answer
    }

    console.log("Objetivos generados:", newTargets.map(t => t.value), "Solución:", problem.answer)
    setTargets(newTargets)
  }

  const updateTargets = () => {
    setTargets(prevTargets =>
      prevTargets.map(target => {
        let newX = target.x + target.speedX
        let newY = target.y + target.speedY
        let newSpeedX = target.speedX
        let newSpeedY = target.speedY

        // Bounce off horizontal walls
        if (newX - TARGET_RADIUS < 0 || newX + TARGET_RADIUS > CANVAS_WIDTH) {
          newSpeedX = -newSpeedX
          newX = Math.max(TARGET_RADIUS, Math.min(CANVAS_WIDTH - TARGET_RADIUS, newX))
        }

        // Bounce off vertical walls
        if (newY - TARGET_RADIUS < 0 || newY + TARGET_RADIUS > CANVAS_HEIGHT) {
          newSpeedY = -newSpeedY
          newY = Math.max(TARGET_RADIUS, Math.min(CANVAS_HEIGHT - TARGET_RADIUS, newY))
        }

        return {
          ...target,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
        }
      })
    )
  }

  const drawGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw targets
    targets.forEach(target => {
      ctx.beginPath()
      ctx.arc(target.x, target.y, TARGET_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = 'red'
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(target.value.toString(), target.x, target.y)
    })
  }

  const shoot = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || gameOver) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const hitTarget = targets.find(target =>
      Math.sqrt((target.x - x) ** 2 + (target.y - y) ** 2) < TARGET_RADIUS
    )

    if (hitTarget) {
      if (hitTarget.value === problem.answer) {
        setScore(prevScore => prevScore + 10 * level)
        generateProblem()
        generateTargets()
      } else {
        setGameOver(true)
      }
    }

    // Draw bullet
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.arc(x, y, BULLET_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = 'yellow'
      ctx.fill()
    }
  }

  useEffect(() => {
    generateProblem()
  }, [])

  useEffect(() => {
    if (problem.answer !== 0) {
      generateTargets()
    }
  }, [problem])

  useEffect(() => {
    if (gameOver) return

    const gameLoop = setInterval(() => {
      updateTargets()
      drawGame()
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [targets, gameOver])

  useEffect(() => {
    if (score > 0 && score % 50 === 0) {
      setLevel(prevLevel => prevLevel + 1)
    }
  }, [score])

  useEffect(() => {
    // Verificar si hay una bola con la solución después de generar los objetivos
    const hasSolution = targets.some(target => target.value === problem.answer)
    if (!hasSolution && targets.length > 0) {
      console.error("No se encontró la solución después de generar los objetivos. Regenerando...")
      generateTargets()
    }
  }, [targets, problem.answer])

  const restartGame = () => {
    setScore(0)
    setLevel(1)
    setGameOver(false)
    generateProblem()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Tiro al Blanco Matemático</h1>
          <div className="flex justify-between mb-4">
            <p className="text-xl">Puntuación: {score}</p>
            <p className="text-xl">Nivel: {level}</p>
          </div>
          <p className="text-2xl font-semibold mb-4 text-center">{problem.question}</p>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={shoot}
            className="border border-gray-300 cursor-crosshair"
          />
          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold mb-4">¡Juego terminado!</p>
              <Button onClick={restartGame}>Reiniciar juego</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
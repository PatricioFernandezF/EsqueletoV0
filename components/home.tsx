"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CardType {
  id: number
  title: string
  description: string
  difficulty: "Facil" | "Medio" | "Dificil"
}

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([])
  const [filter, setFilter] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      setError(null)
      try {
        // Llamamos a la API route de Next.js
        let url = '/api/cards'
        if (filter !== 'Todos') {
          url += `?filter=${filter}`
        }
        
        const res = await fetch(url)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Error al obtener los datos')
        }

        setCards(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [filter])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pantalla de Inicio</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={() => setFilter('Todos')} variant={filter === 'Todos' ? 'default' : 'outline'}>
          Todos
        </Button>
        <Button onClick={() => setFilter('Facil')} variant={filter === 'Facil' ? 'default' : 'outline'}>
          Fácil
        </Button>
        <Button onClick={() => setFilter('Medio')} variant={filter === 'Medio' ? 'default' : 'outline'}>
          Medio
        </Button>
        <Button onClick={() => setFilter('Dificil')} variant={filter === 'Dificil' ? 'default' : 'outline'}>
          Difícil
        </Button>
      </div>

      {loading && <p className="text-center">Cargando tarjetas...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map(card => (
            <Link href={`/aplicaciones/${card.id}`} key={card.id} className="block">
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>Dificultad: {card.difficulty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

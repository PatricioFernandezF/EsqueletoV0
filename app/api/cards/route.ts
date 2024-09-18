import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filter = url.searchParams.get('filter') || 'Todos'

  try {
    let cards
    if (filter === 'Todos') {
      // Obtener todas las tarjetas
      cards = await prisma.card.findMany()
    } else {
      // Filtrar las tarjetas por dificultad
      cards = await prisma.card.findMany({
        where: {
          difficulty: filter
        }
      })
    }
    // Devolver las tarjetas como respuesta en formato JSON
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error al obtener las tarjetas:', error)
    return new Response(JSON.stringify({ error: 'Error al obtener las tarjetas' }), {
      status: 500,
    })
  }
}

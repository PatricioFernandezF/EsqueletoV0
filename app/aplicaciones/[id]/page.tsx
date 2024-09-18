"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MathMillionaireComponent } from '@/components/math-millionaire'
import MathShooterGame from '@/components/mathshootergame'
import AdivinaNumero from '@/components/adivinanumero'

type Params = {
  id?: string
}

const AplicacionDetalle: React.FC = () => {
  const params = useParams() as Params
  const { id } = params

  const getMessage = (id: string | undefined): string => {
    if (!id) return "ID no proporcionado"

    switch (id) {
      case '1':
        return <MathMillionaireComponent/>
    case '2':
        return <AdivinaNumero/>
      case '4':
        return <MathShooterGame/>
      default:
        return `ID: ${id}`
    }
  }

  const message = getMessage(id)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 underline mb-4 inline-block">
        ← Volver a la Página de Inicio
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-center">{message}</h1>
    </div>
  )
}

export default AplicacionDetalle

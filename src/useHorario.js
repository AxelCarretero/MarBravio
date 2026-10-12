import { useEffect, useState } from 'react'
import { estadoHorario } from './horario'

/**
 * Devuelve el estado del horario y lo refresca cada minuto,
 * para que la pagina se abra o cierre sola sin recargar.
 */
export default function useHorario() {
  const [horario, setHorario] = useState(() => estadoHorario())

  useEffect(() => {
    const timer = setInterval(() => setHorario(estadoHorario()), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  return horario
}
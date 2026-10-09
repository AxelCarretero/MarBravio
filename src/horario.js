/**
 * Control de horario de pedidos.
 *
 * INTERRUPTOR MAESTRO
 * --------------------
 * Cambia RESTRINGIR_PEDIDOS_POR_HORARIO a false para desactivar la
 * restriccion por completo y dejar los botones siempre disponibles
 * (util en pruebas o si Larsen ahi, en tu mensaje puntual).
 */

// false = los botones funcionan siempre
// true  = los botones solo funcionan dentro del horario de pedidos
export const RESTRINGIR_PEDIDOS_POR_HORARIO = true

// Zona horaria del restaurante (no la del visitante)
export const ZONA_HORARIA = 'America/Mexico_City'

// dias: 0=Domingo, 1=Lunes, ... 6=Sabado
// desde/hasta: minutos desde medianoche
const HORARIO = [
  { dias: [3, 4, 6], desde: 16 * 60 + 30, hasta: 19 * 60 }, // Mie, Jue y Sab: 4:30 PM - 7:00 PM
  { dias: [0], desde: 10 * 60, hasta: 16 * 60 }, // Domingo: 10:00 AM - 4:00 PM
]

const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const HORARIO_TEXTO = 'Miércoles, Jueves y Sábado: 4:30 PM – 7:00 PM · Domingo: 10:00 AM – 4:00 PM'

const aTexto = (minutos) => {
  const h24 = Math.floor(minutos / 60)
  const m = minutos % 60
  const sufijo = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

// Devuelve dia de la semana y minutos desde medianoche en la zona del restaurante
function ahoraEnRestaurante() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONA_HORARIA,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date())

    const valor = (tipo) => partes.find((p) => p.type === tipo)?.value
    const mapaDia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    const dia = mapaDia[valor('weekday')]
    const hora = parseInt(valor('hour'), 10) % 24
    const minuto = parseInt(valor('minute'), 10)
    return { dia, minutos: hora * 60 + minuto }
  } catch {
    // Si falla la zona horaria usamos la hora local del visitante
    const ahora = new Date()
    return { dia: ahora.getDay(), minutos: ahora.getHours() * 60 + ahora.getMinutes() }
  }
}

function estaAbierto(dia, minutos) {
  return HORARIO.some((b) => b.dias.includes(dia) && minutos >= b.desde && minutos < b.hasta)
}

// Proxima apertura a partir del dia/minuto actuales
function proximaApertura(dia, minutos) {
  for (let salto = 0; salto <= 7; salto++) {
    const diaBuscado = (dia + salto) % 7
    for (const bloque of HORARIO) {
      if (!bloque.dias.includes(diaBuscado)) continue
      if (salto === 0 && minutos >= bloque.desde) continue
      return {
        salto,
        dia: diaBuscado,
        hora: bloque.desde,
        texto:
          salto === 0
            ? `hoy a las ${aTexto(bloque.desde)}`
            : salto === 1
              ? `mañana a las ${aTexto(bloque.desde)}`
              : `${NOMBRES_DIA[diaBuscado]} a las ${aTexto(bloque.desde)}`,
      }
    }
  }
  return null
}

/**
 * Estado actual para la interfaz.
 * @returns {{
 *   aplica: boolean, abierto: boolean,
 *   mensaje: string, detalle: string, proxima: string
 * }}
 */
export function estadoHorario() {
  const { dia, minutos } = ahoraEnRestaurante()

  if (!RESTRINGIR_PEDIDOS_POR_HORARIO) {
    return {
      aplica: false,
      abierto: true,
      mensaje: '',
      detalle: '',
      proxima: '',
    }
  }

  const abierto = estaAbierto(dia, minutos)

  if (abierto) {
    const bloque = HORARIO.find((b) => b.dias.includes(dia) && minutos >= b.desde && minutos < b.hasta)
    return {
      aplica: true,
      abierto: true,
      mensaje: 'Estamos abiertos',
      detalle: `Cierra hoy a las ${aTexto(bloque.hasta)}`,
      proxima: '',
    }
  }

  const prox = proximaApertura(dia, minutos)
  return {
    aplica: true,
    abierto: false,
    mensaje: 'Ahora estamos cerrados',
    detalle: HORARIO_TEXTO,
    proxima: prox ? `Abrimos ${prox.texto}.` : '',
  }
}

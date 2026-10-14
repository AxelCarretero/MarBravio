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
const HORARIO = {
  bloques: [
    { dias: [3, 4, 6], desde: 16 * 60 + 30, hasta: 19 * 60 }, // Mie, Jue y Sab: 4:30 PM - 7:00 PM
    { dias: [0], desde: 10 * 60, hasta: 16 * 60 }, // Domingo: 10:00 AM - 4:00 PM
  ],
  texto: 'Miércoles, Jueves y Sábado: 4:30 PM – 7:00 PM · Domingo: 10:00 AM – 4:00 PM',
}

/**
 * HORARIO ESPECIAL: solo aplica dentro del rango de fechas de abajo
 * (de lunes 12 a domingo 18 de octubre de 2026, ambos incluidos).
 * Fuera de ese rango el sitio vuelve solo al HORARIO normal, asi que
 * no hay que hacer nada manualmente cuando termine la semana.
 *
 * Para otro cambio temporal: edita estas dos fechas y los bloques.
 */
const HORARIO_ESPECIAL = {
  desde: '2026-10-12',
  hasta: '2026-10-19', // exclusivo
  bloques: [
    { dias: [5, 6], desde: 14 * 60 + 30, hasta: 18 * 60 + 30 }, // Viernes y Sabado: 2:30 PM - 6:30 PM
    { dias: [0], desde: 10 * 60, hasta: 16 * 60 }, // Domingo: 10:00 AM - 4:00 PM
  ],
  texto: 'Viernes y Sábado: 2:30 PM – 6:30 PM · Domingo: 10:00 AM – 4:00 PM',
}

const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Devuelve dia de la semana, minutos desde medianoche y fecha (AAAA-MM-DD)
// todo en la zona del restaurante
function ahoraEnRestaurante() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONA_HORARIA,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date())

    const valor = (tipo) => partes.find((p) => p.type === tipo)?.value
    const mapaDia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    const dia = mapaDia[valor('weekday')]
    const hora = parseInt(valor('hour'), 10) % 24
    const minuto = parseInt(valor('minute'), 10)
    const fecha = `${valor('year')}-${valor('month')}-${valor('day')}`
    return { dia, minutos: hora * 60 + minuto, fecha }
  } catch {
    // Si falla la zona horaria usamos la hora local del visitante
    const ahora = new Date()
    const dosCifras = (n) => String(n).padStart(2, '0')
    return {
      dia: ahora.getDay(),
      minutos: ahora.getHours() * 60 + ahora.getMinutes(),
      fecha: `${ahora.getFullYear()}-${dosCifras(ahora.getMonth() + 1)}-${dosCifras(ahora.getDate())}`,
    }
  }
}

// Que horario aplica en una fecha dada (las fechas AAAA-MM-DD se comparan bien como texto)
function horarioDelDia(fecha) {
  const dentro =
    fecha >= HORARIO_ESPECIAL.desde && fecha < HORARIO_ESPECIAL.hasta ? HORARIO_ESPECIAL : HORARIO
  return dentro
}

// Fecha y dia de la semana que seran dentro de "salto" dias
function fechaDesplazada(fechaISO, salto) {
  const [anio, mes, dia] = fechaISO.split('-').map(Number)
  const f = new Date(Date.UTC(anio, mes - 1, dia + salto))
  const dosCifras = (n) => String(n).padStart(2, '0')
  return {
    fecha: `${f.getUTCFullYear()}-${dosCifras(f.getUTCMonth() + 1)}-${dosCifras(f.getUTCDate())}`,
    dia: f.getUTCDay(),
  }
}

const aTexto = (minutos) => {
  const h24 = Math.floor(minutos / 60)
  const m = minutos % 60
  const sufijo = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

// Bloque que esta abierto en ese dia y minuto, o null
function bloqueAbierto(bloques, dia, minutos) {
  return bloques.find((b) => b.dias.includes(dia) && minutos >= b.desde && minutos < b.hasta) || null
}

// Proxima apertura a partir de ahora. Cada dia se consulta con su propio
// horario, para que al terminar la semana especial se anuncie bien el
// regreso al horario normal.
function proximaApertura(ahora) {
  for (let salto = 0; salto <= 8; salto++) {
    const { fecha, dia } = fechaDesplazada(ahora.fecha, salto)
    const bloques = horarioDelDia(fecha).bloques
    for (const bloque of bloques) {
      if (!bloque.dias.includes(dia)) continue
      if (salto === 0 && ahora.minutos >= bloque.desde) continue
      return {
        salto,
        dia,
        hora: bloque.desde,
        texto:
          salto === 0
            ? `hoy a las ${aTexto(bloque.desde)}`
            : salto === 1
              ? `mañana a las ${aTexto(bloque.desde)}`
              : `${NOMBRES_DIA[dia]} a las ${aTexto(bloque.desde)}`,
      }
    }
  }
  return null
}

/**
 * Estado real del restaurante segun la hora de Guadalajara.
 * Esto NO depende del interruptor: el letrero de la pagina siempre
 * refleja si estamos abiertos o cerrados.
 * @returns {{
 *   abierto: boolean, mensaje: string, detalle: string,
 *   proxima: string, textoHorario: string
 * }}
 */
export function estadoHorario() {
  const ahora = ahoraEnRestaurante()
  const vigente = horarioDelDia(ahora.fecha)
  const bloque = bloqueAbierto(vigente.bloques, ahora.dia, ahora.minutos)

  if (bloque) {
    return {
      abierto: true,
      mensaje: 'Estamos abiertos',
      detalle: `Cierra hoy a las ${aTexto(bloque.hasta)}`,
      proxima: '',
      textoHorario: vigente.texto,
    }
  }

  const prox = proximaApertura(ahora)
  return {
    abierto: false,
    mensaje: 'Ahora estamos cerrados',
    detalle: vigente.texto,
    proxima: prox ? `Abrimos ${prox.texto}.` : '',
    textoHorario: vigente.texto,
  }
}
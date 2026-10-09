/**
 * Recorta los 4 iconos de aguachiles de una sola imagen y les quita el fondo.
 *
 * Uso:
 *   npm install --no-save sharp
 *   node recortar-iconos.mjs
 *
 * Usa sharp solo para esto, por eso NO esta en el package.json: asi el build
 * de Cloudflare no descarga esa dependencia. Los PNG ya generados estan
 * versionados en public/assets/.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const ORIGEN = 'imagenes/imagenes.jpg'
const DESTINO = 'public/assets'
const SALIDA = [
  { nombre: 'aguachil-verde', etiqueta: 'Verde' },
  { nombre: 'aguachil-tropical', etiqueta: 'Tropical' },
  { nombre: 'aguachil-roja', etiqueta: 'Roja' },
  { nombre: 'aguachil-negro', etiqueta: 'Negro' },
]

await mkdir(DESTINO, { recursive: true })

const imagen = sharp(ORIGEN)
const { width, height } = await imagen.metadata()
console.log(`Origen: ${width}x${height}`)

const { data, info } = await imagen.raw().toBuffer({ resolveWithObject: true })
const canales = info.channels
const px = (x, y) => {
  const i = (y * width + x) * canales
  return [data[i], data[i + 1], data[i + 2]]
}

// El fondo es el color del pixel de una esquina (marino uniforme)
const [fr, fg, fb] = px(2, 2)
console.log(`Fondo detectado: rgb(${fr}, ${fg}, ${fb})`)

// Un pixel "de fondo" es oscuro y cercano al tono del fondo.
// Los trazos de los iconos son mas claros (crema/color) o muy saturados.
const esFondo = (r, g, b) => {
  const distancia = Math.abs(r - fr) + Math.abs(g - fg) + Math.abs(b - fb)
  return distancia < 90
}

// 1) Recorremos la mitad superior (donde estan los iconos, no los textos)
const limiteInferior = Math.round(height * 0.62)
let minX = width
let maxX = 0
let minY = height
let maxY = 0

for (let y = 0; y < limiteInferior; y += 2) {
  for (let x = 0; x < width; x += 2) {
    const [r, g, b] = px(x, y)
    if (esFondo(r, g, b)) continue
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
}

console.log(`Contenido: x ${minX}-${maxX}, y ${minY}-${maxY}`)

// 2) Buscamos los 4 grupos por columnas de pixeles con contenido
const hayContenidoEnX = new Uint8Array(width)
for (let x = 0; x < width; x++) {
  for (let y = 0; y < limiteInferior; y += 2) {
    const [r, g, b] = px(x, y)
    if (!esFondo(r, g, b)) {
      hayContenidoEnX[x] = 1
      break
    }
  }
}

// agrupamos columnas contiguas (con pequenos huecos tolerados)
const grupos = []
let inicio = null
let hueco = 0
const tolerancia = Math.round(width * 0.02)
for (let x = 0; x < width; x++) {
  if (hayContenidoEnX[x]) {
    if (inicio === null) inicio = x
    hueco = 0
  } else if (inicio !== null) {
    hueco++
    if (hueco > tolerancia) {
      grupos.push([inicio, x - hueco])
      inicio = null
      hueco = 0
    }
  }
}
if (inicio !== null) grupos.push([inicio, width - 1])

// nos quedamos con los grupos mas anchos (los 4 iconos)
const principales = grupos.filter(([a, b]) => b - a > width * 0.1).sort((a, b) => b[0] - a[0]).slice(0, 4).sort((a, b) => a[0] - b[0])

console.log(`Grupos detectados: ${grupos.length}, principales: ${principales.length}`)
principales.forEach(([a, b], i) => console.log(`  ${i + 1}. x ${a}-${b} (ancho ${b - a})`))

// 3) Recortamos cada icono: recorte individual + eliminacion de fondo
for (const [i, [x0, x1]] of principales.entries()) {
  const salida = SALIDA[i]
  if (!salida) continue

  // limites verticales reales de este grupo, cortando antes del texto del nombre.
  // El texto empieza despues de un hueco horizontal amplio: lo detectamos y ahi cortamos.
  let gy0 = height
  let gy1 = 0
  let filasVacias = 0
  const huecoCorte = Math.round(height * 0.035)

  for (let y = 0; y < limiteInferior; y++) {
    let hayAlgo = false
    for (let x = x0; x <= x1; x++) {
      const [r, g, b] = px(x, y)
      if (!esFondo(r, g, b)) {
        hayAlgo = true
        break
      }
    }
    if (hayAlgo) {
      if (y < gy0) gy0 = y
      if (y > gy1) gy1 = y
      filasVacias = 0
    } else if (y > gy0) {
      filasVacias++
      // hueco grande: aqui empieza el texto, cortamos
      if (filasVacias >= huecoCorte) {
        gy1 = y - filasVacias
        break
      }
    }
  }

  const margen = 6
  const izquierda = Math.max(0, x0 - margen)
  const arriba = Math.max(0, gy0 - margen)
  const ancho = Math.min(width - izquierda, x1 - x0 + 1 + margen * 2)
  const alto = gy1 - gy0 + 1 + margen * 2

  // cuadrado: usamos el lado mayor para que no se deforme en el circulo
  const lado = Math.max(ancho, alto)
  const centroX = izquierda + ancho / 2
  const centroY = arriba + alto / 2

  const recorte = {
    left: Math.round(Math.max(0, centroX - lado / 2)),
    top: Math.round(Math.max(0, centroY - lado / 2)),
    width: Math.min(Math.round(lado), width - Math.round(Math.max(0, centroX - lado / 2))),
    height: Math.min(Math.round(lado), height - Math.round(Math.max(0, centroY - lado / 2))),
  }

  // PNG con alfa: los pixeles del fondo quedan transparentes
  const { data: recorteData, info: infoRecorte } = await sharp(ORIGEN)
    .extract(recorte)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const total = recorte.width * recorte.height
  const conAlfa = Buffer.alloc(total * 4)
  for (let p = 0; p < total; p++) {
    const r = recorteData[p * infoRecorte.channels]
    const g = recorteData[p * infoRecorte.channels + 1]
    const b = recorteData[p * infoRecorte.channels + 2]
    const fondo = esFondo(r, g, b)
    // suavizado del borde: transparencia gradual en los pixeles intermedios
    const distancia = Math.abs(r - fr) + Math.abs(g - fg) + Math.abs(b - fb)
    const alfa = fondo ? 0 : Math.min(255, Math.max(0, Math.round((distancia - 60) * 3.2)))
    conAlfa[p * 4] = r
    conAlfa[p * 4 + 1] = g
    conAlfa[p * 4 + 2] = b
    conAlfa[p * 4 + 3] = alfa
  }

  const archivo = `${DESTINO}/${salida.nombre}.png`
  await sharp(conAlfa, { raw: { width: recorte.width, height: recorte.height, channels: 4 } })
    .png()
    .toFile(archivo)

  // Comprobamos que el fondo quedo transparente de verdad
  const { data: prueba, info: infoPrueba } = await sharp(archivo)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const alfaEsquina = prueba[3]
  let opacos = 0
  for (let p = 0; p < infoPrueba.width * infoPrueba.height; p++) {
    if (prueba[p * 4 + 3] > 20) opacos++
  }
  const pct = ((opacos / (infoPrueba.width * infoPrueba.height)) * 100).toFixed(1)

  console.log(
    `${salida.etiqueta.padEnd(9)} -> ${archivo} (${recorte.width}x${recorte.height}) fondo alfa=${alfaEsquina} contenido=${pct}%`
  )
}

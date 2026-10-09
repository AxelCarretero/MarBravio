import sharp from 'sharp'

const ORIGEN = 'imagenes/menu01.jpeg'
const DESTINO = 'public/assets'
const SALIDA = [
  { nombre: 'aguachil-verde' },
  { nombre: 'aguachil-tropical' },
  { nombre: 'aguachil-roja' },
  { nombre: 'aguachil-negro' },
]

// Zona de busqueda vertical de los iconos (debajo de "NUESTROS AGUACHILES")
// El corte real se hace en el primer hueco grande, para no agarrar el texto.
const BUSQUEDA = [795, 940]

const { width, height } = await sharp(ORIGEN).metadata()
const { data, info } = await sharp(ORIGEN).raw().toBuffer({ resolveWithObject: true })
const canales = info.channels
const px = (x, y) => {
  const i = (y * width + x) * canales
  return [data[i], data[i + 1], data[i + 2]]
}
const [fr, fg, fb] = px(2, 2)
console.log(`Fuente ${width}x${height}  fondo rgb(${fr},${fg},${fb})`)
const esFondo = (r, g, b) => Math.abs(r - fr) + Math.abs(g - fg) + Math.abs(b - fb) < 90

// 1) Columnas con contenido en la zona de busqueda -> separar los 4 iconos.
// Ojo: los separadores verticales del flyer unen iconos y textos, asi que
// buscar filas vacias en TODO el ancho nunca funciona. Por eso el recorte
// vertical se hace despues, dentro del rango de columnas de cada icono.
const hay = new Uint8Array(width)
for (let x = 0; x < width; x++) {
  for (let y = BUSQUEDA[0]; y <= BUSQUEDA[1]; y++) {
    const [r, g, b] = px(x, y)
    if (!esFondo(r, g, b)) { hay[x] = 1; break }
  }
}
const grupos = []
let inicio = null
let hueco = 0
const tolerancia = Math.round(width * 0.025)
for (let x = 0; x < width; x++) {
  if (hay[x]) {
    if (inicio === null) inicio = x
    hueco = 0
  } else if (inicio !== null) {
    hueco++
    if (hueco > tolerancia) { grupos.push([inicio, x - hueco]); inicio = null; hueco = 0 }
  }
}
if (inicio !== null) grupos.push([inicio, width - 1])

const iconos = grupos.filter(([a, b]) => b - a > width * 0.04).sort((a, b) => a[0] - b[0])
console.log(`Iconos detectados: ${iconos.length}`)
iconos.forEach(([a, b], i) => console.log(`  ${i + 1}. x ${a}-${b}`))

for (const [i, [x0, x1]] of iconos.entries()) {
  if (!SALIDA[i]) continue

  // 2) Limites verticales reales de este icono.
  // Cortamos en el primer hueco de 6 filas vacias dentro de su propio rango,
  // que es justo donde termina el dibujo y empieza su nombre.
  const huecoCorte = 6
  let gy0 = height
  let gy1 = 0
  let vacias = 0
  for (let y = BUSQUEDA[0]; y <= BUSQUEDA[1]; y++) {
    let hayAlgo = false
    for (let x = x0; x <= x1; x++) {
      const [r, g, b] = px(x, y)
      if (!esFondo(r, g, b)) { hayAlgo = true; break }
    }
    if (hayAlgo) {
      if (y < gy0) gy0 = y
      if (y > gy1) gy1 = y
      vacias = 0
    } else if (gy0 < height) {
      vacias++
      if (vacias >= huecoCorte) { gy1 = y - vacias; break }
    }
  }

  const margen = 8
  const left = Math.max(0, x0 - margen)
  const top = Math.max(0, gy0 - margen)
  const recorte = {
    left,
    top,
    width: Math.min(x1 - x0 + 1 + margen * 2, width - left),
    height: Math.min(gy1 - gy0 + 1 + margen * 2, height - top),
  }

  // 3) Quitamos el fondo dejando transparencia
  const { data: rec, info: infoRec } = await sharp(ORIGEN)
    .extract(recorte)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const total = recorte.width * recorte.height
  const rgba = Buffer.alloc(total * 4)
  let transparentes = 0
  for (let p = 0; p < total; p++) {
    const r = rec[p * infoRec.channels]
    const g = rec[p * infoRec.channels + 1]
    const b = rec[p * infoRec.channels + 2]
    const distancia = Math.abs(r - fr) + Math.abs(g - fg) + Math.abs(b - fb)
    const alfa = distancia < 60 ? 0 : Math.min(255, Math.round((distancia - 60) * 3.2))
    if (alfa === 0) transparentes++
    rgba[p * 4] = r
    rgba[p * 4 + 1] = g
    rgba[p * 4 + 2] = b
    rgba[p * 4 + 3] = alfa
  }

  // 4) Lienzo cuadrado transparente con el icono centrado.
  // Importante: NO se agranda la imagen original hacia abajo (ahi esta el texto
  // del nombre); el espacio extra se rellena con pixeles transparentes.
  const LADO_FINAL = 360
  const escala = LADO_FINAL / Math.max(recorte.width, recorte.height)
  const anchoEscalado = Math.round(recorte.width * escala)
  const altoEscalado = Math.round(recorte.height * escala)
  const iconoEscalado = await sharp(rgba, { raw: { width: recorte.width, height: recorte.height, channels: 4 } })
    .resize(anchoEscalado, altoEscalado, { kernel: 'lanczos3' })
    .png()
    .toBuffer()

  const lienzo = await sharp({
    create: {
      width: LADO_FINAL,
      height: LADO_FINAL,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: iconoEscalado,
        left: Math.round((LADO_FINAL - anchoEscalado) / 2),
        top: Math.round((LADO_FINAL - altoEscalado) / 2),
      },
    ])
    .png()
    .toBuffer()

  const archivo = `${DESTINO}/${SALIDA[i].nombre}.png`
  await sharp(lienzo).toFile(archivo)

  console.log(
    `  -> ${archivo} recorte=${recorte.width}x${recorte.height} lienzo=${LADO_FINAL}x${LADO_FINAL} transparente=${((transparentes / total) * 100).toFixed(1)}%`
  )
}
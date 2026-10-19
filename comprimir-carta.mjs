/**
 * Prepara la imagen de la carta ("Ver carta completa").
 *
 * Toma el original de imagenes/ (que no se publica) y deja una version
 * comprimida en public/assets/, para que la pagina no cargue un PNG de
 * 1.4 MB. El original se conserva en imagenes/carta-menu.png.
 *
 * Uso:  npm i --no-save sharp && node comprimir-carta.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs'

const ORIGEN = 'imagenes/carta-menu.png'
const DESTINO = 'public/assets/carta-menu.jpg'

// 1024px de ancho es el tamano nativo del diseno y se ve bien en el modal
const CALIDAD = 88

await sharp(ORIGEN)
  .resize({ width: 1024, withoutEnlargement: true })
  .jpeg({ quality: CALIDAD, mozjpeg: true, progressive: true })
  .toFile(DESTINO)

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + ' KB'
console.log(`${ORIGEN} (${kb(ORIGEN)}) -> ${DESTINO} (${kb(DESTINO)})`)

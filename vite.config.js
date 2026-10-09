import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      // La carpeta imagenes/ es material de trabajo (copias de origen).
      // No la usa la app: todo lo que se sirve vive en public/assets/.
      // Si alguien abre o copia un archivo ahi, el watcher de Vite
      // reventaba con EBUSY y caia el servidor de desarrollo.
      ignored: ['**/imagenes/**']
    }
  }
})

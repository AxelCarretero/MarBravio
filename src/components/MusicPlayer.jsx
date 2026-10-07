import React, { useEffect, useRef, useState } from 'react'

const SRC = '/assets/marbravio-music.mp3'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    const onPlay = () => { setPlaying(true); setBlocked(false) }
    const onPause = () => setPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    // Intento de autoplay. Los navegadores lo bloquean si no hubo
    // interacción previa del usuario; en ese caso mostramos el aviso.
    audio.play().catch(() => {
      setPlaying(false)
      setBlocked(true)
    })

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => setBlocked(true))
    } else {
      audio.pause()
    }
  }

  return (
    <>
      <button
        className="music-toggle"
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        <span className="material-icons">{playing ? 'pause' : 'play_arrow'}</span>
      </button>

      {blocked && !playing && (
        <div className="music-hint" onClick={toggle}>🎵 Toca ▶ para escuchar la música de MarBravio</div>
      )}

      <audio ref={audioRef} src={SRC} loop preload="auto" />
    </>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const SRC = '/assets/marbravio-music.mp3'
const PREF_KEY = 'mb-music-pref'

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY)
  } catch {
    return null
  }
}

function savePref(value) {
  try {
    localStorage.setItem(PREF_KEY, value)
  } catch {
    /* modo privado: se ignora */
  }
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35
    audio.muted = true

    const pref = readPref()

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    // Chrome bloquea el autoplay CON sonido. El autoplay silencioso si se
    // permite, por eso arrancamos en mute y pedimos el clic para el audio.
    if (pref === 'off') {
      return () => {
        audio.removeEventListener('play', onPlay)
        audio.removeEventListener('pause', onPause)
      }
    }

    if (pref === 'on') {
      // El visitante ya lo activo antes: intentamos con sonido.
      audio.muted = false
      audio
        .play()
        .then(() => {
          setMuted(false)
          setShowHint(false)
        })
        .catch(() => {
          // Chrome lo bloqueo igual: caemos a silencio + aviso.
          audio.muted = true
          audio.play().catch(() => setShowHint(true))
          setMuted(true)
          setShowHint(true)
        })
    } else {
      // Primera visita: autoplay silencioso (permitido por Chrome).
      audio
        .play()
        .then(() => setShowHint(true))
        .catch(() => setShowHint(true))
    }

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      // Reproducir con sonido: siempre dentro de un clic, siempre permitido.
      audio.muted = false
      audio
        .play()
        .then(() => {
          setMuted(false)
          setShowHint(false)
          savePref('on')
        })
        .catch(() => setShowHint(true))
      return
    }

    if (audio.muted) {
      // Esta reproduciendose en silencio -> subir el volumen.
      audio.muted = false
      setMuted(false)
      setShowHint(false)
      savePref('on')
      return
    }

    // Esta sonando -> pausar.
    audio.pause()
    savePref('off')
  }

  const icon = !playing ? 'play_arrow' : muted ? 'volume_off' : 'pause'

  return (
    <>
      <button
        className={`music-toggle ${muted && playing ? 'muted' : ''}`}
        onClick={toggle}
        aria-label={!playing ? 'Reproducir música' : muted ? 'Activar sonido' : 'Pausar música'}
        title={!playing ? 'Reproducir música' : muted ? 'Activar sonido' : 'Pausar música'}
      >
        <span className="material-icons">{icon}</span>
      </button>

      {showHint &&
        createPortal(
          <button className="music-hint" onClick={toggle}>
            🎵 Toca el botón ▶ para escuchar la música
          </button>,
          document.body
        )}

      <audio ref={audioRef} src={SRC} loop preload="auto" playsInline />
    </>
  )
}

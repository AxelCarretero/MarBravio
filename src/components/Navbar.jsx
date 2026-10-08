import React, { useState } from 'react'
import { WHATSAPP_NUMBER, WHATSAPP_MSG } from '../App'

// Botón de música oculto temporalmente.
// Para volver a mostrarlo, descomenta estas dos líneas:
//   import MusicPlayer from './MusicPlayer'
//   ...y en el <ul> debajo: <li className="nav-item"><MusicPlayer /></li>

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="navbar navbar-expand-lg mb-navbar fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#inicio">
          <img src="/assets/logo.jpg" alt="MarBravio" height="42" style={{ borderRadius: 8 }} />
          MAR BRAVÍO
        </a>
        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)} aria-label="Menú"
          style={{ borderColor: 'rgba(121,196,232,.4)' }}>
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item"><a className="nav-link" href="#inicio" onClick={() => setOpen(false)}>Inicio</a></li>
            <li className="nav-item"><a className="nav-link" href="#menu" onClick={() => setOpen(false)}>Menú</a></li>
            <li className="nav-item"><a className="nav-link" href="#servicios" onClick={() => setOpen(false)}>Servicios</a></li>
            <li className="nav-item"><a className="nav-link" href="#contacto" onClick={() => setOpen(false)}>Contacto</a></li>
            <li className="nav-item">
              <a className="nav-link" target="_blank" rel="noreferrer"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} onClick={() => setOpen(false)}>Pedir</a>
            </li>
            {/* Botón de música oculto temporalmente (ver import commented arriba) */}
          </ul>
        </div>
      </div>
    </nav>
  )
}

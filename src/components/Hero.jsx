import React from 'react'
import { WHATSAPP_NUMBER, WHATSAPP_MSG } from '../App'
import useHorario from '../useHorario'

// La ola decorativa: un grupo de trazos finos que suben y bajan, igual que la
// ola a pincel del logo. Se dibuja con varias curvas paralelas y cada una
// mas apagada que la anterior para dar esa sensacion de pincel.
const OLA_FORMA = 'M-40 214 C 62 152, 132 58, 244 84 C 356 110, 436 152, 528 96 C 588 58, 628 36, 690 42'
const OLA_LINEAS = [
  { dy: 0, op: 0.5 },
  { dy: 9, op: 0.46 },
  { dy: 19, op: 0.42 },
  { dy: 30, op: 0.37 },
  { dy: 42, op: 0.32 },
  { dy: 55, op: 0.27 },
  { dy: 69, op: 0.22 },
  { dy: 84, op: 0.17 },
  { dy: 100, op: 0.12 },
  { dy: 117, op: 0.08 },
]

export default function Hero() {
  const horario = useHorario()
  // El interruptor maestro solo controla los botones de pedido.
  // Este letrero siempre se muestra, para que el cliente sepa de una vez
  // si estamos abiertos o cerrados y hasta cuando.
  const mostrarAviso = true

  return (
    <header id="inicio" className="hero">
      {/* Ola decorativa del logo, en la esquina izquierda */}
      <div className="hero-ola" aria-hidden="true">
        <svg viewBox="0 0 640 340" preserveAspectRatio="xMinYMin meet">
          <g className="hero-ola__lineas" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {OLA_LINEAS.map((l) => (
              <path key={l.dy} d={OLA_FORMA} transform={`translate(0 ${l.dy})`} opacity={l.op} />
            ))}
          </g>
        </svg>
      </div>

      <div className="container text-center">
        <img className="logo floaty" src="/assets/logo.jpg" alt="MarBravio · Cocina del Mar" />
        <svg className="wave-svg" width="160" height="20" viewBox="0 0 160 20" fill="none">
          <path d="M0 10 Q 20 0 40 10 T 80 10 T 120 10 T 160 10" stroke="#79c4e8" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
        <h2 className="script" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>El sabor del mar a tu alcance</h2>
        <p className="lead mt-3">FRESCURA &nbsp;•&nbsp; CALIDAD &nbsp;•&nbsp; SABOR</p>
        <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
          <a href="#menu" className="btn btn-outline-light px-4 py-2" style={{ borderRadius: 30, letterSpacing: 1 }}>Ver el menú</a>
          {/* Botón de WhatsApp del hero oculto temporalmente.
              Por ahora los pedidos se hacen desde la sección "Pedido".
              Para volver a mostrarlo, descomenta el <a> de abajo.
          <a className="btn btn-whatsapp px-4 py-2" target="_blank" rel="noreferrer"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}>Pedir por WhatsApp</a>
          */}
        </div>

        {/* ---------- Aviso de horario ---------- */}
        {mostrarAviso && (
          <div className={`horario-banner ${horario.abierto ? 'abierto' : 'cerrado'}`} role="status">
            <span className="material-icons">{horario.abierto ? 'storefront' : 'schedule'}</span>
            <div>
              <strong>{horario.mensaje}</strong>
              {horario.abierto ? (
                <p>{horario.detalle}</p>
              ) : (
                <p>
                  {horario.detalle}
                  {horario.proxima ? ` ${horario.proxima}` : ''}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hero-waves" aria-hidden="true">
        <svg viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path className="wave wave-1" d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 C1680,100 1920,20 2160,60 C2400,100 2640,20 2880,60 L2880,120 L0,120 Z" />
          <path className="wave wave-2" d="M0,70 C260,30 520,110 780,70 C1040,30 1240,100 1440,70 C1700,30 1960,110 2220,70 C2480,30 2680,100 2880,70 L2880,120 L0,120 Z" />
        </svg>
      </div>
    </header>
  )
}

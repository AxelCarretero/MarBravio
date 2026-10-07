import React from 'react'
import { WHATSAPP_NUMBER, WHATSAPP_MSG } from '../App'

export default function Hero() {
  return (
    <header id="inicio" className="hero">
      <div className="container text-center">
        <img className="logo floaty mb-4" src="/assets/logo.jpg" alt="Logo MarBravio" />
        <h1>MAR BRAVÍO</h1>
        <div className="tagline">Cocina del Mar</div>
        <svg className="wave-svg" width="160" height="20" viewBox="0 0 160 20" fill="none">
          <path d="M0 10 Q 20 0 40 10 T 80 10 T 120 10 T 160 10" stroke="#79c4e8" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
        <h2 className="script" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>El sabor del mar a tu alcance</h2>
        <p className="lead mt-3">FRESCO &nbsp;•&nbsp; AUTÉNTICO &nbsp;•&nbsp; SIN EXCUSAS</p>
        <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
          <a href="#menu" className="btn btn-outline-light px-4 py-2" style={{ borderRadius: 30, letterSpacing: 1 }}>Ver el menú</a>
          <a className="btn btn-whatsapp px-4 py-2" target="_blank" rel="noreferrer"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}>Pedir por WhatsApp</a>
        </div>
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

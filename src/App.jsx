import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Servicios from './components/Servicios'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'

export const WHATSAPP_NUMBER = '5213325995637'
export const WHATSAPP_MSG = encodeURIComponent('Hola! te ví en tu pagina web MarBravio, deseo hacer un pedido, me tomas la orden?')

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="marbravio-app">
      <Navbar />
      <Hero />
      <Menu />
      <Servicios />
      <Contacto />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

import React, { useState } from 'react'
import { WHATSAPP_NUMBER } from '../App'
import BotonWhatsApp from './BotonWhatsApp'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', telefono: '', mensaje: '' })

  const enviar = (e) => {
    e.preventDefault()
    const texto = encodeURIComponent(
      `Hola! te ví en tu pagina web MarBravio, deseo hacer un pedido, me tomas la orden?\n\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\nMensaje: ${form.mensaje}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, '_blank')
  }

  return (
    <section id="contacto">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <div className="section-subtitle">estamos para servirte</div>
        <div className="divider-line"></div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="contacto-box">
                            <h3 className="serif mb-2" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>
                Mariscos y aguachiles en Guadalajara, zona Atemajac
              </h3>
              <p style={{ color: 'rgba(246,241,231,.8)', fontSize: '.9rem' }}>
                Cocina del mar en el poniente de Guadalajara. Mariscos frescos, aguachiles
                preparados al momento y salsa marisquera de la casa. Orden Bravía $245,
                1/2 orden $160 y Tosti $180.
              </p>
              <p><span className="material-icons">location_on</span> Pamplona 1191, Santa Elena Alcalde, C.P. 44220, Guadalajara, Jal., México</p>
              <p className="mt-2">
                <a className="btn btn-sm btn-outline-light" style={{ borderRadius: 20 }} target="_blank" rel="noreferrer"
                  href="https://maps.app.goo.gl/ytgZ3CzYhC36BAc5A">📍 Ver en Google Maps</a>
              </p>
              <p><span className="material-icons">phone</span> +52 1 33 2599 5637</p>
              <p><span className="material-icons">email</span> zercherrera@gmail.com</p>
              <p><span className="material-icons">schedule</span> Mié, Jue y Sáb: 4:30 PM – 7:00 PM · Dom: 10:00 AM – 4:00 PM</p>
              <div className="mt-3" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <iframe
                  title="Ubicación MarBravio"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Pamplona+1191,+Santa+Elena+Alcalde,+44220+Guadalajara,+Jal&output=embed">
                </iframe>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="contacto-box">
              <form onSubmit={enviar}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" required value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Mensaje o pedido</label>
                    <textarea className="form-control" rows="4" required value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}></textarea>
                  </div>
                  <div className="col-12">
                    <BotonWhatsApp type="submit" onClick={enviar} texto="Enviar por WhatsApp" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

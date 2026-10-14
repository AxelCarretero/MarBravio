import React, { useState } from 'react'
import { WHATSAPP_NUMBER } from '../App'
import BotonWhatsApp from './BotonWhatsApp'
import useHorario from '../useHorario'

// Por ahora solo se muestran los datos y el mapa. Ponlo en true para volver
// a mostrar el formulario de contacto debajo.
const MOSTRAR_FORMULARIO = false

const DATOS_CONTACTO = [
  // La direccion no es link: el boton "Ver en Google Maps" de abajo hace eso mismo
  { icono: 'location_on', etiqueta: 'Dirección', valor: 'Pamplona 1191, Santa Elena Alcalde, C.P. 44220, Guadalajara, Jal.' },
  { icono: 'phone', etiqueta: 'Teléfono', valor: '+52 1 33 2599 5637', enlace: 'tel:+523325995637' },
  { icono: 'email', etiqueta: 'Correo', valor: 'zercherrera@gmail.com', enlace: 'mailto:zercherrera@gmail.com' },
  // El horario no va aqui a proposito: se lee del modulo de horario para que
  // siempre muestre el que esta vigente (ver DATOS_CONTACTO_HORARIO).
]

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', telefono: '', mensaje: '' })
  // El horario se lee del modulo central, asi nunca queda desactualizado
  const horario = useHorario()
  const datos = [...DATOS_CONTACTO, { icono: 'schedule', etiqueta: 'Horario', valor: horario.textoHorario }]

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

        <div className="contacto-box">
          {/* Datos a la izquierda, mapa a la derecha; en celular se apilan */}
          <div className="contacto-grid">
            <div className="contacto-datos">
              <h3 className="serif contacto-datos__titulo">
                Mariscos y aguachiles en Guadalajara, zona Atemajac
              </h3>
              <p className="contacto-datos__texto">
                Cocina del mar en el poniente de Guadalajara. Mariscos frescos, aguachiles
                preparados al momento y salsa marisquera de la casa. Orden Bravía $245,
                1/2 orden $160 y Tosti $180.
              </p>

              <ul className="contacto-lista">
                {datos.map((d) => (
                  <li className="contacto-dato" key={d.etiqueta}>
                    <span className="material-icons contacto-dato__icono" aria-hidden="true">{d.icono}</span>
                    <span className="contacto-dato__texto">
                      <span className="contacto-dato__etiqueta">{d.etiqueta}</span>
                      {d.enlace ? (
                        <a href={d.enlace}>{d.valor}</a>
                      ) : (
                        d.valor
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contacto-mapa">
              <iframe
                title="Ubicación MarBravio"
                src="https://maps.google.com/maps?q=Pamplona+1191,+Santa+Elena+Alcalde,+44220+Guadalajara,+Jal&output=embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="btn btn-sm btn-outline-light contacto-mapa__link"
                target="_blank"
                rel="noreferrer"
                href="https://maps.app.goo.gl/ytgZ3CzYhC36BAc5A"
              >
                <span className="material-icons">place</span> Ver en Google Maps
              </a>
            </div>
          </div>
        </div>

        {MOSTRAR_FORMULARIO && (
          <div className="contacto-box contacto-form">
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
        )}
      </div>
    </section>
  )
}
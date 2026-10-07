import React from 'react'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h4 className="serif">MAR BRAVÍO</h4>
            <p>Cocina del Mar — El sabor del mar a tu alcance. Fresco, auténtico, sin excusas.</p>
            <div className="social-icons mt-3">
              <a href="#" aria-label="Facebook"><span className="material-icons">facebook</span></a>
              <a href="https://www.instagram.com/marbraviooficial?stkn=MWk0cmgxdzJnaTZxbg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><span className="material-icons">photo_camera</span></a>
              <a href="#" aria-label="TikTok"><span className="material-icons">music_note</span></a>
            </div>
          </div>
          <div className="col-md-4">
            <h4>Horario</h4>
            <p className="mb-1">Miércoles, Jueves y Sábado: 4:30 PM – 7:00 PM</p>
            <p>Domingo: 10:00 AM – 4:00 PM</p>
          </div>
          <div className="col-md-4">
            <h4>Enlaces</h4>
            <ul className="list-unstyled">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#menu">Menú</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(121,196,232,.2)' }} />
        <p className="text-center mb-0">© {new Date().getFullYear()} MarBravio · Cocina del Mar. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

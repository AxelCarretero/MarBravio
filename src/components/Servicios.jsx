import React from 'react'

// Catering oculto temporalmente (por ahora no ofrecemos ese servicio).
// Para volver a mostrarlo, descomenta la línea de abajo:
const servicios = [
  { icon: 'restaurant', titulo: 'Comer en el lugar', texto: 'Un ambiente cálido frente al mar para disfrutar nuestros aguachiles recién preparados.' },
  { icon: 'shopping_bag', titulo: 'Para llevar', texto: 'Pide desde casa, recoge en local y llévate el sabor del mar donde tú quieras.' },
  // { icon: 'room_service', titulo: 'Catering', texto: 'Llevamos MarBravio a tus eventos: bodas, fiestas y celebraciones con sazón marino.' },
  { icon: 'delivery_dining', titulo: 'Entrega a domicilio', texto: 'Pedidos por WhatsApp con entrega rápida para que disfrutes sin moverte de casa.' },
]

export default function Servicios() {
  return (
    <section id="servicios" style={{ background: 'rgba(6,23,40,.6)' }}>
      <div className="container">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="section-subtitle">para disfrutar a tu manera</div>
        <div className="divider-line"></div>
        <div className="row g-4">
          {servicios.map((s) => (
            <div className="col-12 col-sm-6 col-lg-3" key={s.titulo}>
              <div className="servicio-card reveal">
                <span className="material-icons">{s.icon}</span>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

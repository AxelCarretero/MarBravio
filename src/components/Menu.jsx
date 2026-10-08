import React, { useEffect, useState } from 'react'
import M from 'materialize-css'
import { WHATSAPP_NUMBER } from '../App'

const aguachiles = [
  { nombre: 'VERDE', apodo: '(Clásico)', color: '#aed16a', emoji: '🫑', precio: 245, desc: 'Salsa verde clásica con un toque de la casa: chile verde, perejil, ajo, sal y pimienta.' },
  { nombre: 'TROPICAL', apodo: '(El Travieso)', color: '#f2b23e', emoji: '🥭', precio: 245, desc: 'Salsa de mango con un toque de habanero tatemado, limón, ajo, sal y pimienta.' },
  { nombre: 'ROJA', apodo: '(De la Casa)', color: '#e04b3a', emoji: '🌶️', precio: 245, desc: 'Combinación de chiles, cacahuate, ajo, cebolla, limón, sal y pimienta.' },
  { nombre: 'NEGRO', apodo: '(El Condenado)', color: '#e8e8e8', emoji: '🔥', precio: 245, desc: 'Combinación de salsas negras con un toque ahumado: habanero, ajo, sal y pimienta.' },
]

export default function Menu() {
  useEffect(() => {
    M.Modal.init(document.querySelectorAll('.modal'))
  }, [])

  const [cart, setCart] = useState([])
  const [notaGeneral, setNotaGeneral] = useState('')
  const [destinatario, setDestinatario] = useState('')
  const [agregado, setAgregado] = useState(null)

  const agregar = (a, tipo) => {
    setCart((prev) => {
      const existe = prev.find((i) => i.nombre === a.nombre && i.tipo === tipo)
      if (existe) {
        return prev.map((i) => i.nombre === a.nombre && i.tipo === tipo ? { ...i, qty: i.qty + 1 } : i)
      }
      const precio = tipo === 'orden' ? 245 : 160
      return [...prev, { nombre: a.nombre, emoji: a.emoji, tipo, precio, qty: 1, nota: '', picor: 'medio' }]
    })
    setAgregado(`${a.nombre}-${tipo}`)
    setTimeout(() => setAgregado(null), 1600)
  }

  const cambiarQty = (nombre, tipo, delta) => {
    setCart((prev) => prev
      .map((i) => i.nombre === nombre && i.tipo === tipo ? { ...i, qty: i.qty + delta } : i)
      .filter((i) => i.qty > 0))
  }

  const setNota = (nombre, tipo, nota) => {
    setCart((prev) => prev.map((i) => i.nombre === nombre && i.tipo === tipo ? { ...i, nota } : i))
  }

  const setPicor = (nombre, tipo, picor) => {
    setCart((prev) => prev.map((i) => i.nombre === nombre && i.tipo === tipo ? { ...i, picor } : i))
  }

  const quitar = (nombre, tipo) => setCart((prev) => prev.filter((i) => !(i.nombre === nombre && i.tipo === tipo)))

  const enviarPedido = () => {
    if (cart.length === 0) return
    const lineas = cart
      .map((i) => `• ${i.qty}x Aguachile ${i.nombre} (${i.tipo === 'orden' ? 'Orden Bravía' : '1/2 Orden'}) — Picor: ${i.picor || 'medio'} — $${i.precio * i.qty}${i.nota ? ` — ${i.nota}` : ''}`)
      .join('\n')
    const total = cart.reduce((sum, i) => sum + i.precio * i.qty, 0)
    const texto = encodeURIComponent(
      `Hola! te ví en tu pagina web MarBravio, deseo hacer un pedido, me tomas la orden?\n\nPara: ${destinatario.trim() || '(sin nombre)'}\n\nMi pedido:\n${lineas}\n\nTotal: $${total}${notaGeneral ? `\n\nEspecificaciones: ${notaGeneral}` : ''}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, '_blank')
  }

  return (
    <section id="menu">
      <div className="container">
        <h2 className="section-title">Nuestros Aguachiles</h2>
        <div className="section-subtitle">frescos, calidad y sabor</div>
        <div className="divider-line"></div>

        <div className="row g-4">
          {aguachiles.map((a) => (
            <div className="col-6 col-lg-3" key={a.nombre}>
              <div className="menu-card reveal" style={{ color: a.color }}>
                <div className="icon-badge" style={{ color: a.color }}>{a.emoji}</div>
                <h3>{a.nombre}</h3>
                <div className="nick">{a.apodo}</div>
                <div className="serif" style={{ fontSize: '1.4rem', fontWeight: 800 }}>${a.precio}</div>
                <p className="mt-2">{a.desc}</p>
                <button className={`btn-agregar ${agregado === a.nombre + '-orden' ? 'agregado' : ''}`}
                  onClick={() => agregar(a, 'orden')}
                  style={{ background: agregado === a.nombre + '-orden' ? '#25d366' : a.color }}>
                  {agregado === a.nombre + '-orden' ? '✓ Orden agregada' : '+ Orden $245'}
                </button>
                <button className={`btn-agregar ${agregado === a.nombre + '-media' ? 'agregado' : ''}`}
                  onClick={() => agregar(a, 'media')}
                  style={{ background: agregado === a.nombre + '-media' ? '#25d366' : 'transparent', border: `2px solid ${a.color}`, color: agregado === a.nombre + '-media' ? '#fff' : a.color }}>
                  {agregado === a.nombre + '-media' ? '✓ ½ Orden agregada' : '+ ½ Orden $160'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-4" style={{ color: 'rgba(246,241,231,.85)' }}>
          Todas llevan pepino, cebolla morada, coronado con aguacate y una salsa marisquera (receta de la casa).
        </p>
        <p className="text-center script" style={{ fontSize: '1.8rem', marginTop: '-8px' }}>
          Tú decides qué tan bravío lo quieres 🌶️
        </p>

        <div className="prices-box mt-4">
          <h3 className="text-center serif">PRECIOS</h3>
          <div className="row text-center mt-4">
            <div className="col-md-4 price-col">
              <h4>ORDEN BRAVÍA</h4>
              <div className="amount">$245</div>
            </div>
            <div className="col-md-4 price-col">
              <h4>1/2 ORDEN</h4>
              <div className="amount">$160</div>
            </div>
            <div className="col-md-4 price-col">
              <h4>TOSTI</h4>
              <div className="amount">$180</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <a className="btn modal-trigger btn-outline-light px-4 py-2" href="#menuModal" data-target="menuModal" style={{ borderRadius: 30, letterSpacing: 1 }}>
            Ver carta completa
          </a>
        </div>

        {/* ---------- Carrito de pedido ---------- */}
        <div className="contacto-box mt-5">
          <h3 className="serif" style={{ letterSpacing: 2 }}>🛒 Tu pedido</h3>
          {cart.length === 0 ? (
            <p style={{ color: 'rgba(246,241,231,.7)' }}>Aún no agregas nada. Usa los botones <em>+ Agregar al pedido</em> de arriba.</p>
          ) : (
            <>
              {cart.map((i) => (
                <div key={i.nombre + i.tipo} className="row align-items-center g-2 mb-2">
                  <div className="col-12 col-md-3"><strong>{i.emoji} Aguachile {i.nombre}</strong><br /><small style={{ color: '#79c4e8' }}>{i.tipo === 'orden' ? 'Orden Bravía' : '1/2 Orden'} — ${i.precio} c/u</small></div>
                  <div className="col-4 col-md-2">
                    <button className="btn btn-sm btn-outline-light me-1" onClick={() => cambiarQty(i.nombre, i.tipo, -1)}>−</button>
                    <span>{i.qty}</span>
                    <button className="btn btn-sm btn-outline-light ms-1" onClick={() => cambiarQty(i.nombre, i.tipo, 1)}>+</button>
                  </div>
                  <div className="col-8 col-md-3">
                    <select className="form-select form-select-sm" aria-label="Nivel de picor" value={i.picor || 'medio'}
                      onChange={(e) => setPicor(i.nombre, i.tipo, e.target.value)}>
                      <option value="bajo">Picor: Bajo</option>
                      <option value="medio">Picor: Medio</option>
                      <option value="alto">Picor: Alto</option>
                    </select>
                  </div>
                  <div className="col-8 col-md-2 text-md-center"><strong style={{ color: '#79c4e8' }}>${(i.precio * i.qty).toFixed(0)}</strong></div>
                  <div className="col-12 col-md-2">
                    <input className="form-control form-control-sm" placeholder="Ej. sin cebolla"
                      value={i.nota} onChange={(e) => setNota(i.nombre, i.tipo, e.target.value)} />
                  </div>
                  <div className="col-4 col-md-12 text-md-end mt-1">
                    <button className="btn btn-sm btn-danger" onClick={() => quitar(i.nombre, i.tipo)}>✕ Quitar</button>
                  </div>
                </div>
              ))}
              <div className="mt-3 mb-3">
                <label className="form-label">El pedido es para...</label>
                <input className="form-control" value={destinatario}
                  onChange={(e) => setDestinatario(e.target.value)}
                  placeholder="Nombre de a quién va dirigido" style={{ color: '#fff' }} />
              </div>
              <div>
                <label className="form-label">¿Algo más en especial? (ej. tosti, extra salsa)</label>
                <textarea className="form-control" rows="2" value={notaGeneral}
                  onChange={(e) => setNotaGeneral(e.target.value)}
                  placeholder="Escribe aquí tus especificaciones generales..." style={{ color: '#fff' }}></textarea>
              </div>
              <div className="text-end mt-3">
                <span style={{ fontSize: '1.3rem', color: '#f6f1e7' }}>Total: </span>
                <strong className="serif" style={{ fontSize: '1.8rem', color: '#f2b23e' }}>
                  ${cart.reduce((sum, i) => sum + i.precio * i.qty, 0).toFixed(0)}
                </strong>
              </div>
              <button className="btn btn-whatsapp px-4 py-2 mt-3" onClick={enviarPedido}>
                Enviar pedido por WhatsApp
              </button>
            </>
          )}
        </div>
      </div>

      <div id="menuModal" className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-content" style={{ background: '#0a2540', padding: 12 }}>
          <img src="/assets/menu01.jpeg" alt="Carta MarBravio" className="img-fluid" style={{ borderRadius: 10 }} />
        </div>
        <div className="modal-footer" style={{ background: '#0a2540' }}>
          <a href="#!" className="modal-close btn-flat" style={{ color: '#79c4e8' }}>Cerrar</a>
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useState } from 'react'
import M from 'materialize-css'
import { WHATSAPP_NUMBER } from '../App'

// Iconos dibujados a mano con el mismo estilo de línea para que los cuatro
// se vean de la misma familia. Cada uno toma el color de su aguachile.
const ICONOS = {
  // Chile: usado por Verde y Roja, solo cambia el color
  chile: (
    <>
      {/* rabo */}
      <path d="M15.5 6.5c0-1.6 1-2.8 2.6-3" />
      {/* cuerpo curvo que se ensancha hacia abajo */}
      <path d="M18.1 3.5c-.9 3.2-1.4 5.6-3.3 7.8-2.2 2.5-5.3 4.6-5.3 9.2a7.9 7.9 0 0 0 15.8 0c0-4-2.2-6.2-4.2-8.4-1.9-2.1-2.4-5.2-3-8.6z" />
      {/* brillo interior */}
      <path d="M13.6 17.5c-1 1.3-1.5 2.6-1.5 3.9" />
    </>
  ),
  // Mango: cuerpo ovalado inclinado + hoja
  mango: (
    <>
      <path d="M17.5 9.8c4.6.6 8 3.6 8 7.9 0 4.8-4.3 8.4-9.6 8.4-4.7 0-8.4-2.8-8.4-6.7 0-3.3 2.3-5.9 5.6-7.4 1.5-.7 3-1.4 4.4-2.2z" />
      <path d="M17.5 9.8c.2-2.7 2.3-4.7 5.3-4.8-.2 2.7-2.3 4.7-5.3 4.8z" />
      <path d="M16.8 9.6c-.6-1-1.5-1.7-2.6-2" />
    </>
  ),
  // Salsa en frasco con gotero
  salsa: (
    <>
      <path d="M13 4.5h6" />
      <path d="M14.2 4.5v2.8c0 .9-.6 1.5-1.4 2.1-1.5 1.2-2.6 2.7-2.6 4.8v9.3c0 1.9 1.5 3.5 3.4 3.5h2.8c1.9 0 3.4-1.6 3.4-3.5v-9.3c0-2.1-1.1-3.6-2.6-4.8-.8-.6-1.4-1.2-1.4-2.1V4.5" />
      <path d="M13.8 17.5h4.4" />
    </>
  ),
  // Llama ahumada con doble trazo
  llama: (
    <>
      <path d="M16 28.5c-4.9 0-8.8-3.4-8.8-7.9 0-5.6 4.9-7.6 7.3-11.7 1.3-2.2 2.2-3.9 2.2-3.9s.6 2.6.6 5.2c0 2.2-.8 3.6-1.7 4.9 1.4-.5 2.3-1.7 2.3-3.4 2.2 2.1 6.9 5 6.9 8.9 0 4.5-3.9 7.9-8.8 7.9z" />
      <path d="M16 28.5c-2.5 0-4.4-1.9-4.4-4.3 0-2.9 3-4 4-6.8 1 2.8 4.8 3.9 4.8 6.8 0 2.4-1.9 4.3-4.4 4.3z" />
    </>
  ),
}

function IconoAguachile({ tipo, color }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="44"
      height="44"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONOS[tipo]}
    </svg>
  )
}

const aguachiles = [
  { nombre: 'VERDE', apodo: '(Clásico)', color: '#aed16a', icono: 'chile', precio: 245, desc: 'Salsa verde clásica con un toque de la casa: chile verde, perejil, ajo, sal y pimienta.' },
  { nombre: 'TROPICAL', apodo: '(El Travieso)', color: '#f2b23e', icono: 'mango', precio: 245, desc: 'Salsa de mango con un toque de habanero tatemado, limón, ajo, sal y pimienta.' },
  { nombre: 'ROJA', apodo: '(De la Casa)', color: '#e04b3a', icono: 'chile', precio: 245, desc: 'Combinación de chiles, cacahuate, ajo, cebolla, limón, sal y pimienta.' },
  { nombre: 'NEGRO', apodo: '(El Condenado)', color: '#e8e8e8', icono: 'llama', precio: 245, desc: 'Combinación de salsas negras con un toque ahumado: habanero, ajo, sal y pimienta.' },
]

// Extra opcional que se puede sumar a cualquier pedido
const EXTRA_SALSA = {
  nombre: 'Salsa marisquera extra',
  tipo: 'extra',
  icono: 'salsa',
  color: '#e8823a',
  precio: 15,
}
const MAX_EXTRAS = 10

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
      return [...prev, { nombre: a.nombre, icono: a.icono, color: a.color, tipo, precio, qty: 1, nota: '', picor: 'medio' }]
    })
    setAgregado(`${a.nombre}-${tipo}`)
    setTimeout(() => setAgregado(null), 1600)
  }

  const extrasEnCarrito = cart
    .filter((i) => i.tipo === EXTRA_SALSA.tipo)
    .reduce((sum, i) => sum + i.qty, 0)

  const agregarSalsaExtra = () => {
    setCart((prev) => {
      // El limite se valida contra prev, no contra el contador del render:
      // asi clics seguidos en el mismo tick respetan el maximo.
      const usados = prev
        .filter((i) => i.tipo === EXTRA_SALSA.tipo)
        .reduce((sum, i) => sum + i.qty, 0)
      if (usados >= MAX_EXTRAS) return prev

      const existe = prev.find((i) => i.tipo === EXTRA_SALSA.tipo)
      if (existe) {
        return prev.map((i) => i.tipo === EXTRA_SALSA.tipo ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...EXTRA_SALSA, qty: 1, nota: '', picor: null }]
    })
    setAgregado(`${EXTRA_SALSA.nombre}-extra`)
    setTimeout(() => setAgregado(null), 1600)
  }

  const cambiarQty = (nombre, tipo, delta) => {
    setCart((prev) => {
      // No dejar pasar de 10 unidades de salsa extra
      if (tipo === EXTRA_SALSA.tipo && delta > 0) {
        const usados = prev
          .filter((i) => i.tipo === EXTRA_SALSA.tipo)
          .reduce((sum, i) => sum + i.qty, 0)
        if (usados >= MAX_EXTRAS) return prev
      }
      return prev
        .map((i) => i.nombre === nombre && i.tipo === tipo ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    })
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
      .map((i) => {
        const etiqueta =
          i.tipo === 'extra'
            ? i.nombre
            : `Aguachile ${i.nombre} (${i.tipo === 'orden' ? 'Orden Bravía' : '1/2 Orden'})`
        const picor = i.tipo === 'extra' ? '' : ` — Picor: ${i.picor || 'medio'}`
        return `• ${i.qty}x ${etiqueta}${picor} — $${i.precio * i.qty}${i.nota ? ` — ${i.nota}` : ''}`
      })
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
                <div className="icon-badge" style={{ color: a.color }}>
                  <IconoAguachile tipo={a.icono} color={a.color} />
                </div>
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

        {/* ---------- Extras ---------- */}
        <div className="extras-box mt-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <span className="extras-icon">
                <IconoAguachile tipo={EXTRA_SALSA.icono} color={EXTRA_SALSA.color} />
              </span>
              <div>
                <strong style={{ color: 'var(--cream)' }}>¿Want más salsa marisquera?</strong>
                <br />
                <small style={{ color: 'rgba(246,241,231,.7)' }}>
                  Extra de la casa · $15 c/u · máximo {MAX_EXTRAS} por pedido
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="extras-contador">{extrasEnCarrito}/{MAX_EXTRAS}</span>
              <button
                className="btn-agregar btn-extras"
                onClick={agregarSalsaExtra}
                disabled={extrasEnCarrito >= MAX_EXTRAS}
              >
                {extrasEnCarrito >= MAX_EXTRAS ? 'Máximo alcanzado' : `+ Agregar salsa extra $${EXTRA_SALSA.precio}`}
              </button>
            </div>
          </div>
        </div>

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
                  <div className="col-12 col-md-3 d-flex align-items-center gap-2">
                    <span style={{ flex: '0 0 34px', display: 'inline-flex' }}>
                      <IconoAguachile tipo={i.icono} color={i.color} />
                    </span>
                    <span>
                      <strong>{i.tipo === 'extra' ? i.nombre : `Aguachile ${i.nombre}`}</strong><br />
                      <small style={{ color: '#79c4e8' }}>
                        {i.tipo === 'extra'
                          ? `Extra — $${i.precio} c/u`
                          : `${i.tipo === 'orden' ? 'Orden Bravía' : '1/2 Orden'} — $${i.precio} c/u`}
                      </small>
                    </span>
                  </div>
                  <div className="col-4 col-md-2">
                    <button className="btn btn-sm btn-outline-light me-1" onClick={() => cambiarQty(i.nombre, i.tipo, -1)}>−</button>
                    <span>{i.qty}</span>
                    <button className="btn btn-sm btn-outline-light ms-1" onClick={() => cambiarQty(i.nombre, i.tipo, 1)}>+</button>
                  </div>
                  <div className="col-8 col-md-3">
                    {i.tipo === 'extra' ? (
                      <small style={{ color: 'rgba(246,241,231,.55)' }}>Sin picor</small>
                    ) : (
                      <select className="form-select form-select-sm" aria-label="Nivel de picor" value={i.picor || 'medio'}
                        onChange={(e) => setPicor(i.nombre, i.tipo, e.target.value)}>
                        <option value="bajo">Picor: Bajo</option>
                        <option value="medio">Picor: Medio</option>
                        <option value="alto">Picor: Alto</option>
                      </select>
                    )}
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

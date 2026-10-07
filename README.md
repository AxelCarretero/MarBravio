# 🌊 MarBravio — Landing Page

Landing page oficial del restaurante **MarBravio · Cocina del Mar**: menú, servicios, contacto y pedidos por WhatsApp.

---

## 🛠️ Stack de tecnologías

| Tecnología | Uso |
|---|---|
| **React 18** | Estructura de componentes, estado del carrito |
| **Vite 5** | Bundler y dev server |
| **Bootstrap 5** | Grid, navbar, formularios, botones |
| **Materialize CSS 1.0** | Modal (carta), estilos auxiliares, iconos |
| **CSS3** | Paleta del logo, animaciones, responsive |
| **Google Fonts** | Playfair Display, Montserrat, Great Vibes |
| **Material Icons** | Iconos de contacto, footer, servicios |

---

## 🎨 Paleta de colores (del logo)

| Color | Hex | Uso |
|---|---|---|
| Azul marino | `#0a2540` / `#061728` | Fondo principal |
| Crema | `#f6f1e7` | Texto principal |
| Naranja camarón | `#e8823a` | Acentos, precios destacados |
| Azul cielo | `#79c4e8` | Títulos secundarios, bordes |
| Verde lima | `#aed16a` | Aguachile Verde |
| Amarillo mango | `#f2b23e` | Aguachile Tropical, total |
| Rojo chile | `#e04b3a` | Aguachile Roja |
| Blanco | `#e8e8e8` | Aguachile Negro |

---

## 📦 Instalación y levantamiento

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar en desarrollo (hot reload)
npm run dev
# → http://localhost:5173

# 3. Build de producción
npm run build
# → genera la carpeta /dist

# 4. Previsualizar build de producción
npm run preview
```

> En Windows, si `npm` da error de políticas de ejecución, usa `npm.cmd`.

---

## 📁 Estructura del proyecto

```
MarBravio/
├── index.html               # Entry HTML, fuentes, iconos
├── vite.config.js           # Config de Vite
├── package.json
├── public/
│   └── assets/
│       ├── logo.jpg         # Logo oficial
│       └── menu01.jpeg      # Carta del menú (modal)
└── src/
    ├── main.jsx             # Bootstrap + Materialize CSS + App
    ├── index.css            # Estilos globales, paleta, animaciones
    ├── App.jsx              # Componente raíz + constantes WhatsApp
    └── components/
        ├── Navbar.jsx       # Menú de navegación (anclas)
        ├── Hero.jsx         # Header con logo, olas animadas y CTAs
        ├── Menu.jsx         # Aguachiles, precios, carrito, modal
        ├── Servicios.jsx    # Servicios del restaurante
        ├── Contacto.jsx     # Datos, mapa embebido, formulario
        ├── Footer.jsx       # Horario, enlaces, redes, copyright
        └── WhatsAppFloat.jsx# Botón flotante de WhatsApp
```

---

## ✨ Funcionalidades actuales

### 1. Hero / Header
- Logo animado (flota suavemente) de **420px**, responsive (`max-width: 78vw`)
- Slogan con tipografía script: *El sabor del mar a tu alcance*
- **Animación de olas SVG** en la base (dos capas en loop continuo)
- Botones alineados: "Ver el menú" y "Pedir por WhatsApp"

### 2. Menú — Nuestros Aguachiles
- 4 tarjetas: Verde (Clásico), Tropical (El Travieso), Roja (De la Casa), Negro (El Condenado)
- Descripción de cada salsa + nota compartida: *Todas llevan pepino, cebolla morada, coronado con aguacate y una salsa marisquera (receta de la casa)*
- Frase destacada: *Tú decides qué tan bravío lo quieres 🌶️*
- Precio visible por tarjeta (`$245`)

#### 🛒 Carrito de pedidos (en `Menu.jsx`)
- Dos botones por aguachile: **+ Orden $245** y **+ ½ Orden $160**, separados y alineados
- Feedback al agregar: el botón se pone verde con *"✓ Orden agregada"* / *"✓ ½ Orden agregada"* + animación pop
- En el carrito: cantidad con botones − / +, subtotal por línea, campo de **especificación por platillo**, botón de quitar
- Nota general: *¿Algo más en especial?* (tosti, salsa extra, etc.)
- **Total** en vivo + botón **"Enviar pedido por WhatsApp"** que arma el mensaje con saludo, líneas, tipos, precios y total

#### 💰 Precios (referencia)
| Platillo | Precio |
|---|---|
| Orden Bravía | $245 |
| 1/2 Orden | $160 |
| Tosti | $180 *(pendiente de agregar al carrito)* |

### 3. Servicios
Tarjetas con iconos de Materialize: Comer en el lugar, Para llevar, Catering, Entrega a domicilio.

### 4. Contacto
- 📍 Pamplona 1191, Santa Elena Alcalde, C.P. 44220, Guadalajara, Jal.
- 📞 +52 1 33 2599 5637
- ✉️ zercherrera@gmail.com
- 🕐 Horarios reales
- 🗺️ Mapa de Google Maps **embebido (iframe)** + botón "Ver en Google Maps"
- Formulario que envía el mensaje directo a WhatsApp

### 5. WhatsApp
- Número único en `src/App.jsx`: `WHATSAPP_NUMBER = '5213325995637'`
- Saludo por defecto: *"Hola! te ví en tu pagina web MarBravio, deseo hacer un pedido, me tomas la orden?"*
- Botón flotante (verde, animado pulsante) presente en toda la página

### 6. Horario de atención
- **Miércoles, Jueves y Sábado:** 4:30 PM – 7:00 PM
- **Domingo:** 10:00 AM – 4:00 PM

### 7. Footer
Marca, horario, enlaces rápidos, redes sociales y copyright dinámico con el año actual.

---

## 📱 Responsive
- Grid de Bootstrap: 4 cols (desktop) → 2 cols (tablet) → 1 col (móvil)
- Navbar con collapse en móvil
- Botones de pedido apilados y de ancho completo en tarjetas estrechas

---

## 🔀 Versionamiento

El proyecto no está inicializado como repositorio git todavía. Para versionarlo:

```bash
git init
git add .
git commit -m "v1.0.0 - Landing MarBravio funcional"
git branch -M main
git remote add origin <url-del-repo>
git push -u origin main
```

Recomendación de versiones semánticas (semver):
- `v1.0.0` — actual
- **Patch** (`v1.0.1`): correcciones de texto/estilos
- **Minor** (`v1.1.0`): nuevas funciones (ej. agregar Tosti al carrito)
- **Major** (`v2.0.0`): cambios de estructura grande

---

## 🚀 Despliegue

```bash
npm run build   # genera /dist
```

Sube el contenido de `dist/` a cualquiera de estos hosts estáticos:
- **Netlify** (arrastrar carpeta `dist`)
- **Vercel** (`vercel --prod`)
- **GitHub Pages**, Cloudflare Pages, Firebase Hosting, etc.

---

## 🔧 Personalización rápida

| Qué | Dónde |
|---|---|
| Número de WhatsApp | `src/App.jsx` → `WHATSAPP_NUMBER` |
| Mensaje por defecto | `src/App.jsx` → `WHATSAPP_MSG` |
| Aguachiles / precios | `src/components/Menu.jsx` → array `aguachiles` |
| Horarios | `src/components/Contacto.jsx` y `src/components/Footer.jsx` |
| Dirección / mapa | `src/components/Contacto.jsx` |
| Colores | `src/index.css` → `:root` |

---

© 2026 MarBravio · Cocina del Mar

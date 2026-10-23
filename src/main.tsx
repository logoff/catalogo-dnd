import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Quita la vista previa genérica de index.html: a partir de aquí la gestiona cada página
document.querySelectorAll('[data-static-meta]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

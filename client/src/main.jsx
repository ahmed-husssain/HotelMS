import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-recover from stale Vite chunk hashes after new production deployments
// Prevents blank screens when navigating to lazy routes cached from older builds
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Vite] Stale chunk detected after deployment. Auto-reloading latest bundle...', event)
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

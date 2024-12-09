import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App.jsx'
import Calendario from './ejemplos_del_curso/Calendario.jsx'

console.log(import.meta.env.VITE_ENDPOINT_PROFESORES); // Debe mostrar la URL


createRoot(document.getElementById('root')).render(
  <StrictMode>
       <App />
  </StrictMode>,
)

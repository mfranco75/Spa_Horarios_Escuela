import { useState } from 'react'

import { ClaseDos } from './ejemplos_del_curso/ClaseDos.jsx'
import { ComponenteUno } from './ejemplos_del_curso/ComponenteUno.jsx'
import ClaseCuatro from './ejemplos_del_curso/ClaseCuatro.jsx'
import Text from './ejemplos_del_curso/Text.jsx'
import HorariosContainer from './ejemplos_del_curso/HorariosContainer.jsx'
import FullCalendarContainer from './ejemplos_del_curso/fullCalendarContainer.jsx'
import Calendario from './ejemplos_del_curso/Calendario.jsx'



function App() {
   
  return (
    <div className='App'>
      <h1>Curso React con Vite</h1>
      <div>
        <h1>PADRE</h1>
        <hr/>
          <Calendario/>       
      </div>
      
    </div>
  )
}

export default App

/* <ComponenteUno/>
          <ClaseDos nombre="Mariano" edad= "49" nacionalidad= "Argentino"/>
          <ClaseCuatro/>
          <Text/>
          <HorariosContainer/>
*/

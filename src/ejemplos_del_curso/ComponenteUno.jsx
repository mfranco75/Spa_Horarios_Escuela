export const ComponenteUno = () => {
    /// EJEMPLOS de variables con codigo html
    
    const titulo = <h2>Titulo del componente h2</h2>
    const parrafo = <p>texto de parrafo</p>
    const division = <div>seccion dividida</div> 
    const curso =<a href= "https://www.youtube.com/watch?v=EJzX4XSpZFg">Link del Curso</a>
    const linea = <hr/>
  return (
      <div>
          {titulo}
          {parrafo}
          {division}      
          {curso}
          {linea}
        </div>
  )
  }
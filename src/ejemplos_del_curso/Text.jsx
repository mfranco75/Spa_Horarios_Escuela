import { useState } from "react"

const Text = () => {

    const [show, setShow] = useState(true)

    function handleShow() {
        setShow(!show)
    }

    const [condicion, setCondicion] = useState(true)

    function cambiarCondicion() {
        setCondicion(!condicion)
    } 


    return (
        <div>
            <button onClick={handleShow}>Mostrar / Ocultar</button>
            {show === true && <h2>Texto dinámico</h2>/* operador And*/}
            <hr/>
            <button onClick={cambiarCondicion}>Cambiar Condición</button>
            {condicion ? <h2>Verdadero</h2> : <h2>Falso</h2>/* operador Ternario*/}
            <hr/>
        </div>
    )
}

// show === true es igual a poner directamente show


export default Text
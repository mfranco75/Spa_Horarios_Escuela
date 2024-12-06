import { useState } from "react"

const ClaseCuatro = () => {

    // uso de UseState : const [variable, funcion] = useState
    const [number, setNumber] = useState(0); 

    const sumar = () => {
        setNumber(number + 1);
    }

    const restar = () =>{
        setNumber(number - 1);
    }
    return (
    <div>
        <h3>utilizar useState para actualizar el numero</h3>
        <button onClick={restar}>Restar</button>
        <h2>{number}</h2>
        <button onClick={sumar}>Sumar</button>
    </div>
    )
}

export default ClaseCuatro
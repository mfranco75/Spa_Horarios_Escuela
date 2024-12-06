export const ClaseDos = ({nombre, edad, nacionalidad}) => {

// const {nombre, edad, nacionalidad} = props; // desestructurar un objeto. extrae de las props las llaves
                                            // reemplazaria a prpos.nombre
return (
    <div>
        <h2>Nombre: {nombre}</h2> 
        <p>Edad: {edad}</p>
        <p>Nacionalidad: {nacionalidad}</p>
        <hr/>
    </div>
)
}
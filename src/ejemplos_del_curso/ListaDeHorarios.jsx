


const ListaDeHorarios = ({horarios}) => {

    return (
        <div>
            <h1>Horarios del Profesor</h1>
                { 
                    horarios.length > 0 &&
                    horarios.map((horario) => {

                        return (
                            <div> 
                                <h2>{horario.materia}</h2>
                                <p>{horario.dia} de {horario.hora_inicio} a {horario.hora_fin}</p>
                                <p>Carrera: {horario.carrera_id} - Año/Nivel: {horario.nivel} </p>
                            </div>  
                        )   
                    })
                }
        </div>

    )
}

export default ListaDeHorarios
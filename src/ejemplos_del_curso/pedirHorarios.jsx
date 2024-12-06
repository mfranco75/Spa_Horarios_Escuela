import data from "../horario_prof_70.json"

const pedirHorarios = () => {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

export default pedirHorarios
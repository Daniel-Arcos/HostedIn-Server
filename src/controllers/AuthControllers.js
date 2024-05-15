const { token } = require('morgan')
const UserService = require('../services/AuthService')

const signUp = async (req, res) => {
    try {
        const {email, fullName, birthDate, phoneNumber, password} = req.body
        if (email == null ||
            fullName == null ||
            birthDate == null ||
            phoneNumber == null ||
            password == null
        ) {
            res.status(400).send({ 
                error: "Uno de los siguientes campos falta o esta vacio en la peticion: 'email', 'fullName', 'birthDate', 'phoneNumber', 'password'"})
        }

        result = await UserService.createAccount(email, fullName, birthDate, phoneNumber, password);
        const documentoUserJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Cuenta creada exitosamente",
            user: {
                email: documentoUserJson.email,
                fullName: documentoUserJson.fullName,
                phoneNumber: documentoUserJson.phoneNumber,
                id: documentoUserJson._id
            }
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }


}
const signIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (email == null ||
            password == null
        ) {
            res.status(400).send({ 
                error: "Uno de los siguientes campos falta o esta vacio en la peticion: 'email', 'password'"})
        }

        result = await UserService.signIn(email, password);
        const documentoUserJson = result[0].toJSON()
        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Inicio de sesion exitoso",
            user: {
                email: documentoUserJson.email,
                fullName: documentoUserJson.fullName,
                phoneNumber: documentoUserJson.phoneNumber,
                id: documentoUserJson._id
            }
        })
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({message: error?.message || error});
    }
}

module.exports = {
    signUp,
    signIn
}

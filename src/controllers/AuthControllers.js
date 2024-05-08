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

        console.log(email)

        result = await UserService.createAccount(email, fullName, birthDate, phoneNumber, password);
        res.cookie('token', result[1]);
        const documentoUserJson = result[0].toJSON()
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
        console.log(error)
        res.status(500).send({
            message: "Algo ocurrio. Lo solucionaremos pronto."
        })
    }


}
const signIn = async (req, res) => {
    res.send('signin')
}

module.exports = {
    signUp,
    signIn
}

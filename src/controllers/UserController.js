const UserService = require('../services/UserService')
const User = require('../models/User')

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (userId == null) {
            return res.status(400).send({error: "El id del usuario 'userId' viene nulo"})
        }

        const result = await UserService.getUser(userId);

        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Cuenta recuperada con éxito",
            user: result[0]
        })
    } catch (error) {
        console.error("Error al recuperar la cuenta del usuario:", error);
        res.status(error?.status || 500)
            .send({
                message: error?.message || error
            })
    }
}

const updateUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (userId == null) {
            return res.status(400).send({error: "El id del usuario viene nulo"})
        }

        const {email, fullName, birthDate, phoneNumber, occupation, residence, profilePhoto} = req.body
        
        if (email == null ||
            fullName == null ||
            birthDate == null ||
            phoneNumber == null
        ) {
            return res.status(400).send({ 
                error: "Uno de los siguientes campos falta o esta vacio en la peticion: 'email', 'fullName', 'birthDate', 'phoneNumber'"
            })
        }

        const userToEdit = new User({
            email,
            fullName,
            birthDate,
            phoneNumber,
            occupation,
            residence,
            profilePhoto
        })
        
        const result = await UserService.editAccount(userId, userToEdit);

        res.header('Authorization', `Bearer ${result[1]}`);
        res.status(200).send({
            message: "Cuenta actualizada con exito"
        })
    } catch (error) {
        console.error("Error al actualizar la cuenta:", error);
        res.status(error?.status || 500)
            .send({
                message: error?.message || error
            })
    }
}

const deleteUserById = (req, res) => {

}

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById
}
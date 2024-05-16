const { token } = require('morgan')
const User = require('../models/User')
const Jwt = require('../Security/Jwt')

const ID_MONGO_DB_SIZE = 24;

const getUser = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        const userFound = await User.findById(userId);

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }

        const token = Jwt.sign(userFound._id);

        return [userFound, token];

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const editAccount = async (userId, userToEdit) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        const userFound = await User.findById(userId);

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }

        userFound.fullName = userToEdit.fullName;
        userFound.birthDate = userToEdit.birthDate;
        userFound.phoneNumber = userToEdit.phoneNumber;
        userFound.occupation = userToEdit.occupation;
        userFound.residence = userToEdit.residence;
        userFound.profilePhoto = userToEdit.profilePhoto;

        const editedUser = await userFound.save();

        const token = Jwt.sign(userFound._id);

        return [editedUser, token]
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

const deleteAccount = async (userId) => {
    try {

        if (typeof userId !== 'string' || userId.trim() === '' || userId.length !== ID_MONGO_DB_SIZE) {
            throw {
                status: 400,
                message: "El ID proporcionado no es válido."
            };
        }

        const userFound = await User.findById(userId);

        if (!userFound) {
            throw {
                status: 404,
                message: "Usuario no encontrado"
            }
        }

        const deletedUser = await User.deleteOne({ _id: userId });

        if (deletedUser.deletedCount === 0) {
            throw {
                status: 500,
                message: "Error al eliminar el usuario. Inténtelo de nuevo más tarde."
            };
        }

        const token = Jwt.sign(userFound._id);

        return [deletedUser, token]

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error.message
        }
    }
}

module.exports = { 
    editAccount, 
    getUser,
    deleteAccount
}
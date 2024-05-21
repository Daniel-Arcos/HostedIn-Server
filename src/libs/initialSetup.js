const dotenv = require('dotenv')
dotenv.config()

const Role = require('../models/Role')
const User = require('../models/User')

const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count > 0) return;

        const values = await Promise.all([
            new Role({name: "Host"}).save(),
            new Role({name: "Guest"}).save()
        ])

        console.log("Creados " + values)
    } catch (error) {
        console.log(error)
    }
}

// const createdAdmin = async () => {
//     const userFound = await User.findOne( { email: MODERATOR_EMAIL})
//     if (userFound) return;

//     const role = await Role.findOne({name: "moderator"})
//     const newUser = await User.create({
//         email: MODERATOR_EMAIL,
//         fullName: MODERATOR_FULL_NAME,
//         phoneNumber: MODERATOR_PHONE,
//         password: MODERATOR_PASSWORD,
//         role: role._id
//     })

//     console.log(`new user created: ${newUser.email}`);
// }

createRoles();
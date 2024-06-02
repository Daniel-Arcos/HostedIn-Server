const RoleService = require('../services/role.service')

const getAll = async (req, res, next) => {
    try {
        let data = await RoleService.getAll()
        return res.status(200).send({
            message: "Roles recuperados exitosamente",
            roles: data
        })
    } catch (error) {
        if (error.status) {
            return res
                .status(error.status)
                .send({message: error.message});
        }
        next(error)
    }
}

module.exports = {
    getAll
}

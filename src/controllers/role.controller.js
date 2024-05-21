const RoleService = require('../services/role.service')

const getAll = async () => {
    try {
        let data = await RoleService.getAll()
        return res.status(200).send({
            message: "Roles recuperados exitosamente",
            roles: data
        })
    } catch (error) {
        res.status(error?.status || 500)
            .send({
                message: error?.message || error
            })
    }
}

module.exports = {
    getAll
}

const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Registro con datos incorrectos', () => {
    let userTest = {
        _id: '',
        email: 'usertest@gmail.com',
        fullName: 'User Test Number One',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'P4SSw0RD#123',
        roles: ['Guest', 'Host']
    }
    let token;

    afterAll (async () => {
        app.close()
        moongose.disconnect();
    })

    it('Registrar cuenta con datos correctos', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userTest.email,
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(201)
        expect(res.body.user.email).toEqual(userTest.email)
        expect(res.body.user.fullName).toEqual(userTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
        userTest._id = res.body.user._id
        let tokenBearer = res.headers.authorization
        token = tokenBearer.replace("Bearer ", "")
    })

    it('Registrar cuenta con correo electronico existente', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userTest.email,
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Registrar cuenta con numero de telefono existente', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userTest.email,
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Registrar cuenta con un dato del cuerpo requerido faltante', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Registrar cuenta con correo sin el formato correcto', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: "nuevoemail.com",
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Registrar cuenta con contraseña sin el formato correcto', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userTest.email,
                fullName: userTest.fullName,
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password:'Contraseña',
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Registrar cuenta con campo del cuerpo vacio', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: '',
                fullName: '',
                birthDate: userTest.birthDate,
                phoneNumber: userTest.phoneNumber,
                password: userTest.password,
                roles: userTest.roles
            })

        expect(res.statusCode).toEqual(400)
    })

    
    it('Registrar cuenta con rol inexistente', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: 'nuevoemail@gmail.com',
                fullName: 'Nombre de prueba',
                birthDate: '2000-10-10',
                phoneNumber:'9383834923',
                password: 'P@ssW0RD#2024',
                roles: ['Admin']
            })

        expect(res.statusCode).toEqual(400)
    })
    
    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
    })
})
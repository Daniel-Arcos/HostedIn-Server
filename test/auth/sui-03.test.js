const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('Autenticacion con datos incorrectos', () => {
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

    it('Autenticacion de usuario con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: userTest.email,
                password: 'contrasenaIncorrecta'
            })

        expect(res.statusCode).toEqual(401)
    })

    it('Autenticacion de usuario no registrado', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: 'correoinexistente@gmail.com',
                password: 'contrasena'
            })

        expect(res.statusCode).toEqual(401)
    })

    it('Autenticacion con campo correo electronico faltante', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                password: 'contrasena'
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Autenticacion con campo correo contraseña faltante', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: userTest.email,
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Autenticacion con correo electronico vacio', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: '',
                password: 'contrasena'
            })

        expect(res.statusCode).toEqual(400)
    })

    it('Autenticacion con contraseña vacio', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: userTest.email,
                password: ''
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
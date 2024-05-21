const request = require('supertest')
const app = require('../src/index')
const moongose = require('mongoose')

describe('Auth API Endpoints', () => {
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

    // afterAll((done) => {
    //     app.close(done)
    //     moongose.disconnect();
    // })

    it('Signup with a new user succesfully', async () => {
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

    it('Signin with a new user user succesfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signin')
            .send({
                email: userTest.email,
                password: userTest.password
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.user.email).toEqual(userTest.email)
        expect(res.body.user.fullName).toEqual(userTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
        let tokenBearer = res.headers.authorization
        token = tokenBearer.replace("Bearer ", "")
    })


    it('Get a user by id succesfully', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.user.email).toEqual(userTest.email)
        expect(res.body.user.fullName).toEqual(userTest.fullName)
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
    })


    it('Update a user succesfully', async () => {
        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'userupdated@email.com',
                fullName: 'user name updated',
                birthDate: '2004-03-12',
                phoneNumber: '0098765432',
                password: 'P4SSwooR123#',
                roles: ['Guest']
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.user.email).toEqual('userupdated@email.com')
        expect(res.body.user.fullName).toEqual('user name updated')
        expect(res.body.user.roles).toEqual(expect.arrayContaining(['Guest']))
        userTest._id = res.body.user._id
    })

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
        expect(res.userId).toEqual(test._id)
    })
})
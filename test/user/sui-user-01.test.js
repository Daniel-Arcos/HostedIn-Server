const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('User API Endpoints', () => {
    let userTest = {
        _id: '',
        email: 'usertest00@gmail.com',
        fullName: 'User Test Jhon Doe',
        birthDate: '2000-10-10T00:00:00.000Z',
        phoneNumber: '2288445533',
        password: 'SecurePassword123#',
        roles: ['Guest', 'Host']
    }

    let token;

    afterAll (async () => {
        app.close()
        moongose.disconnect();
    })

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

    it('Get a user by id succesfully', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.user._id).toEqual(userTest._id)
        expect(res.body.user.email).toEqual(userTest.email)
        expect(res.body.user.fullName).toEqual(userTest.fullName)
        expect(res.body.user.birthDate).toEqual(userTest.birthDate)
        expect(res.body.user.phoneNumber).toEqual(userTest.phoneNumber)
        expect(res.body.user.occupation).toEqual("")
        expect(res.body.user.residence).toEqual("")
    })

    it('Update a user succesfully', async () => {
        const res = await request(app)
            .put(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'usertest00@gmail.com',
                fullName: 'user Test Name Updated',
                birthDate: '1995-03-12T00:00:00.000Z',
                phoneNumber: '5211445522',
                password: 'n3w#SecurePassword',
                occupation: 'Software Engineer User test',
                residence: 'Xalapa, Veracruz, Mexico',
                roles: ['Guest', 'Host']
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.user._id).toEqual(userTest._id)
        expect(res.body.user.email).toEqual('usertest00@gmail.com')
        expect(res.body.user.fullName).toEqual('user Test Name Updated')
        expect(res.body.user.birthDate).toEqual('1995-03-12T00:00:00.000Z')
        expect(res.body.user.phoneNumber).toEqual('5211445522')
        expect(res.body.user.occupation).toEqual('Software Engineer User test')
        expect(res.body.user.residence).toEqual('Xalapa, Veracruz, Mexico')
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userTest.roles))
    })    

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
    })
})
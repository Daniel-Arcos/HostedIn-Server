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

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
    })

    it('Attempt to delete a user with an invalid ID', async () => {
        const invalidId = 'invalidId';
    
        const res = await request(app)
            .delete(`/api/v1/users/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
    
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    })

    it('Attempt to delete with null id', async () => {
        const nullId = null;
    
        const res = await request(app)
            .delete(`/api/v1/users/${nullId}`)
            .set('Authorization', `Bearer ${token}`)
    
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    })
    
    it('Attempt to delete a non-existent user', async () => {
        const nonExistentId = '333fbf555a11f11aabf45181';
    
        const res = await request(app)
            .delete(`/api/v1/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
    
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("Usuario no encontrado");
    })
    
    it('Attempt to delete a user without authentication token', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
    
        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Unauthorized");
    })
    
    it('Attempt to delete a user with incorrect authentication token', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}123`)
    
        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Unauthorized");
    })
})
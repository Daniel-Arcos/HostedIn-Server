const request = require('supertest')
const app = require('../../src/index')
const moongose = require('mongoose')

describe('User API Endpoints GET user By Id', () => {
    let userTest = {
        _id: '',
        email: 'usertestgets@gmail.com',
        fullName: 'User Test Jhon Doe',
        birthDate: '2000-10-22T00:00:00.000Z',
        phoneNumber: '2281425441',
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

    it('Get user by empty id', async () => {
        const res = await request(app)
            .get(`/api/v1/users/`)
            .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
    })

    it('Get a user by invalid id 1', async () => {
        const nonExistentId = '333egd555assz11ayeideea1';

        const res = await request(app)
            .get(`/api/v1/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    });

    it('Get a user by invalid id 2', async () => {
        const invalidUserId = 'invalidUserId';

        const res = await request(app)
            .get(`/api/v1/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    });

    it('Get a user by inexistent id', async () => {
        const nonExistentId = '333fbf555a11f11aabf45181';

        const res = await request(app)
            .get(`/api/v1/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual("Usuario no encontrado");
    });

    it('Get a user with null id', async () => {
        const res = await request(app)
            .get(`/api/v1/users/null`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    });

    it('Get a user without authentication token', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}`);
    
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("Unauthorized");
    });

    it('Get a user with incorrect authentication token', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}123`); 
    
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("Unauthorized");
    });

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
    })
})
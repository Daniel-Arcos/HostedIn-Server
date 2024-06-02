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

    let accommodationTest = {
        _id: '',
        title: "Awesome accommodation test",
        description: "This is a test accommodation",
        rules: "No smoking",
        accommodationType: "house",
        nightPrice: 1500,
        guestsNumber: 4,
        roomsNumber: 2,
        bedsNumber: 3,
        bathroomsNumber: 2,
        accommodationServices: ["internet", "parking", "pool"],
        location: {
            type: 'Point',
            coordinates: [-103.349609, 20.659698],
            latitude: 20.659698,
            longitude: -103.349609,
            address: "123 Playa Street, Beach City test"
        },
        user: userTest
    }

    it('Create accommodation succesfully', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .set('Authorization', `Bearer ${token}`)
            .send(accommodationTest)

        expect(res.statusCode).toEqual(201)
        expect(res.body.accommodation.title).toEqual(accommodationTest.title)
        expect(res.body.accommodation.description).toEqual(accommodationTest.description)
        expect(res.body.accommodation.location.address).toEqual(accommodationTest.location.address)
        expect(res.body.accommodation.nightPrice).toEqual(accommodationTest.nightPrice)
        expect(res.body.accommodation.guestsNumber).toEqual(accommodationTest.guestsNumber)
        expect(res.body.accommodation.roomsNumber).toEqual(accommodationTest.roomsNumber)
        accommodationTest._id = res.body.accommodation._id
    })

    it('Get host accommodations without atLeastOneBooking', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}/accommodations`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Alojamientos recuperados exitosamente");
        expect(res.body.accommodations.length).toEqual(1)
    });

    it('Get host accommodations with atLeastOneBooking', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userTest._id}/accommodations?atLeastOneBooking=true`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Alojamientos recuperados exitosamente");
        expect(res.body.accommodations.length).toEqual(0)
    });

    it('Get host accommodations with inexistent id', async () => {
        const nonExistentId = 'f1';

        const res = await request(app)
            .get(`/api/v1/users/${nonExistentId}/accommodations`)
            .set('Authorization', `Bearer ${token}`);

            console.log(res.body)

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("User ID is not valid");
    });

    it('Get host accommodations with empty id', async () => {
        const nonExistentId = '';

        const res = await request(app)
            .get(`/api/v1/users/${nonExistentId}/accommodations`)
            .set('Authorization', `Bearer ${token}`);

            console.log(res.body)

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("El ID proporcionado no es válido.");
    });

    it('Get host accommodations with null id', async () => {
        const nonExistentId = null;

        const res = await request(app)
            .get(`/api/v1/users/${nonExistentId}/accommodations`)
            .set('Authorization', `Bearer ${token}`);

            console.log(res.body)

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("User ID is not valid");
    });

    it('Delete a user succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.userId).toEqual(userTest._id)
    })

    it('Delete accommodation succesfully', async () => {
        const res = await request(app)
            .delete(`/api/v1/accommodations/${accommodationTest._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
    })
})
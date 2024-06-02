const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');

describe('Registro y autenticacion con datos correctos', () => {
    let userGeneralTest = {
        _id: '',
        email: 'usertest@gmail.com',
        fullName: 'User Test Number One',
        birthDate: '2000-12-10',
        phoneNumber: '1234567891',
        password: 'P4SSw0RD#123',
        roles: ['Guest', 'Host']
    };
    let userHostTest = {
        _id: '',
        email: 'userhost@gmail.com',
        fullName: 'User Test Number One',
        birthDate: '2000-12-10',
        phoneNumber: '2345678901',
        password: 'P4SSw0RD#123',
        roles: ['Host']
    };
    let userGuestTest = {
        _id: '',
        email: 'userguest@gmail.com',
        fullName: 'User Test Number One',
        birthDate: '2000-12-10',
        phoneNumber: '0987654321',
        password: 'P4SSw0RD#123',
        roles: ['Guest']
    };
    let tokenGeneral;
    let tokenHost;
    let tokenGuest;

    afterAll(async () => {
        app.close();
        await mongoose.disconnect();
    });

    it('Registrar usuario general', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userGeneralTest.email,
                fullName: userGeneralTest.fullName,
                birthDate: userGeneralTest.birthDate,
                phoneNumber: userGeneralTest.phoneNumber,
                password: userGeneralTest.password,
                roles: userGeneralTest.roles
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user.email).toEqual(userGeneralTest.email);
        expect(res.body.user.fullName).toEqual(userGeneralTest.fullName);
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userGeneralTest.roles));
        userGeneralTest._id = res.body.user._id;
        let tokenBearer = res.headers.authorization;
        tokenGeneral = tokenBearer.replace("Bearer ", "");
    });

    it('Registrar usuario host', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userHostTest.email,
                fullName: userHostTest.fullName,
                birthDate: userHostTest.birthDate,
                phoneNumber: userHostTest.phoneNumber,
                password: userHostTest.password,
                roles: userHostTest.roles
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user.email).toEqual(userHostTest.email);
        expect(res.body.user.fullName).toEqual(userHostTest.fullName);
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userHostTest.roles));
        userHostTest._id = res.body.user._id;
        let tokenBearer = res.headers.authorization;
        tokenHost = tokenBearer.replace("Bearer ", "");
    });

    it('Registrar usuario guest', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: userGuestTest.email,
                fullName: userGuestTest.fullName,
                birthDate: userGuestTest.birthDate,
                phoneNumber: userGuestTest.phoneNumber,
                password: userGuestTest.password,
                roles: userGuestTest.roles
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user.email).toEqual(userGuestTest.email);
        expect(res.body.user.fullName).toEqual(userGuestTest.fullName);
        expect(res.body.user.roles).toEqual(expect.arrayContaining(userGuestTest.roles));
        userGuestTest._id = res.body.user._id;
        let tokenBearer = res.headers.authorization;
        tokenGuest = tokenBearer.replace("Bearer ", "");
    });

    let accommodation = {
        _id: '',
        accommodationServices: ['tv', 'internet'],
        user: userHostTest,
        title: 'Casa de alojamiento de prueba',
        description: 'Hermosa casa de prueba en Hoste-In',
        rules: 'Ninguna',
        accommodationType: 'house',
        nightPrice: 500,
        guestsNumber: 4,
        roomsNumber: 4,
        bedsNumber: 3,
        bathroomsNumber: 2,
        location: {
            latitude: 19.540888,
            longitude: -96.926730,
            address: 'Av. Avila camacho SN Xalapa, Veracruz.'
        }
    };

    it('Crear alojamiento correctamente', async () => {
        const res = await request(app)
            .post('/api/v1/accommodations')
            .send(accommodation)
            .set('Authorization', `Bearer ${tokenHost}`);

        expect(res.statusCode).toEqual(201);
        expect(res.body.accommodation.title).toEqual(accommodation.title);
        expect(res.body.accommodation.description).toEqual(accommodation.description);
        accommodation._id = res.body.accommodation._id;
    });

    it('Obtener todos los alojamientos', async () => {
        const res = await request(app)
            .get('/api/v1/accommodations')
            .set('Authorization', `Bearer ${tokenHost}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.accommodations.length).toBeGreaterThanOrEqual(1);
    });

    it('Obtener todos los alojamientos de un host', async () => {
        const res = await request(app)
            .get(`/api/v1/users/${userHostTest._id}/accommodations`)
            .set('Authorization', `Bearer ${tokenHost}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.accommodations.length).toBeGreaterThanOrEqual(1);
    });

    it('Obtener todos los alojamientos enviando como query id de guestUser', async () => {
        const res = await request(app)
            .get('/api/v1/accommodations')
            .query({ id: userGuestTest._id })
            .set('Authorization', `Bearer ${tokenGuest}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.accommodations.length).toBeGreaterThanOrEqual(1);
    });

    it('Obtener todos los alojamientos enviando como query id de guestUser, lat y long de accommodation creado', async () => {
        const res = await request(app)
            .get('/api/v1/accommodations')
            .query({ id: userGuestTest._id, lat: accommodation.location.latitude, long: accommodation.location.longitude })
            .set('Authorization', `Bearer ${tokenGuest}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.accommodations.length).toBeGreaterThanOrEqual(1);
    });

    it('Obtener los alojamientos de un host inexistente', async () => {
        const res = await request(app)
            .get('/api/v1/users/60b8d6f1e712e833d0d076d3/accommodations')
            .set('Authorization', `Bearer ${tokenHost}`);

        expect(res.statusCode).toEqual(400);
    });

    it('Obtener todos los alojamientos de un host sin enviar id', async () => {
        const res = await request(app)
            .get('/api/v1/users//accommodations')
            .set('Authorization', `Bearer ${tokenHost}`);

        expect(res.statusCode).toEqual(400);
    });

    it('Eliminar un alojamiento correctamente', async () => {
        const res = await request(app)
            .delete(`/api/v1/accommodations/${accommodation._id}`)
            .set('Authorization', `Bearer ${tokenHost}`);
        expect(res.statusCode).toEqual(200);
    });

    // it('Obtener todos los alojamientos cuando no hay', async () => {
    //     const res = await request(app)
    //         .get('/api/v1/accommodations')
    //         .set('Authorization', `Bearer ${tokenHost}`);

    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.accommodations.length).toEqual(0);
    // });

    it('Eliminar usuario general correctamente', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userGeneralTest._id}`)
            .set('Authorization', `Bearer ${tokenGeneral}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userId).toEqual(userGeneralTest._id);
    });

    it('Eliminar usuario guest correctamente', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userGuestTest._id}`)
            .set('Authorization', `Bearer ${tokenGuest}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userId).toEqual(userGuestTest._id);
    });

    it('Eliminar usuario host correctamente', async () => {
        const res = await request(app)
            .delete(`/api/v1/users/${userHostTest._id}`)
            .set('Authorization', `Bearer ${tokenHost}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userId).toEqual(userHostTest._id);
    });
});

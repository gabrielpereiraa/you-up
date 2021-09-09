const request = require('supertest');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { User, userValidate } = require('../../../src/models/User');

let server;
let userId;
let token = '';
let tokenType = '';
let user;

describe('middleware auth', () => {

    beforeEach(async () => {
        server = require('../../../src/server');

        user = new User({
            name: 'Jorgin',
            email: 'jorgin@hotmail.com',
            password: 'abcd1234'
        });

        let { value, type } = user.generateJWT();
        token = value;
        tokenType = type;
        await user.save();
        userId = user._id;
    });

    afterEach(async () => {
        server.close();
        userId = '';
        await User.deleteMany();
    });

    const exec = () => {
        return request(server)
            .get(`/users/${userId}`)
            .set('authorization', `${tokenType} ${token}`);
    };

    it('should return 401 if token is not sended', async() => {
        token = '';
        tokenType = '';
        const res = await exec();

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Token not sent.');
    });

    it('should return 401 if token type is not valid', async() => {
        tokenType = 'Basic';
        const res = await exec();

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid token type.');
    });

    it('should return 401 if token is not valid', async() => {
        token = '12345';
        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid token.');
    });

    it('should return 401 if token is expired', async() => {
        token = jwt.sign({
            expiresIn: moment().add('-1', 'hours').unix(),
        }, config.get('jwtPrivateKey'));

        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Expired token.');
    });

    it('should return 200 if token is valid and not expired', async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});
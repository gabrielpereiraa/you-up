const request = require('supertest');
const { User } = require('../../../src/models/User');

let server;
let user;
let body;

describe('forgot password route', () => {

    beforeEach(async() => {
        server = require('../../../src/server');

        user = new User({
            name: 'Gabriel da Silva',
            email: 'gabriel@hotmail.com',
            password: 'abcd1234'
        });
        
        await user.save();
    });

    afterEach(async() => { server.close(); await User.deleteMany(); });

    const exec = () => { return request(server).post('/login/forgot-password').send(body); }

    it('should return 401 if email is invalid', async () => {
        body = {
            email: 'gabriel123@hotmail.com'
        }

        const res = await exec();
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found.');
    });

    it('should return 200 if email is valid', async () => {
        body = {
            email: user.email
        }

        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Email sended.');
    });
});
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User } = require('../../../src/models/User');

let server;
let token = '';
let tokenType = '';
let user;

describe('middleware isAdmin', () => {

    beforeEach(() => {
        server = require('../../../src/server');

        user = new User({
            name: 'Gabriel',
            email: 'gabriel@hotmail.com',
            password: 'abcd1234',
            role: 'user'
        });
    });

    afterEach(async () => {
        token = '';
        tokenType = '';
        server.close();
        await User.deleteMany();
    });

    const exec = () => {
        return request(server)
            .get('/users')
            .set('authorization', `${tokenType} ${token}`);
    }

    const getJwtData = () => {
        let { value, type } = user.generateJWT();
        token = value;
        tokenType = type;
        return jwt.decode(token);
    }

    it('it should return 403 if user is not admin',  async () => {
        user.role = 'user';
        await user.save();

        const jwtData = getJwtData();

        const res = await exec();
        
        expect(jwtData).toHaveProperty('role');
        expect(jwtData.role === 'admin').toBeFalsy();
        expect(res.body.message).toBe('User unathorized.');
        expect(res.status).toBe(403);
    });

    it('it should return 200 if user is admin', async() => {
        user.role = 'admin';
        await user.save();

        const jwtData = getJwtData();

        const res = await exec();

        expect(jwtData).toHaveProperty('role');
        expect(jwtData.role === 'admin').toBeTruthy();
        expect(res.status).toBe(200);
        expect(res.body.some(u => u.name === user.name && u.email === user.email)).toBeTruthy();
        expect(res.body.some(u => u.name === user.name && u.email === user.email)).toBeTruthy();
    });
});
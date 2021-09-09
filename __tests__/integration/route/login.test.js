const request = require('supertest');
const { User } = require('../../../src/models/User');

describe('login route', () =>{

    let server;
    let user;
    let data;
    let token;
    let body;

    beforeEach(async () => {
        server = require('../../../src/server');

        data = {
            name: 'Gabriel da Silva',
            email: 'gabriel@hotmail.com',
            password: 'abcde12345' 
        };

        user = new User(data);
        await user.save();
    });

    afterEach(async() => { server.close(); await User.deleteMany(); });

    const exec = () => { return request(server).post(`/login`).send(body); };

    it('should return 401 if email is invalid', async () => {
        body = {
            email: 'gabriel123@hotmail.com',
            password: '123'
        }

        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid email.');
    });

    it('should return 401 if password is invalid', async () => {
        body = {
            email: user.email,
            password: '123'
        };

        const res = await exec();
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid password.');
    });

    it('should return 200 and jwt if authenticate user', async () => {
        body = {
            email: data.email,
            password: data.password
        };

        const res  = await exec();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful.');
        expect(res.body.token).toBeDefined();
        expect(res.body.token.value).toBeDefined();
        expect(res.body.token.type).toBeDefined();
        expect(res.body.token.expiresIn).toBeDefined();
    });
});
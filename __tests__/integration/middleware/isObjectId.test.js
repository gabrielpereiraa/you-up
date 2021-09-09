const request = require('supertest');
const { User } = require('../../../src/models/User');

let user;
let token;
let tokenType;
let userId;
let server;

describe('middleware isObjectId', () => {

    beforeEach(async() => {
        server = require('../../../src/server');

        user = new User({
            name: 'Gabriel da Silva',
            email: 'gabriel@hotmail.com',
            password: 'abcde12345'
        });

        await user.save();

        let { value, type } = user.generateJWT();
        token = value;
        tokenType = type;
        userId = user._id;
    });

    afterEach(async() => {
        server.close();
        await User.deleteMany();
    });

    const exec = () => {
        return request(server)
            .get(`/users/${userId}`)
            .set('authorization', `${tokenType} ${token}`);
    }

    it('return 400 if ID is not a valid objectID', async () =>{
        userId = '123';

        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid objectId.');
    });

    it('return 200 if ID is valid objectID', async () =>{
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', user.name);
        expect(res.body).toHaveProperty('email', user.email);
    });
});
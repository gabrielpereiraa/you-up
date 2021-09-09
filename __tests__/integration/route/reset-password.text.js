const request = require('supertest');
const { User } = require('../../../src/models/User');
const { Token } = require('../../../src/models/Token');

let userId;
let resetToken;
let body;

describe('reset password route', () => {

    beforeEach(async() => {
        server = require('../../../src/server');

        const user = new User({
            name: 'Gabriel da Silva',
            email: 'gabriel-xp288@hotmail.com',
            password: 'abcde12345'
        });
        await user.save();

        token = new Token({type: 'reset-password', userId: user._id});
        await token.save();

        resetToken = token.value;
        userId = user._id;

        body = {
            password: 'newpassword123',
            confirmPassword: 'newpassword123'
        }
    });

    afterEach(async() => {
        server.close();
        await User.deleteMany();
        await Token.deleteMany();
    });

    const exec = () => { return request(server).post(`/users/${userId}/reset-password/${resetToken}`).send(body); }

    it('should return 404 if reset token is not sended', async () => {
        resetToken = "";

        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 404 if user id not sended', async () => {
        userId = "";

        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if password not sended', async () =>{
        body.password = "";
        
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Password required.');
    });

    it('should return 400 if confirm password not sended', async () =>{
        body.confirmPassword = "";

        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Confirm password required.');
    });

    it('should return 403 if the password does not match the confirmation password', async () => {
        body.confirmPassword += "321";

        const res = await exec();
        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Your password and confirmation password do not match.');
    });

    it('should return 400 if the password is not 8 characters long', async () => {
        body = {
            password: 'abcd123',
            confirmPassword: 'abcd123'
        }

        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Password must be at least 8 characters.');
    });

    it('should return 401 if no password reset request found', async () => {
        resetToken = "12345";

        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('No password reset request found.');
    });

    it('should return 200 if password has changed', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Your password has been successfully changed.');
    });
})
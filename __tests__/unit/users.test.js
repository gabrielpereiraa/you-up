const { User } = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let user;
let data;

describe('users router', () => {

    beforeEach(() => {
        data = {
            name: 'Gabriel da Silva Pereira',
            email: 'gabriel@hotmail.com',
            password: 'abcd1234'
        }

        user = new User(data);
    });

    describe('JWT', () => {
        
        it('should generate a valid JWT', () => {
            const { value : token } = user.generateJWT();
            const decoded = jwt.decode(token);

            expect(decoded).toMatchObject({
                name: data.name,
                email: data.email,
            });
        });
        
        it('should get jwt data', () => {
            const jwtData = user.getTokenData();

            expect(jwtData).toMatchObject({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        });
    });

    describe('password', () => {

        it('should hash password', async () => {
            await user.hashPassword();

            expect(data.password === user.password).toBeFalsy();
        });

        it('should return true if is valid password', async () => {
            await user.hashPassword();

            const validPassword = await user.validatePassword(data.password);

            expect(validPassword).toBeTruthy();
        });

        it('should return false if is invalid password', async () => {
            await user.hashPassword();

            const compare = await user.validatePassword('123');

            expect(compare).toBeFalsy();
        });
    });
});
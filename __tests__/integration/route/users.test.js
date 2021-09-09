const request = require('supertest');
const _ = require('lodash');
const { User } = require('../../../src/models/User');
const mongoose = require('mongoose');

let server;
let token = '';
let tokenType = '';
let body;

describe('users route', () => {

    beforeEach(() => { server = require('../../../src/server'); });

    afterEach(async() => { server.close(); await User.deleteMany(); });

    describe('/', () => {

        const generateJWT = () => {
            let { value, type } = new User({
                name: 'Jorgin da Silva',
                email: 'jorgin@hotmail.com',
                password: 'abcd1234',
                role: 'admin'
            }).generateJWT();
    
            token = value;
            tokenType = type;
        }

        describe('GET', () => {

            beforeEach(() => { generateJWT(); });

            it('should return status 200 and all users', async () => {
                const users = [
                    { name: 'Roberto', email: 'roberto@hotmail.com', password: 'abcd1234' },
                    { name: 'Claudio', email: 'claudio@hotmail.com', password: 'abcd1234' },
                ];
                await User.collection.insertMany(users);

                const res = await request(server).get('/users').set('authorization', `${tokenType} ${token}`);
                expect(res.status).toBe(200);
                expect(res.body.length).toBe(2);
                expect(res.body.some(user => user.name === users[0].name && user.email === users[0].email)).toBeTruthy();
                expect(res.body.some(user => user.name === users[1].name && user.email === users[1].email)).toBeTruthy();
            });

            it('should return status 200 and empty body if has no user in database', async () => {
                await User.collection.deleteMany();
    
                const res = await request(server).get('/users').set('authorization', `${tokenType} ${token}`);
                expect(res.status).toBe(200);
                expect(res.body.length).toBe(0);
            });
        });

        describe('POST', () => {

            beforeEach(() => {
                body = {
                    name: 'Gabriel da Silvaa',
                    email: 'gabriel@hotmail.com',
                    password: 'abcd1234'
                }
            });

            const exec = () => {
                return request(server)
                    .post('/users')
                    .send(body);
            }

            it('should return status 400 if body is not valid', async () =>{
                body = {
                    name: 'Gab',
                    email: 'g@',
                    password: '123'
                };

                const res = await exec();
                expect(res.status).toBe(400);
                expect(res.body.message).toBe('Bad Request.');
            });

            it('should return status 409 if email already exists', async () =>{
                await User.collection.insertOne(body);

                delete body._id;

                const res = await exec();
                expect(res.status).toBe(409);
                expect(res.body.message).toBe('User already registered.');
            });

            it('should return status 200 and create new user', async () =>{
                const res = await exec();

                expect(res.status).toBe(200);
                expect(res.body.message).toBe('New user created.');
            });
        });
    });

    describe('/:', () => {

        let user;
        let userId;

        beforeEach(async () => {
            user = new User({
                name: 'Gabriel da Silva',
                email: 'gabriel@hotmail.com',
                password: 'abcd1234',
                role: 'admin'
            });

            await user.save();
            userId = user._id;

            let { value } = user.generateJWT();
            token = value;
        });

        describe('GET', () => {

            const exec = () => {
                return request(server)
                    .get(`/users/${userId}`)
                    .set('authorization', `${tokenType} ${token}`);
            }

            it('should return status 404 if user not exist', async () => {
                userId = mongoose.Types.ObjectId();

                const res = await exec(); 
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('User not found.');
            });

            it('should return status 200 if user exist', async () => {
                const res = await exec();
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('name', user.name);
                expect(res.body).toHaveProperty('email', user.email);
            });
        });

        describe('PUT', () => {

            beforeEach(() => {
                body = {
                    name: 'Gabriel Pereira',
                    email: 'gabrielpereira@hotmail.com',
                }
            });

            const exec = () => {
                return request(server)
                    .put(`/users/${userId}`)
                    .set('authorization', `${tokenType} ${token}`)
                    .send(body);
            }

            it('should return status 404 if user not found', async () => {
                userId = mongoose.Types.ObjectId();

                const res = await exec();
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('User not found.');
            });

            it('should return status 400 if body is not valid', async () => {
                body = {
                    name: '',
                    email: '',
                }

                const res = await exec();
                expect(res.status).toBe(400);
                expect(res.body.message).toBe('Bad Request.');
            });

            it('should return status 200 if user is updated', async () => {
                const res = await exec();
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('User updated.');
                expect(res.body.user.name).toBe(body.name);
                expect(res.body.user.email).toBe(body.email);
            });
        });

        describe('DELETE', () => {

            let deleteUser;
            let deleteIdUser;

            beforeEach(async () => {
                deleteUser = new User({
                    name: 'Roberto da Silva',
                    email: 'roberto@hotmail.com',
                    password: 'abcd1234',
                    role: 'user'
                });
                await deleteUser.save();
                deleteIdUser = deleteUser._id;
            });

            const exec = () => {
                return request(server)
                    .delete(`/users/${deleteIdUser}`)
                    .set('authorization', `${tokenType} ${token}`);
            }

            it('should return 404 if user not found', async () => {
                deleteIdUser = mongoose.Types.ObjectId();

                const res = await exec();
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('User not found.');
            });

            it('should return 200 if user is deleted', async () => {
                const res = await exec();
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('User deleted.');
            });
        });
    });
});
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type:       String,
        required:   true,
        minlength:  5,
        maxlength:  100
    },
    email: {
        type:       String,
        required:   true,
        index:      { unique: true },
        minlength:  5,
        maxlength:  200
    },
    password: {
        type:       String,
        required:   true,
        minlength:  8,
        maxlength:  50,
        select:     true
    },
    role: {
        type:       String,
        enum :      ['user', 'admin'],
        default:    'user'
    },
    createdAt: {
        type:       Date,
        default:    moment().format()
    }
}, { versionKey: false });

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    await this.hashPassword();
});

userSchema.method({

    async hashPassword(){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    },

    async validatePassword(candidatePassword){
        return bcrypt.compare(candidatePassword, this.password);
    },

    generateJWT(){
        expiresIn = moment().add(1, 'hours').unix();

        var token = jwt.sign({
            id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
            expiresIn: expiresIn,
        }, config.get('jwtPrivateKey'));
    
        return { type: 'Bearer', value: token, expiresIn: expiresIn }
    },

    getTokenData(){
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role
        }
    }
});

const User = mongoose.model('User', userSchema);

function userValidate(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(200).required(),
        password: Joi.string().min(8).max(50).required(),
    });

    const { error } = schema.validate(user);

    return error ? false : true;
}

module.exports = {
    userSchema,
    User,
    userValidate
}
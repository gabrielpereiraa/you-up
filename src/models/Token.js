const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');

const tokenSchema = new mongoose.Schema({
    userId: {
        type:       mongoose.Types.ObjectId,
        require:    true,
        ref:        'user'
    },
    type: {
        type:       String,
        require:    true
    },
    value: {
        type: String
    },
    createdAt: {
        type:       Date,
        default:    moment().format(),
    },
    expiresIn: {
        type:       Date,
        default:    moment().add('+5', 'minutes').format()
    }
}, { versionKey: false });

tokenSchema.pre('save', async function(next){
    await this.generateToken();
    return next;
});

tokenSchema.method({
    async generateToken(){
        let token = crypto.randomBytes(10).toString("hex");
        this.value = token.toUpperCase();
    },

    validateToken(){
        if(moment().unix() > moment.tz(this.expiresIn, 'America/Sao_Paulo').unix()){
            return false;
        }else{
            return true;
        }
    }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
    tokenSchema : tokenSchema,
    Token : Token
}
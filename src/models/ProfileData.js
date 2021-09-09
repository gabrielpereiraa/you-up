const mongoose = require('mongoose');

const profileDataSchema = new mongoose.Schema({
    userId: {
        type:       mongoose.Types.ObjectId,
        require:    true,
        ref:        'user',
    },
    profileImg: {
        type:       String,
    },
    coverImg: {
        type:       String
    },
    bio: {
        type:       String,
        maxlength:  300, 
    },
    phone: {
        type:       String
    },
    employment: {
        type:       String,
        maxlength:  150,
    },
    country: {
        type:       String,
    },
    state: {
        type:       String,
    },
    city: {
        type:       String,
        maxlength:  200
    },
    birthDate: {
        type:       Date
    }
}, { versionKey: false });

const ProfileData = mongoose.model('ProfileData', profileDataSchema);

function profileDataValidate(){

}

module.exports = {
    profileDataSchema,
    ProfileData
}
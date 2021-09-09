const { User } = require('../../models/User');
const { ProfileData } = require('../../models/ProfileData');

class ProfileDataController {

    async index(req, res){
        const profileData = await ProfileData.findOne({userId: req.params.id});
        return res.status(200).json({profileData: profileData});
    }

    async update(req, res){
        try{
            const profileData = await ProfileData.findOneAndUpdate({userId: req.params.id}, req.body, {new : true});
            return res.status(200).json({message: 'Profile data updated', profileData: profileData});
        } catch(ex){
            console.log(ex);
            return res.status(500).json({message: 'Internal error.'});
        }
    }
}

module.exports = new ProfileDataController();
const { User, userValidate } = require('../../models/User');
const { ProfileData } = require('../../models/ProfileData');
const _ = require('lodash');

class UserController{
    async index(req, res){
        const users = await User.find();
        res.status(200).send(users);
    }

    async store(req, res){
        if(!userValidate(req.body)) return res.status(400).json({message: 'Bad Request.'});
        
        try{
            let user = await User.findOne({email: req.body.email});
            if(user) return res.status(409).json({message: 'User already registered.'})

            user = new User(req.body);
            await user.save();

            await new ProfileData({userId: user._id}).save();

            const jwt = user.generateJWT();

            return res.status(200).json({
                message: 'New user created.',
                user: _.pick(user, ['_id','name', 'email', 'role', 'createdAt']),
                token: jwt
            });
        } catch(ex){
            return res.status(500).json({message: ex.message, err: ex});
        }
    }

    async show(req, res){
        try{
            let user = await User.findById(req.params.id);
            if(!user) return res.status(404).json({message: 'User not found.'});

            return res.status(200).send(user);
        } catch(ex){
            return res.status(500).json({message: ex.message, err: ex});
        }
    }

    async update(req, res){
        try{
            if(!req.body.name && !req.body.email) return res.status(400).json({message: 'Bad Request.'});

            const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true});

            if(!user) return res.status(404).json({message: 'User not found.'});

            return res.status(200).json({message: 'User updated.', user: _.pick(user, ['_id','name', 'email'])});
        } catch(ex){
            return res.status(500).json({message: ex.message, err: ex});
        }
    }

    async delete(req, res){
        try{
            const user = await User.findByIdAndRemove(req.params.id);

            if(!user) return res.status(404).json({message: 'User not found.'});

            return res.status(200).json({message: 'User deleted.'});
        } catch(ex){
            return res.status(500).json({message: ex.message, err: ex});;
        }
    }
}

module.exports = new UserController();
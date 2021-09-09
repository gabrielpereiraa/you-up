const { Token } = require('../../models/Token');
const { User } = require('../../models/User');

class ResetPasswordController {

    async index(req, res){
        try{
            if(!req.params.token) return res.status(400).json({message: 'Invalid token.'});

            if(!req.params.id) return res.status(400).json({message: 'Invalid user.'});

            let user = await User.findById(req.params.id);
            if(!user) return res.status(404).json({message: 'User not found.'});

            if(!req.body.password) return res.status(400).json({message: 'Password required.'});

            if(!req.body.confirmPassword) return res.status(400).json({message: 'Confirm password required.'});

            if(req.body.password != req.body.confirmPassword) return res.status(403).json({message: 'Your password and confirmation password do not match.'});

            if(req.body.password.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters.'})

            const token = await Token.findOne({type: 'reset-password', value: req.params.token, userId: req.params.id});
            if(!token) return res.status(400).json({message: 'No password reset request found.'});

            const exp = token.validateToken();
            if(exp == false) return res.status(400).json({message: 'Password reset request expired.'});

            user.password = req.body.password;
            await user.save();
            await token.deleteOne();

            return res.status(200).json({message: 'Your password has been successfully changed.'});
        } catch(ex){
            console.log(ex);
            return res.status(500).json({message: 'Internal error.'});
        }
    }
}

module.exports = new ResetPasswordController();
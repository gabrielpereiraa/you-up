const { request } = require("express");
const { User } = require("../../models/User");

class LoginController{
    async index(req, res){

        if(!req.body.email || !req.body.password) return res.status(400).json({message: 'Bad request.'});

        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(401).json({message: 'Invalid email.'});

        const validatePassword = await user.validatePassword(req.body.password);
        if(!validatePassword) return res.status(401).json({message: 'Invalid password.'});

        return res.status(200).json({message: 'Login successful.', token: user.generateJWT()});
    }
}

module.exports = new LoginController();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const removeBearer = require('../helpers/removeBearer');

module.exports = function(req, res, next){

    let token = req.headers.authorization;
    if(!token) return res.status(401).json({message: 'Token not sent.'});

    if (!token.startsWith("Bearer ")) return res.status(401).json({message: 'Invalid token type.'});

    const jwtData = jwt.decode(removeBearer(token));
    if(!jwtData) return res.status(401).json({message: 'Invalid token.'});

    if(jwtData.expiresIn < moment().unix()) return res.status(401).json({message: 'Expired token.'});

    return next();
}
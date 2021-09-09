const jwt = require('jsonwebtoken');
const removeBearer = require('../helpers/removeBearer');

module.exports = function(req, res, next) {

    const token = req.headers.authorization;

    const jwtData = jwt.decode(removeBearer(token));

    if(!jwtData.role || jwtData.role === 'user') return res.status(403).json({message: 'User unathorized.'});

    return next();
};
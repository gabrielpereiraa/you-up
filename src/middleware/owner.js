const jwt = require('jsonwebtoken');
const removeBearer = require('../helpers/removeBearer');

module.exports = function(req, res, next){

    let token = req.headers.authorization;
    const jwtData = jwt.decode(removeBearer(token));

    if(req.params.id != jwtData.id) return res.status(404).json({message: 'Not found.'});

    return next();
}
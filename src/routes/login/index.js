const routes = require('express').Router();

/* == Controllers == */
const LoginController = require('../../controllers/login/LoginController');

/* == Routes == */
routes.route('/')
    .post(LoginController.index);

/* == Subrotes == */

// forgot password
routes.use('/forgot-password', require('./forgot-password'));

/* == exports == */
module.exports = routes;





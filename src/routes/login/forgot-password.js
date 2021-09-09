const routes = require('express').Router({mergeParams: true});

/* == Controllers == */
const ForgotPasswordController = require('../../controllers/login/ForgotPasswordController');

/* == Routes == */
routes.route('/')
    .post(ForgotPasswordController.index);

/* == exports == */
module.exports = routes;
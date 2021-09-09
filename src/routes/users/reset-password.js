const routes = require('express').Router({mergeParams: true});

/* == Controllers == */
const ResetPasswordController = require('../../controllers/users/ResetPasswordController');

/* == Routes == */
routes.route('/:token')
    .post(ResetPasswordController.index);

/* == exports == */
module.exports = routes;
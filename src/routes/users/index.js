const routes = require('express').Router();
const UserController = require('../../controllers/users/UserController');

/* == Middlewares == */
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const isObjectId = require('../../middleware/isObjectId');

/* == Routes == */

// not authenticated
routes.route('/')
    .post(UserController.store);

// authenticated and admin
routes.route('/')
    .all(auth, isAdmin)
    .get(UserController.index);

// authenticated
routes.route('/:id')
    .all(auth, isObjectId)
    .get(UserController.show)
    .put(UserController.update);

// authenticated and admin
routes.route('/:id')
    .all(auth, isObjectId, isAdmin)
    .delete(UserController.delete);

/* == Subrotes == */

// reset password
routes.use('/:id/reset-password', require('./reset-password'));

// profile data
routes.use('/:id/profile-data', require('./profile-data'));

/* == exports == */
module.exports = routes;
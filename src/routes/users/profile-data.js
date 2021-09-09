const routes = require('express').Router({mergeParams: true});
/* == Controllers == */
const ProfileDataController = require('../../controllers/users/ProfileDataController');

/* == Middlewares == */
const auth = require('../../middleware/auth');
const isObjectId = require('../../middleware/isObjectId');
const owner = require('../../middleware/owner');

/* == Routes == */
routes.route('/')
    .all(auth, isObjectId, owner)
    .get(ProfileDataController.index)
    .put(ProfileDataController.update);

/* == exports == */
module.exports = routes;
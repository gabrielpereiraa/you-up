const routes = require('express').Router();

/* == Routes == */
routes.get('/', (req, res) => {
    res.send('Rota Home.');
});

/* == Subrotes == */

// users
routes.use('/users', require('./users'));

// login
routes.use('/login', require('./login'));

/* == exports == */
module.exports = routes;
const routes = require('express').Router();

routes.use('/cards', require('./cards'));
routes.use('/users', require('./users'));

routes.all('*', require('./authorize'));

module.exports = routes;

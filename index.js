'use strict'
const app = require('./app');
const server = require('http').Server(app);
const config = require('./config');

server.listen(config.port, () => {
    console.log(`Api rest corrriendo en http://localhost:${config.port}`);
});
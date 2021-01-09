import config from './config';
import database from './database';
import server from './server';

database.connect();

server.listen(config.SERVER.port, () => {
    console.info(`Server started on port ${config.SERVER.port} (${config.SERVER.env})`);
});
const src = server;

module.exports = src;

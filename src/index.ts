import * as http from "http";
import app from './app';
import { onListening, normalizePort, onError } from './utils/utils';
import db from './models';

const server = http.createServer(app);
const port = normalizePort(process.env.PORT || 3000);


db.sequelize.sync()
    .then(() => {
        server.listen(port);
        server.on('error', onError(server));
        server.on('listening', onListening(server));
    });

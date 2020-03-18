import express, {Application} from 'express';
import bodyParser from 'body-parser';
import {DbConnector} from '../db/db-connector';
import {PollingService} from '../polling/polling.service';
import * as http from 'http';
import {SocketsManager} from '../sockets-manager/sockets-manager';

export class Server {
    static app: Application;
    private static port = '9090';

    static async init() {
        this.app = express();
        let server: http.Server = this.listenOnPort(this.app);
        this.defineDefaultRoutes(this.app);
        DbConnector.init();
        SocketsManager.init(server);
        await PollingService.init();
    }

    static listenOnPort(app: Application) {
        return app.listen(this.port, () => {
            console.log(`server started at http://localhost:${Server.port}`);
        });
    }

    static defineDefaultRoutes(app: Application) {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, reality');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.get('/', (req, res) => {
            res.send('<h1>Polling service is Up And Running</h1>');
        });
    }
}

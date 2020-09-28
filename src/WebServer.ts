import compression from 'compression';
import { config as dotenvConfig } from 'dotenv';
import * as express from 'express';
import { createServer } from 'https';
import {
    join as pathJoin
} from 'path';
import { performance } from 'perf_hooks';

import Controller from './Controller';

const MAPS_URL = 'maps';

dotenvConfig();

class WebServer {

    private controller: Controller
    private port : number;
    private credentials: object;

    /**
     * @param {Controller} controller
     * @param {number} port
     * @param {object} credentials
     */
    constructor(controller, port, credentials) {
        this.controller = controller;
        this.credentials = credentials;
        this.port = port;
    }

    start() {
        const app = express();
        let server;
        if (this.credentials) {
            server = createServer(this.credentials, app);
        } else {
            server = app;
        }

        this.initRoutes(app);

        server.listen(this.port);
    }

    /**
     * @param {express.Application} app
     */
    private initRoutes(app) {

        // Logger
        app.use((req, _res, next) => {
            console.log(WebServer.getUrl(req));
            next();
        });

        // CORS
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept');
            next();
        });

        // Compression
        const _compression = compression();

        app.use(`/${MAPS_URL}/`, _compression, express.static(pathJoin(__dirname, '../maps')));

        app.get('/maps-in-bounds/:west,:south,:east,:north', this._mapsInBounds);

        app.get('/', (req, res) => res.send('Indoor maps server'));
    }

    static getUrl = req => req.protocol + '://' + req.get('host') + req.originalUrl;

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    _mapsInBounds = (req, res) => {

        const start = performance.now();

        const {
            west, south, east, north
        } = req.params;
        const bbox = [parseFloat(west), parseFloat(south), parseFloat(east), parseFloat(north)];

        if (bbox.includes(NaN)) {
            res.sendStatus(400);
            return;
        }

        res.json(this.controller.findMapsInBounds(bbox).map(map => ({
            path: req.protocol + '://' + req.get('host') + '/' + pathJoin(MAPS_URL, map.name),
            boundingBox: map.boundingBox
        })));

        console.log(`Response in ${(performance.now() - start).toFixed(2)} ms`);
    }

}

export default WebServer;

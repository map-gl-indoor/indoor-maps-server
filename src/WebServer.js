import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import { join as pathJoin } from 'path';
import { performance } from 'perf_hooks';

import Controller from './Controller.js';
import FileWatcher from './FileWatcher.js';

const MAPS_PATH = '/maps';
const MAPS_IN_BOUNDS_PATH = '/maps-in-bounds';

dotenv.config();

class WebServer {

    /** @type {Controller} */
    controller;

    /** @type {number} */
    port;

    /** @type {object} */
    credentials;

    /**
     * @param {Controller} controller
     * @param {FileWatcher} fileWatcher
     * @param {number} port
     * @param {object} credentials
     */
    constructor(controller, fileWatcher, port, credentials) {
        this.controller = controller;
        this.fileWatcher = fileWatcher;
        this.credentials = credentials;
        this.port = port;
    }

    start() {
        const app = express();
        let server;
        if (this.credentials) {
            server = https.createServer(this.credentials, app);
        } else {
            server = app;
        }

        this._initRoutes(app);

        server.listen(this.port);
    }

    /**
     * @param {express.Application} app
     */
    _initRoutes(app) {

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

        app.use(MAPS_PATH, _compression, express.static(this.fileWatcher.mapsFolder));

        app.get(pathJoin(MAPS_IN_BOUNDS_PATH, ':west,:south,:east,:north'), this._mapsInBounds);

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
            path: pathJoin(MAPS_PATH, map.name),
            boundingBox: map.boundingBox
        })));

        console.log(`Response in ${(performance.now() - start).toFixed(2)} ms`);
    }

}

export default WebServer;

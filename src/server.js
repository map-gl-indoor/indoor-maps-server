#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import WebServer from './WebServer.js';
import FileWatcher from './FileWatcher.js';
import Controller from './Controller.js';

const argv = yargs(hideBin(process.argv))
    .option('folder', {
        alias: 'f',
        description: 'The maps folder',
        demandOption: true,
        type: 'string'
    })
    .option('port', {
        alias: 'p',
        description: 'The server port',
        default: 4001,
        type: 'string'
    })
    .option('https', {
        description: 'Use https',
        type: 'boolean'
    })
    .option('credentials-key', {
        alias: 'k',
        description: 'The credentials key file',
        type: 'string'
    })
    .option('credentials-crt', {
        alias: 'c',
        description: 'The credentials crt file',
        type: 'string'
    })
    .help()
    .alias('help', 'h')
    .argv;

let credentials;

if (argv.https) {
    let keyFile, crtFile;
    if (argv['credentials-key'] && argv['credentials-crt']) {
        crtFile = argv['credentials-crt'];
        keyFile = argv['credentials-key'];
    } else if (process.env.PEM && process.env.KEY) {
        crtFile = process.env.PEM;
        keyFile = process.env.KEY;
    } else {
        throw new Error('cannot find credentials');
    }

    credentials = {
        key: fs.readFileSync(keyFile, 'utf8'),
        cert: fs.readFileSync(crtFile, 'utf8')
    };
}

if (!fs.existsSync(argv.folder)) {
    throw new Error(`{${argv.folder}} folder does not exist`);
}

const controller = new Controller();
const fileWatcher = new FileWatcher(controller, argv.folder);
const webServer = new WebServer(controller, argv.port, credentials);

fileWatcher.start();
webServer.start();

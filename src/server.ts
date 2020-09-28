import { existsSync, readFileSync } from 'fs';
import yargs from 'yargs';

import WebServer from './WebServer';
import FileWatcher from './FileWatcher';
import Controller from './Controller';

const argv = yargs([])
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
        key: readFileSync(keyFile, 'utf8'),
        cert: readFileSync(crtFile, 'utf8')
    };
}

if (!existsSync(argv.folder)) {
    throw new Error(`{${argv.folder}} folder does not exist`);
}

const controller = new Controller(argv.folder);
const fileWatcher = new FileWatcher(controller);
const webServer = new WebServer(controller, argv.port, credentials);

fileWatcher.start();
webServer.start();

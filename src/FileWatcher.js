import chokidar from 'chokidar';
import pathLib from 'path';

import Controller from './Controller.js';

class FileWatcher {

    /** @type {chokidar.FSWatcher} */
    watcher;

    /** @type {Controller} */
    controller;

    /** @type {String} */
    mapsFolder;

    constructor(controller, mapsFolder) {
        this.controller = controller;
        this.mapsFolder = mapsFolder;
    }

    start() {
        return new Promise((resolve, reject) => {

            this.watcher = chokidar.watch(pathLib.join(this.mapsFolder, '/*.geojson'), {
                ignored: /^\./,
                persistent: true
            });
            this.watcher
                .on('add', path => {
                    this.addMap(path);
                })
                .on('change', path => {
                    this.removeMap(path); this.addMap(path);
                })
                .on('unlink', path => {
                    this.removeMap(path);
                })
                .on('error', error => {
                    this.error('Error happened with chokidar', error);
                    reject(error);
                })
                .on('ready', resolve);
        });
    }

    stop() {
        return this.watcher.close();
    }

    addMap(path) {
        const baseName = pathLib.basename(path);
        try {
            this.controller.addMap(path);
            this.log(baseName + ' loaded');
        } catch (e) {
            this.error(baseName + ' did not load. Reason: ' + e.message);
            throw e;
        }
    }

    removeMap(path) {
        const baseName = pathLib.basename(path);
        try {
            this.controller.removeMap(path);
            this.log(baseName + ' unloaded');
        } catch (e) {
            this.error(baseName + ' did not unload. Reason: ' + e.message);
        }
    }

    log(message) {
        console.log('[FileWatcher] ' + message);
    }

    error(message) {
        console.error('[FileWatcher] ' + message);
    }


}

export default FileWatcher;

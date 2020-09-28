import { watch, FSWatcher } from 'chokidar';
import { basename, join } from 'path';

import Controller from './Controller';

class FileWatcher {

    private _controller: Controller;
    private _watcher: FSWatcher;


    constructor(controller: Controller) {
        this._controller = controller;
    }

    async start() {
        return new Promise((resolve, reject) => {

            this._watcher = watch(join(this._controller.mapsFolder, '/*.geojson'), {
                ignored: /^\./,
                persistent: true
            });
            this._watcher
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
                    console.error('Error happened with chokidar', error);
                    reject(error);
                })
                .on('ready', resolve);
        });
    }

    stop() {
        return this._watcher.close();
    }

    addMap(path: string) {
        const baseName = basename(path);
        try {
            this._controller.addMap(path);
            this.log(baseName + ' loaded');
        } catch (e) {
            this.error(baseName + ' did not load. Reason: ' + e.message);
            throw e;
        }
    }

    removeMap(path: string) {
        const baseName = basename(path);
        try {
            this._controller.removeMap(path);
            this.log(baseName + ' unloaded');
        } catch (e) {
            this.error(baseName + ' did not unload. Reason: ' + e.message);
        }
    }

    log(message: string) {
        console.log('[FileWatcher] ' + message);
    }

    error(message: string) {
        console.error('[FileWatcher] ' + message);
    }


}

export default FileWatcher;

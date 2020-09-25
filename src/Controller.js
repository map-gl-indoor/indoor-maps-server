import IndoorMap from './IndoorMap.js';

class Controller {

    /** @type {IndoorMap[]} */
    _maps = [];

    /**
     * @param {string} path
     */
    addMap(path) {
        this._maps.push(IndoorMap.createFromPath(path));
    }

    /**
     * @param {string} fileName
     */
    removeMap(path) {
        this._maps = this._maps.filter(map => map.path !== path);
    }

    /**
     * @param {number[]} bbox
     */
    findMapsInBounds(bbox) {
        return this._maps.filter(map => map.intersectBounds(bbox));
    }
}

export default Controller;

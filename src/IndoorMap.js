import fs from 'fs';
import pathLib from 'path';
import bboxWithDefault from '@turf/bbox';

import { bboxOverlap } from './Utils.js';

// TODO understand why we have to do that
const bboxCalc = bboxWithDefault.default;

class IndoorMap {

    /** @type {string} */
    name;

    /** @type {number[]} */
    boundingBox;

    /** @type {string} */
    path;

    static createFromPath(path) {

        const indoorMap = new IndoorMap();

        indoorMap.path = path;
        indoorMap.name = pathLib.basename(path);

        const geojson = JSON.parse(fs.readFileSync(path, 'utf8'));
        indoorMap.boundingBox = bboxCalc(geojson);

        return indoorMap;
    }

    /**
     * @param {number[]} bbox
     * @returns {boolean}
     */
    intersectBounds(bbox) {
        return bboxOverlap(bbox, this.boundingBox);
    }
}

export default IndoorMap;

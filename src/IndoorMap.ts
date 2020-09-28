import { readFileSync } from 'fs';
import { basename } from 'path';
import bboxCalc from '@turf/bbox';

import { bboxOverlap } from './Utils';

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
        indoorMap.name = basename(path);

        const geojson = JSON.parse(readFileSync(path, 'utf8'));
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

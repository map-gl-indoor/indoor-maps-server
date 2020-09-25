import pathLib from 'path';

/**
 * @param {number[]} bbox1
 * @param {number[]} bbox2
 */
export function bboxOverlap(bbox1, bbox2) {

    // If one rectangle is on left side of other
    if (bbox1[0] > bbox2[2] || bbox2[0] > bbox1[2]) {
        return false;
    }

    // If one rectangle is above other
    if (bbox1[3] < bbox2[1] || bbox2[3] < bbox1[1]) {
        return false;
    }

    return true;
}


export function getFileNameFromPath(path) {
    return pathLib.basename(path, pathLib.extname(path));
}

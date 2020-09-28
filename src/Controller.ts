import IndoorMap from './IndoorMap';

class Controller {

    private _mapsFolder: string;
    private maps: IndoorMap[] = [];

    constructor(mapsFolder: string) {
        this._mapsFolder = mapsFolder;
    }

    get mapsFolder(): string {
        return this._mapsFolder;
    }

    addMap(path: string) {
        this.maps.push(IndoorMap.createFromPath(path));
    }

    removeMap(path: string) {
        this.maps = this.maps.filter(map => map.path !== path);
    }

    findMapsInBounds(bbox: number[]): IndoorMap[] {
        return this.maps.filter(map => map.intersectBounds(bbox));
    }
}

export default Controller;

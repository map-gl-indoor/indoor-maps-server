# Mapbox GL Indoor Plugin

A server that serves geojson indoor maps.

This project is a tool that can be used for the `mapbox-gl-indoor` project, see [this](https://github.com/mapbox-gl-indoor/mapbox-gl-indoor/blob/develop/debug/with-map-server.html). 

__Note:__ This is a work in progress and we welcome contributions.

## Usage

Put your geojson maps in a `maps` folder at the root of the project. Or modify the `docker-compose.yml` to set the maps to another path.

Install and start: `docker-compose up --build`

Then, try: http://localhost:4001/maps-in-bounds/-180,-90,180,90, this should returns all the maps in the bounds [-180,-90,180,90]
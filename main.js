import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import { Protocol } from "https://esm.sh/pmtiles";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
    container: 'mijnkaart', 
    style: "https://tiles.openfreemap.org/styles/liberty", 
    center: [5.659555,51.478541], 
    zoom: 25 // starting zoom
});

map.on('load', () => {
    fetch('assets/wandeling.geojson')
        .then(response => response.json())
        .then(data => {
            map.addSource('wandeling', {
                type: 'geojson',
                data: data
            });

            map.addLayer({
                id: 'wandeling-laag',
                type: 'line',
                source: 'wandeling',
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 4
                }
            });
        });

    fetch('https://api.ndw.nu/api/rest/static-road-data/roadworks')
  .then(r => r.json())
  .then(data => {
    map.addSource('ndw', {
      type: 'geojson',
      data: data
    });

    map.addLayer({
      id: 'ndw-points',
      type: 'circle',
      source: 'ndw',
      paint: {
        'circle-radius': 6,
        'circle-color': '#e63946',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
  });

});


import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import { Protocol } from "https://esm.sh/pmtiles";

// --- PMTiles protocol setup ---
const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// --- Kaart aanmaken ---
const map = new maplibregl.Map({
  container: "mijnkaart",
  style: "https://osm.cyclemap.nl/styles/osm-bright/style.json", 
  center: [5.659555, 51.478541], 
  zoom: 15
});

// --- Laad data zodra kaart klaar is ---
map.on("load", () => {

  // --- 1. Wandeling toevoegen ---
  fetch("assets/wandeling.geojson")
    .then(response => response.json())
    .then(data => {
      map.addSource("wandeling", { type: "geojson", data });
      map.addLayer({
        id: "wandeling-laag",
        type: "line",
        source: "wandeling",
        paint: {
          "line-color": "#FF0000",
          "line-width": 4
        }
      });
    });

  
});

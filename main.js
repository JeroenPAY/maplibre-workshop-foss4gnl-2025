import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import { Protocol } from "https://esm.sh/pmtiles";

// --- PMTiles protocol setup ---
const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// --- Kaart aanmaken ---
const map = new maplibregl.Map({
  container: "mijnkaart",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [5.659555, 51.478541],
  zoom: 15
});

// --- Laad data zodra kaart klaar is ---
map.on("load", () => {
  fetch("assets/Helmond_rijrichting.geojson")
    .then(response => response.json())
    .then(data => {
      map.addSource("helmond", { type: "geojson", data });

      map.addLayer({
        id: "helmond-laag",
        type: "line",
        source: "helmond",
        paint: {
          // Kleur per categorie
          "line-color": [
            "match",
            ["get", "fietsrr"], // veldnaam in je GeoJSON
            "H", "#FF0000",     // rood
            "T", "#00FF00",     // groen
            "B", "#0000FF",     // blauw
            "G", "#FFFF00",     // geel
            "O", "#FF00FF",     // magenta
            "#AAAAAA"           // default (voor null of onbekend)
          ],
          "line-width": 2
        }
      });
    });
});

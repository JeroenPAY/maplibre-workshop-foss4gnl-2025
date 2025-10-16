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

  // --- 2. NDW wegwerkzaamheden ophalen (XML → GeoJSON) ---
  fetch("https://api.ndw.nu/api/rest/static-road-data/roadworks")
    .then(r => r.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(xml => {
      const features = [];
      const situations = xml.getElementsByTagName("situation");

      for (let s = 0; s < situations.length; s++) {
        const situation = situations[s];
        const loc = situation.getElementsByTagName("locationForDisplay")[0];
        if (!loc) continue;

        const lat = parseFloat(loc.getElementsByTagName("latitude")[0]?.textContent);
        const lon = parseFloat(loc.getElementsByTagName("longitude")[0]?.textContent);

        const description = situation.getElementsByTagName("description")[0]?.textContent || "Geen beschrijving";
        const id = situation.getAttribute("id") || `ndw-${s}`;

        if (!isNaN(lat) && !isNaN(lon)) {
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat]
            },
            properties: {
              id,
              description
            }
          });
        }
      }

      const geojson = { type: "FeatureCollection", features };

      // --- NDW bron en laag toevoegen ---
      map.addSource("ndw", { type: "geojson", data: geojson });
      map.addLayer({
        id: "ndw-points",
        type: "circle",
        source: "ndw",
        paint: {
          "circle-radius": 6,
          "circle-color": "#e63946",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });

      // --- Popups bij klik ---
      map.on("click", "ndw-points", (e) => {
        const props = e.features[0].properties;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <h3>Wegwerkzaamheden</h3>
            <p>${props.description}</p>
          `)
          .addTo(map);
      });

      // Cursor veranderen bij hover
      map.on("mouseenter", "ndw-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "ndw-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });
});

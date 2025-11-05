// main.js
import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import proj4 from "https://cdn.skypack.dev/proj4";

// --- Projectiedefinities (RD naar WGS84) ---
const rd = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

// --- Kaart aanmaken ---
const map = new maplibregl.Map({
  container: "mijnkaart", // HTML-element ID
  style: "https://tiles.openfreemap.org/styles/liberty", // OpenFreemap stijl
  center: [5.659555, 51.478541], // Helmond
  zoom: 13
});

// --- Data laden en omzetten zodra kaart klaar is ---
map.on("load", () => {
  fetch("assets/28992_Helmond_rr.geojson")
    .then(response => response.json())
    .then(data => {
      // Zet RD-coördinaten om naar WGS84
      data.features.forEach(feature => {
        if (feature.geometry.type === "MultiLineString") {
          feature.geometry.coordinates = feature.geometry.coordinates.map(line =>
            line.map(coord => proj4(rd, wgs84, coord))
          );
        } else if (feature.geometry.type === "LineString") {
          feature.geometry.coordinates = feature.geometry.coordinates.map(coord =>
            proj4(rd, wgs84, coord)
          );
        }
      });

      // GeoJSON toevoegen als bron
      map.addSource("helmond", {
        type: "geojson",
        data: data
      });

      // Lijnlaag toevoegen met kleur per "fietsrr"
      map.addLayer({
        id: "helmond-laag",
        type: "line",
        source: "helmond",
        paint: {
          "line-color": [
            "match",
            ["get", "fietsrr"],
            "H", "#00FF00",   // Groen
            "T", "#00FF00",   // Groen
            "B", "#00FF00",   // Blauw
            "G", "#FF0000",   // Rood
            "O", "#FFA600",   // Oranje
            "#FF9900"         // Default
          ],
          "line-width": 3
        }
      });

      // Zoom automatisch naar de data
      const bounds = new maplibregl.LngLatBounds();
      data.features.forEach(f => {
        f.geometry.coordinates.flat().forEach(coord => bounds.extend(coord));
      });
      map.fitBounds(bounds, { padding: 50 });
    })
    .catch(err => console.error("Fout bij laden GeoJSON:", err));
});

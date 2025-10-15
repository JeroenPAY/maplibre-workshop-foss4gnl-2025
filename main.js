import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import { Protocol } from "https://esm.sh/pmtiles";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
    container: 'mijnkaart', 
    style: "https://tiles.openfreemap.org/styles/liberty", 
    center: [5.659555,51.478541], 
    zoom: 17 // starting zoom
});

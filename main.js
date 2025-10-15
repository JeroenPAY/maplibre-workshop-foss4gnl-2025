import * as maplibregl from "https://cdn.skypack.dev/maplibre-gl";
import { Protocol } from "https://esm.sh/pmtiles";

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
    container: 'mijnkaart', // container id
    style: './assets/style.json', // style URL
    center: [5.659555,51.478541], // starting position [lng, lat]
    zoom: 17 // starting zoom
});

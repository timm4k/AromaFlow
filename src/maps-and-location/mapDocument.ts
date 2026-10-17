import { mapConfig } from "./mapConfig";

export const mapDocument = `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://unpkg.com; style-src 'unsafe-inline' https://unpkg.com; img-src data: https://a.tile.opentopomap.org;">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous">
<style>
html,body,#map{height:100%;margin:0}body{font-family:system-ui,sans-serif}
.scent-marker{font-size:28px;line-height:36px;text-align:center;background:none;border:none}
.scent-popup{max-width:220px;display:grid;gap:8px;color:var(--text)}
.scent-popup button{border:0;border-radius:8px;padding:10px;background:var(--accent);color:var(--text);font:inherit}
.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:var(--surface)}
.leaflet-control-attribution{font-size:9px!important;max-width:240px}
</style>
<script>
const config=${JSON.stringify(mapConfig)};
const send=(message)=>window.ReactNativeWebView.postMessage(JSON.stringify(message));
window.failMap=()=>send({type:'error'});
</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous" onerror="failMap()"></script>
</head><body><div id="map"></div><script>
if(window.L){
const map=L.map('map',{zoomControl:false}).setView([config.defaultCoordinate.latitude,config.defaultCoordinate.longitude],config.initialZoom);
L.control.zoom({position:'bottomleft'}).addTo(map);
map.attributionControl.setPrefix(false);
const tiles=L.tileLayer(config.tileUrl,{maxZoom:config.maximumZoom,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · SRTM · <a href="https://opentopomap.org/about">OpenTopoMap</a> (CC BY-SA)'}).addTo(map);
let tileFailed=false;
tiles.on('loading',()=>{tileFailed=false});
tiles.on('tileerror',()=>{tileFailed=true;send({type:'error'})});
tiles.on('load',()=>{if(!tileFailed)send({type:'tilesLoaded'})});
const markers=L.layerGroup().addTo(map);
let userMarker;
const position=(coordinate)=>[coordinate.latitude,coordinate.longitude];
function popup(item){
 const element=document.createElement('div');element.className='scent-popup';
 const title=document.createElement('strong');title.textContent=item.title;element.appendChild(title);
 const description=document.createElement('span');description.textContent=item.description;element.appendChild(description);
 const action=document.createElement('button');action.textContent=item.kind==='origin'?item.sourceName:'Edit or delete';
 action.addEventListener('click',()=>send({type:item.kind==='origin'?'source':'edit',id:item.id}));element.appendChild(action);
 L.DomEvent.disableClickPropagation(element);return element;
}
window.AromaMap={receive(message){
 if(message.type==='update'){
  const data=message.data;
  document.documentElement.style.setProperty('--text',data.theme.text);
  document.documentElement.style.setProperty('--surface',data.theme.card);
  document.documentElement.style.setProperty('--accent',data.theme.accentLight);
  markers.clearLayers();
  data.places.forEach((item)=>{
   const icon=document.createElement('span');icon.textContent=item.icon;
   L.marker(position(item.coordinate),{icon:L.divIcon({html:icon,className:'scent-marker',iconSize:[36,36],iconAnchor:[18,32]}),title:item.title,bubblingMouseEvents:false})
    .bindPopup(popup(item)).addTo(markers);
  });
  if(userMarker){map.removeLayer(userMarker);userMarker=null}
  if(data.coordinate)userMarker=L.circleMarker(position(data.coordinate),{radius:8,color:data.theme.accent,fillOpacity:1}).addTo(map).bindTooltip('You are here');
 }
 if(message.type==='center')map.flyTo(position(message.coordinate),config.focusZoom,{duration:config.animationDuration/1000});
 if(message.type==='fit'&&message.coordinates.length)map.fitBounds(message.coordinates.map(position),{padding:config.padding,animate:true});
}};
map.on('click',(event)=>send({type:'press',coordinate:{latitude:event.latlng.lat,longitude:event.latlng.lng}}));
map.whenReady(()=>{map.invalidateSize();send({type:'ready'})});
}
</script></body></html>`;

mapboxgl.accessToken = 'pk.eyJ1IjoiYXl1c2hqb3NoaTEzODAiLCJhIjoiY2xhajN2bjV0MDhuYTNzbGZ4eXY3aWV0YyJ9.-t8ccvCJhwwHcOdi435HrQ'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [-103.2502, 29.2498], // starting position [lng, lat]
zoom: 9, // starting zoom
//pitch: 85,
//bearing: 80, 
projection: 'globe', 
});


map.on('load', () => {
    map.addSource('trails', {
        type: 'geojson',
        data: 'Big_Bend_Trails.geojson' 
    });

    map.addLayer({
      'id': 'trails-layer',
      'type': 'line',
      'source': 'trails',
      'paint': {
          'line-width': 3,
          'line-color': ['match', ['get', 'TRLCLASS'],
              'Class 1: Minimally Developed', 'red',
              'Class 2: Moderately Developed', 'orange',
              'Class 3: Developed', 'yellow',
              /*else,*/ 'blue'
          ]
      }
    });
    map.addSource('bounds', {
        type: 'geojson',
        data: 'BigBendBounds.geojson'
    });

    map.addLayer({
      'id': 'boundary-layer',
      'type': 'line',
      'source': 'bounds',
      'paint': {
          'line-width': 4,
          'line-color': 'black',
          'line-opacity': .6
      }
    });

});

map.on('load', function () {
    map.addSource('mapbox-dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
        'tileSize': 512,
        'maxzoom': 14
    });
     map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.0});
     map.setFog({
        'range': [1, 2],
        'horizon-blend': 0.3,
        'color': 'white',
        'high-color': '#add8e6',
        'space-color': '#d8f2ff',
        'star-intensity': 0.0
    });
     
 });
 const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(navControl, 'top-right');

map.on('click', 'trails-layer', (e) => {
    const coordinates = e.lngLat;
        let feature = e.features[0].properties
        const description = "<b>Trail name: </b>" + feature.TRLNAME + "<br><b>Trail class: </b>" + feature.TRLCLASS + "<br><b>Trail length: </b>" + feature.Miles.toFixed(2)  + " miles";
        
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map)
})

map.on('mouseenter', 'trails-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'trails-layer', () => {
    map.getCanvas().style.cursor = '';
})
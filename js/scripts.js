const mapOptions = {
  zoomControl: false,
  zoom: 13.5,
  center: [40.818, -73.915],
  // maxBounds: [[40.64417, -73.93005], [40.70014, -73.84718]]
}

var map = L.map('my-map', mapOptions);

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 17,
}).addTo(map);

// Add zoom-control
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

//Add Community district boundaries
var CDsGeojson = L.geoJSON(CDs, {
  style: function(feature) {
    return {
      dashArray: '3 6',
      color: '#595959',
      fillColor: 'white',
      fillOpacity: 0.5,
      weight: 1.5,
    }
  }
}).addTo(map);

//Add data - vacant land
var landGeojson = L.geoJSON(land, {
  style: vacantLandStyles,
  onEachFeature: propertyActionsVacant
})

//Add data - gardens
var gardensGeojson = L.geoJSON(gardens, {
  style: vacantGardenStyles,
  onEachFeature: propertyActionsGarden
})

//Add data - vacant land air rights
var landFar = L.geoJSON(land, {
  style: landFarStyles,
  onEachFeature: propertyActionsVacantFar
})

//Add data - gardens air rights
var gardenFar = L.geoJSON(gardens, {
  style: gardenFarStyles,
  onEachFeature: propertyActionsGardenFar
})

var defaultCenter = [40.818, -73.92];
var defaultZoom = 13.5;

//Buttons
$('.zoomOut').click(function() {
  map.flyTo(defaultCenter, defaultZoom)
});

$('.resetPano').click(function() {
  $('#pano').empty();
});

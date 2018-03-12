var defaultCenter = [40.818,-73.92];
var defaultZoom = 13.5;

var map = L.map('my-map').setView(defaultCenter, defaultZoom);

var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 17,
}).addTo(map);

//Add Community district boundaries
var CDsGeojson = L.geoJSON(CDs,{
  style: function(feature) {
        return {
          dashArray: '3 6',
          color: '#595959',
          fillColor: 'white',
          fillOpacity: 0.25,
          weight: 1.5,}
    }}).addTo(map);

// Passed to onEachFeature: on click display info on side pane
const ClickHandler = (e) => {
  const layer = e.target;
  // Handle polygon styles
  // const previousLayer = selected;
  // selectedLayer = layer;
  // if (previousLayer) enyBBLs.resetStyle(previousLayer);
  // selectedLayer.setStyle(highlightStyle);
  // Update Side Pane for clicked lot
  expandSidePane();
	// Get panorama
	var centerFeature = turf.centerOfMass(e);
	var center = centerFeature.geometry.coordinates;
	var panoramaOptions = {
		position: {
			lat: center[1],
			lng: center[0],
		}
	};
	setTimeout(function() {
		new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions)
	}, 200)

  const property = layer.feature.properties;
  // get lot info
  getlotInfo(property.bbl).then((lotInfo) => {
    populatePane(property, lotInfo);
  });
};

// Function passed to L.geoJSON's 'style' option - vacant land
const vacantLandStyles = (feature) => {
  return {
    color: '#595959',
    fillColor: '#e80000',
    fillOpacity: 0.9,
    weight: 1,};
	};

// Function passed to L.geoJSON's 'style' option - gardens
const vacantGardenStyles = (feature) => {
	return {
		color: '#595959',
		fillColor: '#157a03',
		fillOpacity: 0.8,
		weight: 1,};
	};

const propertyActions = (feature, layer) => {
	var centerFeature = turf.centerOfMass(feature);
  layer.on({
    'click': ClickHandler,
    // 'mouseover': highlightFeature,
    // 'mouseout': resetHighlight
	  });
	};

//Add data on vacant land
var landGeojson = L.geoJSON(land, {
	style: vacantLandStyles,
	onEachFeature: propertyActions
	}).addTo(map);

	// <b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >${feature.properties.Name}</b> <br/>
	// 								${feature.properties.Garden_dev} Community Garden at ${feature.properties.Address}.<br/>

//Add data on gardens
var landGeojson = L.geoJSON(gardens, {
	style: vacantLandStyles,
	onEachFeature: propertyActions
	}).addTo(map);


	$('.zoomOut').click(function() {
  map.flyTo(defaultCenter, defaultZoom)
});

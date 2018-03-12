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

		// To DO: polygon styles
		//

//Property title vacant land
const getVacantTitle = (property) => {
	$('#lot-address').append(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
					at ${property.Address}.<br/>`);
}

const getGardenTitle = (property) => {
	$('#lot-address').append(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >${property.Name}</b> <br/>
												${property.Garden_dev} Community Garden at ${property.Address}.<br/>`);
}
//Lot info for all lots (vacant and gardens)
const getLotInfo = (property) => {
	$('#lot-info').append(`
			<b style='font-size: 120%'> Owner:</b> ${property.OwnerName}.<br/>
			<b style='font-size: 120%'> Area:</b> ${numeral(property.LotArea).format('0,0')} sqft.<br/>
			<b style='font-size: 120%'> Zoning:</b> ${property.ZoneDist1}. <b style='margin-left: 5px'> Overlay:</b> ${property.Overlay1}.<br/>
			<b style='font-size: 120%'> FAR:</b>
			<b>Residential: </b> ${property.ResidFAR};
			<b style='margin-left: 5px'>Commercial: </b> ${property.CommFAR};
			<b style='margin-left: 5px'>Facilities: </b> ${property.FacilFAR}.
			<hr>
			<b style='font-size: 120%'> Total Air Rights:</b><br/>
			<b style='margin-left: 20px'>Residential: </b> ${numeral(property.ResidFAR * property.LotArea).format('0,0')} sqft.<br/>
			<b style='margin-left: 20px'>Commercial: </b> ${numeral(property.CommFAR * property.LotArea).format('0,0')} sqft.<br/>
			<b style='margin-left: 20px'>Facilities: </b> ${numeral(property.FacilFAR * property.LotArea).format('0,0')} sqft.<br/>
			`);
}

//Get Panorama
// const getPano = (layer) => {
// 	const centerFeature = turf.centerOfMass(layer);
// 	const center = centerFeature.geometry.coordinates;
// 	const panoramaOptions = {
// 		position: {
// 			lat: center[1],
// 			lng: center[0],
// 		}
// 	};
// 	$('#pano').append(
// 	setTimeout(function() {
// 		new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions)
// 	}, 100)
// )}

// Passed to onEachFeature: on click display info on side pane - vacant land
const ClickHandlerVacant = (e) => {
  const layer = e.target;
	const property = layer.feature.properties;
	// Update Side Pane for clicked lot
	expandSidePane();
	// // Fill in Property Info tab
	$('#lot-address').empty();
	getVacantTitle(property)
	// Panorama
	$('#pano').empty();
	// getPano(layer)
	$('#lot-info').empty();
	getLotInfo(property)
};

// Passed to onEachFeature: on click display info on side pane - garden
const ClickHandlerGarden = (e) => {
  const layer = e.target;
	const property = layer.feature.properties;
	// Update Side Pane for clicked lot
	expandSidePane();
	// // Fill in Property Info tab
	$('#lot-address').empty();
	getGardenTitle(property)
	// Panorama
	$('#pano').empty();
	// getPano(layer)
	$('#lot-info').empty();
	getLotInfo(property)
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

const propertyActionsVacant = (feature, layer) => {
  layer.on({
    'click': ClickHandlerVacant,
    // 'mouseover': highlightFeature,
    // 'mouseout': resetHighlight
	  });
	};

const propertyActionsGarden = (feature, layer) => {
  layer.on({
    'click': ClickHandlerGarden,
    // 'mouseover': highlightFeature,
    // 'mouseout': resetHighlight
	  });
	};

//Add data on vacant land
var landGeojson = L.geoJSON(land, {
	style: vacantLandStyles,
	onEachFeature: propertyActionsVacant
	}).addTo(map);

	// <b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >${feature.properties.Name}</b> <br/>
	// 								${feature.properties.Garden_dev} Community Garden at ${feature.properties.Address}.<br/>

//Add data on gardens
var gardensGeojson = L.geoJSON(gardens, {
	style: vacantGardenStyles,
	onEachFeature: propertyActionsGarden
	}).addTo(map);


	$('.zoomOut').click(function() {
  map.flyTo(defaultCenter, defaultZoom)
});

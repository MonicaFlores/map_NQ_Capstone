// Populate Side Pane with lot info.
//Property title vacant land
const getVacantTitle = (property) => {
  $('#lot-address').append(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
					at ${property.Address}.<br/>`);
}

//Property title community gardens
const getGardenTitle = (property) => {
  $('#lot-address').append(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >${property.Name}</b> <br/>
												${property.Garden_dev} Community Garden at ${property.Address}.<br/>`);
}
//Lot info for all lots (vacant and gardens)
const getLotInfo = (property) => {
  $('#lot-info').append(`
      <b style='font-size: 120%'> Owner:</b> ${property.BBL}.<br/>
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
const getPano = (layer) => {
  const centerFeature = turf.centerOfMass(layer.feature);
  const center = centerFeature.geometry.coordinates;
  const panoramaOptions = {
    position: {
      lat: center[1],
      lng: center[0],
    }
  };
  $('#pano').append(
    setTimeout(function() {
      new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions)
    }, 100)
  )
}

// Passed to onEachFeature: on click display info on side pane - vacant land
const ClickHandlerVacant = (e) => {
  const layer = e.target;
  const property = layer.feature.properties;
  //Fill in Property Title
  $('#lot-address').empty();
  getVacantTitle(property)
  // Panorama
  $('#pano').empty();
  getPano(layer)
  //Fill in Property Info
  $('#lot-info').empty();
  getLotInfo(property)
};

// Passed to onEachFeature: on click display info on side pane - garden
const ClickHandlerGarden = (e) => {
  const layer = e.target;
  const property = layer.feature.properties;
  // Fill in Property Info tab
  $('#lot-address').empty();
  getGardenTitle(property)
  // Panorama
  $('#pano').empty();
  getPano(layer)
  $('#lot-info').empty();
  getLotInfo(property)
};

// Function passed to L.geoJSON's 'style' option - vacant land
const vacantLandStyles = (feature) => {
  return {
    color: '#595959',
    fillColor: '#e80000',
    fillOpacity: 0.9,
    weight: 1,
  };
};

// Function passed to L.geoJSON's 'style' option - gardens
const vacantGardenStyles = (feature) => {
  return {
    color: '#595959',
    fillColor: '#157a03',
    fillOpacity: 0.8,
    weight: 1,
  };
};

//Style highlight iten when mouseover
const mouseOverStyle = {
  weight: 0.5,
  color: 'grey',
  fillOpacity: 0.7,
};

//Mouseover action
const mouseOverFeature = (e) => {
  const layer = e.target;
  const property = layer.feature.properties;
  layer.bindPopup(`${property.Address}.`, {
    closeButton: false,
    minWidth: 60,
    offset: [0, -10]
  });
  layer.setStyle(mouseOverStyle);
  layer.openPopup();
  layer.bringToFront();
};

//Mouse out reset style
const mouseOutResetVacant = (e) => {
  const layer = e.target;
  layer.closePopup();
  landGeojson.resetStyle(layer);
};

const mouseOutResetGarden = (e) => {
  const layer = e.target;
  layer.closePopup();
  gardensGeojson.resetStyle(layer);
};

//Actions to pass L.geoJSON
const propertyActionsVacant = (feature, layer) => {
  layer.on({
    'click': ClickHandlerVacant,
    'mouseover': mouseOverFeature,
    'mouseout': mouseOutResetVacant
  });
};

const propertyActionsGarden = (feature, layer) => {
  layer.on({
    'click': ClickHandlerGarden,
    'mouseover': mouseOverFeature,
    'mouseout': mouseOutResetGarden
  });
};

//FAR visualization
// get colors by ammount of Residential Air Rights
function getFarColorGard(d) {
  return d > 20000 ? '#006837' :
    d > 15000 ? '#31a354' :
    d > 10000 ? '#78c679' :
    d > 5000 ? '#c2e699' :
    d > 1 ? '#ffffcc' :
    '#FFF';
}

function getFarColorVac(d) {
  return d > 50000 ? '#b30000' :
    d > 20000 ? '#e34a33' :
    d > 10000 ? '#fc8d59' :
    d > 5000 ? '#fdcc8a' :
    d > 1 ? '#fef0d9' :
    '#FFF';
}

//Style gardens FAR
const gardenFarStyles = (feature) => {
  const airRights = (feature.properties.ResidFAR * feature.properties.LotArea)
  return {
    // fillColor: getFarColorGard(${numeral(feature.properties.ResidFAR * feature.properties.LotArea).format('0,0')}),
    fillColor: getFarColorGard(airRights),
    weight: 1,
    color: '#595959',
    fillOpacity: 0.9,
  };
};

//Style vacant lots FAR
const landFarStyles = (feature) => {
  const airRights = (feature.properties.ResidFAR * feature.properties.LotArea)
  return {
    fillColor: getFarColorVac(airRights),
    weight: 1,
    color: '#595959',
    fillOpacity: 0.9,
  };
};

//Mouse out reset styles
const mouseOutResetVacantFar = (e) => {
  const layer = e.target;
  layer.closePopup();
  landFar.resetStyle(layer);
};

const mouseOutResetGardenFar = (e) => {
  const layer = e.target;
  layer.closePopup();
  gardenFar.resetStyle(layer);
};

const propertyActionsVacantFar = (feature, layer) => {
  layer.on({
    'click': ClickHandlerVacant,
    'mouseover': mouseOverFeature,
    'mouseout': mouseOutResetVacantFar
  });
};

const propertyActionsGardenFar = (feature, layer) => {
  layer.on({
    'click': ClickHandlerGarden,
    'mouseover': mouseOverFeature,
    'mouseout': mouseOutResetGardenFar
  });
};

// Show modal with map info when loading the site
//Copied from fellow classmate's code https://github.com/austensen/eny-violations/blob/master/js/popovers_modals.js
$('#modal').modal('show');

// Initialize Bootstrap popovers
$(function() {
  $('.icon-popover').popover({
    container: 'body',
    html: true
  });
});

// Close popover on clicking elsewhere
$(document).on('click', function(e) {
  $('[data-toggle="popover"],[data-original-title]').each(function() {
    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
      (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false // fix for BS 3.3.6
    }
  });
});

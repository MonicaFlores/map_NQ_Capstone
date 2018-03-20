//Set places contents
var partnersArray = []  // empty array
var educationalArray = []  // empty array
var culturalArray = []  // empty array

getPlaces((places) => {
  places.forEach((place) => {
		const typePalette = {
      NQ_Partners: 'GoldenRod ',
      Educational: 'DarkBlue',
      Cultural: 'Purple',
    };
		const placeColor = typePalette[place.type];
		const type = place.type;
		const circleOptions = {
			color: 'grey',
			weight: 0.5,
			radius: 4,
			fillOpacity: 1,
			fillColor: placeColor,
			width: 0
		}
    const latLon = [place.latitude, place.longitude];
		//const popupcont = ['<h3> ' + place.name  + '</h3>' + place.description]
		if (type == 'NQ_Partners') {
				partnersArray.push(
				    L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name  + '</h3>' + place.description));
		} else if (type == 'Educational') {
			 	educationalArray.push(
						L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name  + '</h3>' + place.description));
		} else  {
				culturalArray.push(
						L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name  + '</h3>' + place.description));
		}
  });

//Create layer with amenities
var partners  = L.layerGroup(partnersArray)
var educational  = L.layerGroup(educationalArray)
var cultural  = L.layerGroup(culturalArray)

var amenitiesLayer = {
		"NQ Partners": partners,
		"Educational Institutions": educational,
		"Cultural Institutions": cultural,
};

//Create layers for main vizualization

var lotsArray = [landGeojson, gardensGeojson]
var lots = L.layerGroup(lotsArray)

// var zoningArray = [landZo, gardenZo]
// var zoning = L.layerGroup(zoningArray)

var farArrayGar = [gardenFar]
var airRightsGar = L.layerGroup(farArrayGar)

var farArrayVac = [landFar]
var airRightsVac = L.layerGroup(farArrayVac)


var mainVizLayer = {
    "Vacant/Garden": lots,
    "Residential Air Rights-Gardens": airRightsGar,
    "Residential Air Rights-Vacant Lots": airRightsVac,
    // "Zoning": zoning,
};

// L.control.layers(null, amenitiesLayer, {collapsed:false, position: 'topright'}).addTo(map);
// });
L.control.layers(mainVizLayer, amenitiesLayer, {collapsed:false, position: 'topright'}).addTo(map);
});


// add event listeners for overlayadd and overlayremove
map.on('baselayerchange', handleLayerToggle);
// map.on('overlayremove', handleLayerToggle);

function handleLayerToggle(eventLayer) {
// get the name of the layergroup, and whether it is being added or removed
var type = eventLayer.type;
var name = eventLayer.name;

// if being added, show the corresponding legend
// else, hide it.
if (eventLayer.type === 'baselayerchange') {
  $('#' + name + '-legend').show();
} else {
  $('#' + name + '-legend').hide();
}
}
// lotsArray gardenFar landFar
//
// lotsArray-legend gardenFar-legend landFar-legend

// map.on('baselayerchange', function(eo) {
// if (eo.name === 'gardenFar') {
//     $('#gardenFar-legend').show;
//     $('#lotsArray-legend').hide;
//     $('#landFar-legend').hide;
// } else {
//     $('#gardenFar-legend').hide;
// }
// });
//
// map.on('baselayerchange', function(eo) {
// if (eo.name === 'landFar') {
//     $('#landFar-legend').show;
//     $('#lotsArray-legend').hide;
//     $('#gardenFar-legend').hide;
// } else {
//     $('#landFar-legend').hide;
// }
// });
//
// map.on('baselayerchange', function(eo) {
// if (eo.name === 'lotsArray') {
//     $('#lotsArray-legend').show;
//     $('#landFar-legend').hide;
//     $('#gardenFar-legend').hide;
// } else {
//     $('#lotsArray-legend').hide;
// }
// });


//Add amenities dataset
function getPlaces(callback) {
  $.ajax({
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQrzyc8AryRyxoI6Hzxc1NoYQiBLoKhhlGLqDuMrKP_BNp8TIXos-SbY39dlPn2f-6BwiU1cK5Dz_a/pub?output=csv",
    type: "GET"
  }).done((csv) => {
    const places = Papa.parse(csv, {header: true}).data;
    callback(places);
  });
}

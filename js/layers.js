//Set places contents
var partnersArray = [] // empty array
var educationalArray = [] // empty array
var culturalArray = [] // empty array

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

    if (type == 'NQ_Partners') {
      partnersArray.push(
        L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name + '</h3>' + place.description));
    } else if (type == 'Educational') {
      educationalArray.push(
        L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name + '</h3>' + place.description));
    } else {
      culturalArray.push(
        L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name + '</h3>' + place.description));
    }
  });

  //Create layer with amenities
  var partners = L.layerGroup(partnersArray)
  var educational = L.layerGroup(educationalArray)
  var cultural = L.layerGroup(culturalArray)

  var amenitiesLayer = {
    "NQ Partners": partners,
    "Educational Institutions": educational,
    "Cultural Institutions": cultural,
  };

  //Create layers for main vizualization
  var lotsArray = [landGeojson, gardensGeojson]
  var lots = L.layerGroup(lotsArray).addTo(map)

  var mainVizLayer = {
    "Vacant/Garden": lots,
    "Residential Air Rights-Vacant Lots": landFar,
    "Residential Air Rights-Gardens": gardenFar,
  };

  //add layers to map
  L.control.layers(mainVizLayer, amenitiesLayer, {
    collapsed: false,
    position: 'topright'
  }).addTo(map);
});

//Add event listeners for baselayerchange
map.on('baselayerchange', handleLayerToggle);

function handleLayerToggle(eventLayer) {
  // get the name of the layergroup, and whether it is being added or removed
  var type = eventLayer.type;
  var name = eventLayer.name;

  var nickname;

  if (name === 'Vacant/Garden') {
    nickname = 'lots';
  } else if (name === 'Residential Air Rights-Vacant Lots') {
    nickname = 'landFar';
  } else {
    nickname = 'gardenFar';
  }
  // if being added, show the corresponding legend. Else, hide it.
  if (eventLayer.type === 'baselayerchange') {
    $("[id$='-legend']").hide()
    $('#' + nickname + '-legend').show();
  } else {
    $('#' + nickname + '-legend').hide();
  }
}

//Add amenities dataset
function getPlaces(callback) {
  $.ajax({
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQrzyc8AryRyxoI6Hzxc1NoYQiBLoKhhlGLqDuMrKP_BNp8TIXos-SbY39dlPn2f-6BwiU1cK5Dz_a/pub?output=csv",
    type: "GET"
  }).done((csv) => {
    const places = Papa.parse(csv, {
      header: true
    }).data;
    callback(places);
  });
}

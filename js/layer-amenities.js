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
//attempt to create sub-layers by amenities-type
			"NQ Partners": partners,
			"Educational Institutions": educational,
			"Cultural Institutions": cultural,
	};

	//L.control.layers({}, amenitiesLayer).addTo(map);
L.control.layers(null, amenitiesLayer, {collapsed:false, position: 'topright'}).addTo(map);
});

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

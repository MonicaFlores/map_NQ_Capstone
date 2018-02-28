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
  var CDsGeojson = L.geoJSON(CDs,
    {
      style: function(feature) {
          return {
            dashArray: '3 6',
            color: '#595959',
            fillColor: 'white',
            fillOpacity: 0.25,
            weight: 1.5,}
      },
    }).addTo(map);

//Add vacant land
	var landGeojson = L.geoJSON(land, {
	  style: function(feature) {
	      return {
	        color: '#595959',
	        fillColor: '#e80000',
	        fillOpacity: 0.9,
	        weight: 1,}
		},
		onEachFeature: function(feature, layer) {
			//Format area
			var areasqft = numeral(feature.properties.LotArea).format('0,0')

	    layer.bindPopup(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
													at ${feature.properties.Address}.<br/>
											<b style='font-size: 120%'> //</b> <br/>
											<b style='font-size: 120%'> Owner:</b> ${feature.properties.OwnerName}.<br/>
	                    <b style='font-size: 120%'> Area:</b> ${areasqft} sqft.<br/>
											<b style='font-size: 120%'> FAR:</b>  ${feature.properties.ResidFAR} residential;
														${feature.properties.CommFAR} commercial;
														${feature.properties.FacilFAR} facilities`, {
	      closeButton: false,
	      minWidth: 60,
	      offset: [0, -10]
	    });
	    layer.on('mouseover', function (e) {
	      this.openPopup();

	      e.target.setStyle({
	        weight: 0.5,
	        color: 'grey',
					fillOpacity: 0.7,
	      });

	      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	          layer.bringToFront();
	      }
	    });
	    layer.on('mouseout', function (e) {
	      this.closePopup();
	      landGeojson.resetStyle(e.target);
	    });
		}
	}).addTo(map);


//Add Gardens
  var gardensGeojson = L.geoJSON(gardens,
    {
      style: function(feature) {
          return {
            color: '#595959',
            fillColor: '#157a03',
            fillOpacity: 0.8,
            weight: 1,
          }
      },
			onEachFeature: function(feature, layer) {
				//Format area
				var areasqft = numeral(feature.properties.LotArea).format('0,0')

				layer.bindPopup(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >${feature.properties.Name}</b> <br/>
												${feature.properties.Garden_dev} Community Garden at ${feature.properties.Address}.<br/>
													<b style='font-size: 120%'> //</b> <br/>
													<b style='font-size: 120%'> Owner:</b> ${feature.properties.OwnerName}.<br/>
			                    <b style='font-size: 120%'> Area:</b> ${areasqft} sqft.<br/>
													<b style='font-size: 120%'> FAR:</b>  ${feature.properties.ResidFAR} residential;
																${feature.properties.CommFAR} commercial;
																${feature.properties.FacilFAR} facilities`, {
					closeButton: false,
					minWidth: 60,
					offset: [0, -10],
				});
				layer.on('mouseover', function (e) {
					this.openPopup();

					e.target.setStyle({
						weight: 0.5,
						color: 'grey',
						fillOpacity: 0.7,
					});

					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
							layer.bringToFront();
					}
				});
				layer.on('mouseout', function (e) {
					this.closePopup();
					gardensGeojson.resetStyle(e.target);
				});
    }
  }).addTo(map);


	$('.zoomOut').click(function() {
  map.flyTo(defaultCenter, defaultZoom)
});

//Set places contents
var partnersArray = []  // empty array
var educationalArray = []  // empty array
var culturalArray = []  // empty array
var heathArray = []  // empty array

getPlaces((places) => {

  places.forEach((place) => {

		const typePalette = {
      NQ_Partners: 'GoldenRod ',
      Educational: 'DarkBlue',
      Cultural: 'DarkSlateGray',
      Health: 'Purple',
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

} else if (type == 'Cultural') {
		culturalArray.push(
				L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name  + '</h3>' + place.description));
} else {
		heathArray.push(
				L.circleMarker(latLon, circleOptions).bindPopup('<h3> ' + place.name  + '</h3>' + place.description));
}

  });

	//Create layer with amenities
	var partners  = L.layerGroup(partnersArray)
	var educational  = L.layerGroup(educationalArray)
	var cultural  = L.layerGroup(culturalArray)
	var health  = L.layerGroup(heathArray)

	var amenitiesLayer = {
//attempt to create sub-layers by amenities-type
			"NQ Partners": partners,
			"Educational Institutions": educational,
			"Cultural Institutions": cultural,
			"Health Institutions": health,
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

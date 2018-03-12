// Side pane collapse control

$('#pane-toggle-button').click(() => {
  $('#pane-container').toggleClass("pane-collapsed");

  const isCollapsed = $('#pane-container').hasClass("pane-collapsed");

  if (isCollapsed) {
    $('#pane-toggle-icon').attr('class', 'ion-chevron-right');
  } else {
    $('#pane-toggle-icon').attr('class', 'ion-chevron-left');
  }
});

// Expand the side pane
const expandSidePane = () => {
  if ($('#pane-container').hasClass("pane-collapsed")) {
    $('#pane-toggle-button').click();
  }
}


// <span id="tab-title-address"></span><br/>
// <span class="prop-info-title" id="title-owner"></span><br/>
// <span class="prop-info-title" id="title-area"></span><br/>
// <span class="prop-info-title" id="title-FAR"></span><br/>
//
// #tab-title-address = `<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
//         at ${feature.properties.Address}.<br/>`
// #tab-title-address = Community Garden at ${feature.properties.Address}.
// #title-owner = `<b style='font-size: 120%'>Owner:</b> ${feature.properties.OwnerName}.`
// #title-area = `<b style='font-size: 120%'> Area:</b> ${areasqft} sqft.<br/>`
// #title-FAR = `<b style='font-size: 120%'> FAR:</b>  ${feature.properties.ResidFAR} residential;
// ${feature.properties.CommFAR} commercial; ${feature.properties.FacilFAR} facilities.<br/>`


// Populate Side Pane with lot info.
const populatePane = (feature, lotInfo) => {
  // Fill in Property Info tab
  $('#lot-address').text(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
          at ${feature.properties.Address}.<br/>`);

  $('#lot-info').text(`<b style='font-size: 15px'; 'font-weight: 150%'; font-family: 'Roboto Mono', sans-serif; >Vacant Lot</b>
          at ${feature.properties.Address}.<br/>
      <b style='font-size: 120%'> //</b> <br/>
      <b style='font-size: 120%'> Owner:</b> ${feature.properties.OwnerName}.<br/>
      <b style='font-size: 120%'> Area:</b> ${numeral(feature.properties.LotArea).format('0,0')} sqft.<br/>
      <b style='font-size: 120%'> FAR:</b>  ${feature.properties.ResidFAR} residential;
            ${feature.properties.CommFAR} commercial;
            ${feature.properties.FacilFAR} facilities.<br/>`);
}

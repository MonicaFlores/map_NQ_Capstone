var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["Residential", "Commercial", "Facilities"],
        datasets: [{
            label: "Gardens",
            backgroundColor: '#157a03',
            borderColor: 'grey',
            data: [648078, 0, 1106132],
        },
        {
            label: "Vacant Lots",
            backgroundColor: '#e80000',
            borderColor: 'grey',
            data: [3088324, 7384736, 4506844],
        }],
    },

    // Configuration options go here
    options: {
      legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: 'grey'
              }
    }
  }
});

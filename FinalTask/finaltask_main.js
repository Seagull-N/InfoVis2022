let input_data;
let rough_bar;
let rough_line;
let detail_bar;
let detail_line;
let filter = [];

d3.csv("https://seagull-n.github.io/InfoVis2022/FinalTask/finaltask_data.csv")
  .then( data => {
    input_data = data;
    input_data.forEach( d => {
      // d.year = +d.year;
      // d.month = +d.month;
      d.earthquake = +d.earthquake;
      d.temperature = +d.temperature;
    });

    rough_bar = new BarChart( {
      parent: '#drawing_region_rough',
      width: 512,
      height: 256,
      margin: {top:10, right:50, bottom:50, left:50},
      x_label: 'month/year',
      y_label: 'Number of earthquakes'
    }, input_data );
    rough_bar.update();

    rough_line = new LineChart( {
      parent: '#drawing_region_rough',
      width: 512,
      height: 256,
      margin: {top:10, right:50, bottom:50, left:50},
      x_label: 'month/year',
      y_label: 'temperature(C)'
    }, input_data );
    rough_line.update();

    detail_bar = new BarChart( {
      parent: '#drawing_region_detail',
      width: 512,
      height: 256,
      margin: {top:10, right:50, bottom:50, left:50},
      x_label: 'month/year',
      y_label: 'Number of earthquakes'
    }, input_data.filter( d => "1" === d.month  ))
    detail_bar.update();

    detail_line = new LineChart( {
      parent: '#drawing_region_detail',
      width: 512,
      height: 256,
      margin: {top:10, right:50, bottom:50, left:50},
      x_label: 'month/year',
      y_label: 'temperature(C)'
    }, input_data.filter( d => "3" === d.month  ) );
    detail_line.update();
  })
  .catch( error => {
    console.log( error );
  });

function Filter() {
  if ( filter.length === 0 ) {
    detail_bar.data = input_data;
  }
  else {
    detail_bar.data = input_data.filter( d => filter.includes( d.month ) );
  }
  detail_line.data = detail_bar.data;

  detail_bar.update();
  detail_line.update();
}

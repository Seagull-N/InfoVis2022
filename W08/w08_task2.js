d3.csv("https://seagull-n.github.io/InfoVis2022/W08/w08_task2.csv")
  .then( data => {
    data.forEach( d => { d.x = +d.x; d.y = +d.y; });

    let config = {
      parent: '#drawing_region',
      width: 280,
      height: 200,
      margin: {top:20, right:20, bottom:70, left:60},
    };

    const line_chart = new LineChart( config, data );
    line_chart.update();
  })
  .catch( error => {
    console.log( error );
  });

class LineChart {

  constructor( config, data ) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
      margin: config.margin || {top:10, right:10, bottom:10, left:10}
    }
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    self.svg = d3.select( self.config.parent )
      .attr('width', self.config.width)
      .attr('height', self.config.height);

    self.chart = self.svg.append('g')
      .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

    self.chart_width = self.config.width - self.config.margin.left - self.config.margin.right;
    self.chart_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

    self.x_scale = d3.scaleLinear()
      .range( [0, self.chart_width] );

    self.y_scale = d3.scaleLinear()
      .range( [0, self.chart_height] )

    self.x_axis = d3.axisBottom( self.x_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.y_axis = d3.axisLeft( self.y_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.xaxis_group = self.chart.append('g')
      .attr('transform', `translate(0, ${self.chart_height})`);

    self.yaxis_group = self.chart.append('g')

    self.line = d3.line()
      .x( d => d.x)

  }

  update() {
    let self = this;

    const x_min = d3.min( self.data, d => d.x );
    const x_max = d3.max( self.data, d => d.x );
    self.x_scale.domain( [x_min, x_max] );

    const y_min = d3.min( self.data, d => d.y );
    const y_max = d3.max( self.data, d => d.y );
    self.y_scale.domain( [y_max, y_min] );

    self.line.y( d => d.y)

    self.render();
  }

  render() {
    let self = this;

    self.chart
      .append("path")
      .attr("d", self.line(self.data))
      .attr("stroke", "blue")
      .attr("fill", "white")

    self.chart.selectAll("circle")
      .data(self.data)
      .enter()
      .append("circle")
      .attr("cx", self.line.x())
      .attr("cy", self.line.y())
      .attr("r", 5)
      .attr("fill", "red");


    self.xaxis_group
      .call(self.x_axis);

    self.yaxis_group
      .call(self.y_axis);
  }
}

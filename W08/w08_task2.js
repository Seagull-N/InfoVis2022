d3.csv("https://seagull-n.github.io/InfoVis2022/W08/w08_task2.csv")
  .then( data => {
    data.forEach( d => { d.x = +d.x; d.y = +d.y; });

    let config = {
      parent: '#drawing_region',
      width: 512,
      height: 256,
      margin: {top:50, right:20, bottom:50, left:100},
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

    self.y_scale = d3.scaleBand()
      .range( [0, self.chart_height] )
      .paddingInner(0.1);

    self.x_axis = d3.axisBottom( self.x_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.y_axis = d3.axisLeft( self.y_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.xaxis_group = self.chart.append('g')
      .attr('transform', `translate(0, ${self.chart_height})`);

    self.yaxis_group = self.chart.append('g')

    self.line = d3.line()
      .x( d => d.x)
      .y( d => d.y)

    self.title =  self.svg.append("text")
      .attr("x", self.config.width / 2)
      .attr("y", self.config.margin.top / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "top")
      .attr("font-weight", 700)
      .text("Favorite food");

    self.y_label = self.svg.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", -(this.config.height / 2))
      .attr("y", this.config.margin.left / 2 - 20)
      .attr("transform", "rotate(-90)")
      .attr("font-weight", 700)
      .attr("font-size", "10pt")
      .text("Kinds of food");

    self.x_label = self.svg.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", self.config.width / 2 + self.config.margin.left / 2)
      .attr("y", this.config.height - this.config.margin.bottom / 2 + 20)
      .attr("font-weight", 700)
      .attr("font-size", "10pt")
      .text("Number of people");

  }

  update() {
    let self = this;

    const x_min = d3.min( self.data, d => d.x );
    const x_max = d3.max( self.data, d => d.x );
    self.x_scale.domain( [x_min, x_max] );

    const y_min = d3.min( self.data, d => d.y );
    const y_max = d3.max( self.data, d => d.y );
    self.y_scale.domain( [y_max, y_min] );

    self.render();
  }

  render() {
    let self = this;

    self.chart.selectAll("path")
      .data(self.data)
      .enter()
      .append("path")
      .attr("d", self.line(data))
      .attr("stroke", "blue")
      .attr("fill", "yellow")

    self.xaxis_group
      .call(self.x_axis);

    self.yaxis_group
      .call(self.y_axis);
  }
}

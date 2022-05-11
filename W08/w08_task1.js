d3.csv("https://seagull-n.github.io/InfoVis2022/W08/w08_task1.csv")
  .then( data => {
    data.forEach( d => { d.value = +d.value; });

    let config = {
      parent: '#drawing_region',
      width: 256,
      height: 256,
      margin: {top:10, right:30, bottom:30, left:30},
    };

    const bar_chart = new BarChart( config, data );
    bar_chart.update();
  })
  .catch( error => {
    console.log( error );
  });

class BarChart {

  constructor( config, data ) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
      margin: config.margin_axis || {top:10, right:10, bottom:10, left:10}
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
      .padding(0.1);


    // self.xaxis = d3.axisBottom( self.x_axis_scale )
    //   .ticks(6).tickSize(4).tickPadding(5);
    //
    // self.yaxis = d3.axisLeft( self.y_axis_scale )
    //   .ticks(6).tickSize(4).tickPadding(5);
    //
    // self.xaxis_group = self.chart_axis.append('g')
    //   .attr('transform', `translate(0, ${self.chart_axis_height})`);
    //
    // self.yaxis_group = self.chart_axis.append('g')
    //   .attr('transform', `translate(0, 0)`);


  }

  update() {
    let self = this;

    self.x_scale.domain( [0, d3.max( self.data, d => d.x )] );

    self.y_scale.domain( data.map(d => d.label) );

    self.render();
  }

  render() {
    let self = this;

    self.chart.selectAll("rect")
      .data(self.data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => this.y_scale(d.label))
      .attr("width", d => self.x_scale( d.value ) )
      .attr("height", self.y_scale.bandwidth() )

  }
}

d3.csv("https://seagull-n.github.io/InfoVis2022/W08/w08_task1.csv")
  .then( data => {
    data.forEach( d => { d.value = +d.value; });

    let config = {
      parent: '#drawing_region',
      width: 512,
      height: 256,
      margin: {top:50, right:20, bottom:50, left:100},
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
      .ticks(5).tickSizeOuter(0);

    self.y_axis = d3.axisLeft( self.y_scale )
      .tickSizeOuter(0);

    self.xaxis_group = self.chart.append('g')
      .attr('transform', `translate(0, ${self.chart_height})`);

    self.yaxis_group = self.chart.append('g')

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

    self.x_scale.domain( [0, d3.max( self.data, d => d.value )] );

    self.y_scale.domain( self.data.map(d => d.label) );

    self.render();
  }

  render() {
    let self = this;

    self.chart.selectAll("rect")
      .data(self.data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", d => self.y_scale(d.label))
      .attr("width", d => self.x_scale( d.value ) )
      .attr("height", self.y_scale.bandwidth() );

      self.xaxis_group
        .call(self.x_axis);

      self.yaxis_group
        .call(self.y_axis);
  }
}

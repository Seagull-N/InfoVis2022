d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W08/w08_task1.csv")
  .then( data => {
    data.forEach( d => { d.value = +d.value; });

    let config = {
      parent: '#drawing_region',
      width: 512,
      height: 256,
      margin: {top:50, right:20, bottom:50, left:100},
    };

    const pie_chart = new PieChart( config, data );
    pie_chart.update();
  })
  .catch( error => {
    console.log( error );
  });

class PieChart {

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
      .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

    self.pie = d3.pie()
      .value( d => d.value );

    self.arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min( self.config.width, self.config.height ) / 2);

    self.title =  self.svg.append("text")
      .attr("x", self.config.width / 2)
      .attr("y", self.config.margin_axis.top / 2)
      .attr("font-size", "15px")
      .attr("text-anchor", "top")
      .attr("font-weight", 700)
      .text("Title");
  }

  update() {
    let self = this;

    self.render();
  }

  render() {
    let self = this;

    self.chart.selectAll("pie")
      .data( self.pie(self.data) )
      .enter()
      .append("path")
      .attr("d", self.arc )
      .attr("fill", "black" )
      .attr("stroke", "white" )
      .style("stroke-width", "2");
  }
}

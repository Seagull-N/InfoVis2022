d3.csv("https://seagull-n.github.io/InfoVis2022/W08/w08_task1.csv")
  .then( data => {
    data.forEach( d => { d.value = +d.value; });

    let config = {
      parent: '#drawing_region',
      width: 512,
      height: 256,
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
    }
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    self.color = d3.scaleOrdinal(d3.schemeCategory10);

    self.svg = d3.select( self.config.parent )
      .attr('width', self.config.width)
      .attr('height', self.config.height)
      .append('g')
      .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

    self.pie = d3.pie()
      .value( d => d.value );

    self.radius = Math.min( self.config.width, self.config.height ) / 2;
    self.arc = d3.arc()
      .innerRadius(self.radius /2)
      .outerRadius(self.radius);

    self.label_arc = d3.arc()
      .outerRadius(self.radius-40)
      .innerRadius(self.radius-40);
    // self.title =  self.svg.append("text")
    //   .attr("x", self.config.width / 2)
    //   .attr("y", self.config.margin_axis.top / 2)
    //   .attr("font-size", "15px")
    //   .attr("text-anchor", "top")
    //   .attr("font-weight", 700)
    //   .text("Title");
  }

  update() {
    let self = this;

    self.render();
  }

  render() {
    let self = this;

    self.svg.selectAll('pie')
      .data( self.pie(self.data) )
      .enter()
      .append('path')
      .attr('d', self.arc)
      .style("fill", function(d,i){
        return self.color(i);
      })
      .attr('stroke', 'white');

    self.svg.selectAll("text")
      .data( self.pie(self.data) )
      .enter()
      .append("text")
      .attr("x","-25")
      .attr("y","5")
      .attr("fill", "black")
      .attr("transform", function(d) { return "translate(" + self.label_arc.centroid(d) + ")"; })
      .attr("font", "5px")
      .text(function(d) { return d.data.label });
  }
}

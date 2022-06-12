class BarChart {

  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
      margin: config.margin || {top:20, right:20, bottom:70, left:40},
      x_label: config.x_label || '',
      y_label: config.y_label || '',
    }
    this.data = data;
    this.init()
  }

  init() {
    let self = this

    self.svg = d3.select(self.config.parent)
      .attr("width", self.config.width)
      .attr("height", self.config.height);

    self.chart = self.svg.append("g")
      .attr("transform",
        "translate(" + self.config.margin.left + "," + self.config.margin.top + ")");

    self.chart_width = self.config.width - self.config.margin.left - self.config.margin.right
    self.chart_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

    self.x_scale = d3.scaleBand()
      .range([0, self.chart_width])
      .padding(0.1);

    self.y_scale = d3.scaleLinear()
      .range([self.chart_height, 0]);

    self.x_axis = d3.axisBottom( self.x_scale )
      .tickFormat((d, i) => { if (i % (self.data.length / 10) === 0) return d;})
      .tickSize(0)

    self.y_axis = d3.axisLeft( self.y_scale )

    self.x_axis_group = self.chart.append("g")
      .attr("transform", "translate(0," + self.chart_height + ")")

    self.y_axis_group = self.chart.append("g");

    const xlabel_space = 40;
    self.svg.append('text')
      .style('font-size', '12px')
      .attr('x', self.config.width / 2)
      .attr('y', self.chart_height + self.config.margin.top + xlabel_space)
      .text( self.config.x_label );

    const ylabel_space = 50;
    self.svg.append('text')
      .style('font-size', '12px')
      .attr('transform', `rotate(-90)`)
      .attr('y', self.config.margin.left - ylabel_space)
      .attr('x', -(self.config.height / 2))
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .text( self.config.y_label );

    self.color_scale = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];

  }

  update() {
    let self = this;

    self.x_scale.domain(self.data.map(d => d.month + "/" + d.year));
    self.y_scale.domain([0, d3.max(self.data, d => d.earthquake)]);

    self.render()
  }

  render() {
    let self = this

    self.chart.selectAll("rect").remove()

    // 概要の地震数
    self.chart.selectAll("rect")
      .data(self.data)
      .enter().append("rect")
      .attr("x", d => self.x_scale(d.month + "/" + d.year))
      .attr("width", self.x_scale.bandwidth())
      .attr("y", d => self.y_scale(d.earthquake))
      .attr("height",d => self.chart_height - self.y_scale(d.earthquake))
      .attr("fill", d => self.color_scale[+d.month - 1])
      .on('click', function(ev,d) {
          let key = d.month
          const is_active = filter.includes(key);
          if ( is_active ) {
            filter = filter.filter( f => f !== key );
          }
          else {
            filter.push( key );
          }
          Filter();
          d3.select(this).classed('active', !is_active);
        });

    // add the x Axis
    self.x_axis_group
      .call(self.x_axis);

    // add the y Axis
    self.y_axis_group
      .call(self.y_axis);

    var svg = d3.select("#legend")

    var keys = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "Oct", "Nov", "Dec"]


// Add one dot in the legend for each name.
    svg.selectAll("mydots")
      .data(keys)
      .enter()
      .append("circle")
      .attr("cx", 100)
      .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", (d, i) => self.color_scale[i])

// Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", (d, i) => self.color_scale[i])
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  }

}


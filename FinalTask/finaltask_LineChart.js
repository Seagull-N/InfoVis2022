class LineChart {

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

    self.y_axis = d3.axisRight( self.y_scale )

    self.x_axis_group = self.chart.append("g")
      .attr("transform", "translate(0," + self.chart_height + ")")

    self.y_axis_group = self.chart.append("g")
      .attr("transform", "translate(" + (self.chart_width) + ", 0)")

    self.line = d3.line()
      // lineのX軸をセット
      .x( d => self.x_scale( d.month + "/" + d.year ) + (self.chart_width / self.data.length / 2))
      // lineのY軸をセット
      .y( d => self.y_scale( d.temperature ))

    const ylabel_space = 50;
    self.svg.append('text')
      .style('font-size', '12px')
      .attr('transform', `rotate(-90)`)
      .attr('y', self.chart_width + self.config.margin.left + ylabel_space / 2)
      .attr('x', -(self.config.height / 2))
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .text( self.config.y_label );
  }

  update() {
    let self = this;

    self.x_scale.domain(self.data.map(d => d.month + "/" + d.year));
    self.y_scale.domain([0, d3.max(self.data, d => d.temperature)]);

    self.render()
  }

  render() {
    let self = this

    self.chart.selectAll("path").remove()
    self.chart.selectAll("circle").remove()


    self.chart.append("path")
      .datum(self.data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", self.line)

    self.chart.selectAll("circle")
      .data(self.data)
      .enter()
      .append("circle")
      .attr("cx", self.line.x())
      .attr("cy", self.line.y())
      .attr("r", 2)
      .attr("fill", "black");

    // add the y Axis
    self.y_axis_group
      .call(self.y_axis);

    // self.x_axis_group
    //   .call(self.x_axis)
  }
}


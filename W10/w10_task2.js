let scatter_plot;

d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
  .then( data => {
    data.forEach( d => { d.x = +d.x; d.y = +d.y; });

    let config = {
      parent: '#drawing_region',
      width: 256,
      height: 256,
      margin_axis: {top:30, right:20, bottom:50, left:50},
      margin_data: {top:30, right:30, bottom:30, left:30}
    };

    scatter_plot = new ScatterPlot( config, data );
    scatter_plot.update();
  })
  .catch( error => {
    console.log( error );
  });

class ScatterPlot {

  constructor( config, data ) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 256,
      margin_axis: config.margin_axis || {top:10, right:10, bottom:10, left:10},
      margin_data: config.margin_data || {top:30, right:30, bottom:30, left:30}
    }
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    self.svg = d3.select( self.config.parent )
      .attr('width', self.config.width)
      .attr('height', self.config.height);

    self.chart_axis = self.svg.append('g')
      .attr('transform', `translate(${self.config.margin_axis.left}, ${self.config.margin_axis.top})`);

    self.chart_data = self.svg.append('g')
      .attr('transform', `translate(${self.config.margin_axis.left + self.config.margin_data.left}, ${self.config.margin_axis.top + self.config.margin_data.top})`);


    self.chart_axis_width = self.config.width - self.config.margin_axis.left - self.config.margin_axis.right;
    self.chart_axis_height = self.config.height - self.config.margin_axis.top - self.config.margin_axis.bottom;

    self.chart_data_width = self.chart_axis_width - self.config.margin_data.left - self.config.margin_data.right;
    self.chart_data_height = self.chart_axis_height - self.config.margin_data.top - self.config.margin_data.bottom;

    self.x_axis_scale = d3.scaleLinear()
      .range( [0, self.chart_axis_width] );

    self.y_axis_scale = d3.scaleLinear()
      .range( [0, self.chart_axis_height] );

    self.x_data_scale = d3.scaleLinear()
      .range( [0, self.chart_data_width] );

    self.y_data_scale = d3.scaleLinear()
      .range( [0, self.chart_data_height] );


    self.xaxis = d3.axisBottom( self.x_axis_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.yaxis = d3.axisLeft( self.y_axis_scale )
      .ticks(6).tickSize(4).tickPadding(5);

    self.xaxis_group = self.chart_axis.append('g')
      .attr('transform', `translate(0, ${self.chart_axis_height})`);

    self.yaxis_group = self.chart_axis.append('g')
      .attr('transform', `translate(0, 0)`);

    self.title =  self.svg.append("text")
      .attr("x", self.config.width / 2)
      .attr("y", self.config.margin_axis.top / 2)
      .attr("font-size", "15px")
      .attr("text-anchor", "top")
      .attr("font-weight", 700)
      .text("Title");

    self.y_label = self.svg.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", -(this.config.height / 2))
      .attr("y", this.config.margin_axis.left / 2 - 10)
      .attr("transform", "rotate(-90)")
      .attr("font-weight", 700)
      .attr("font-size", "10pt")
      .text("Y_label");

    self.x_label = self.svg.append("text")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("x", self.config.width / 2 + self.config.margin_axis.left / 2)
      .attr("y", this.config.height - this.config.margin_axis.bottom / 2 + 10)
      .attr("font-weight", 700)
      .attr("font-size", "10pt")
      .text("X_label");
  }

  update() {
    let self = this;

    const xmin = d3.min( self.data, d => d.x );
    const xmax = d3.max( self.data, d => d.x );
    const xdif = (xmax - xmin) / self.chart_data_width;
    self.x_data_scale.domain( [xmin, xmax] );
    self.x_axis_scale.domain( [xmin - xdif * self.config.margin_data.left, xmax + xdif * self.config.margin_data.right]);

    const ymin = d3.min( self.data, d => d.y );
    const ymax = d3.max( self.data, d => d.y );
    const ydif = (ymax - ymin) / self.chart_data_height;
    self.y_data_scale.domain( [ymax, ymin] );
    self.y_axis_scale.domain( [ymax + ydif * self.config.margin_data.top, ymin - ydif * self.config.margin_data.bottom]);

    self.render();
  }

  render() {
    let self = this;

    self.chart_data.selectAll("circle")
      .data(self.data)
      .enter()
      .append("circle")
      .attr("cx", d => self.x_data_scale( d.x ) )
      .attr("cy", d => self.y_data_scale( d.y ) )
      .attr("r", d => d.r )
        .on('mouseover',function(d) {
          d3.select(this)
            .transition()
            .duration(500)
            .attr('fill' ,"red")
            .attr('stroke-width',5)
          d3.select('#tooltip')
            .style('opacity', 1)
            .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
        })
        .on('mouseout',function () {
          d3.select(this)
            .transition()
            .duration(500)
            .attr('fill' ,"black")
            .attr('stroke-width',0)
        })
        .on('mousemove', (e) => {
          const padding = 10;
          d3.select('#tooltip')
            .style('left', (e.pageX + padding) + 'px')
            .style('top', (e.pageY + padding) + 'px');
        })
        .on('mouseleave', () => {
          d3.select('#tooltip')
            .style('opacity', 0);
        });

    self.xaxis_group
      .call( self.xaxis );

    self.yaxis_group
      .call( self.yaxis )

    // self.chart_data.selectAll("circle")
    //   .on('mouseover', (e,d) => {
    //     d3.select('#tooltip')
    //       .style('opacity', 1)
    //       .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
    //   })
    //   .on('mousemove', (e) => {
    //     const padding = 10;
    //     d3.select('#tooltip')
    //       .style('left', (e.pageX + padding) + 'px')
    //       .style('top', (e.pageY + padding) + 'px');
    //   })
    //   .on('mouseleave', () => {
    //     d3.select('#tooltip')
    //       .style('opacity', 0);
    //   });
  }
}

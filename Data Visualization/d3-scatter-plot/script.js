class Axis {
  constructor(chart, id, type, scale, domainRange) {
    this.id = id;
    this.scale = scale.domain(domainRange);
    this.axis = type.scale(this.scale);
    this.chart = chart;

    this.setup();
  }

  draw(xPos, yPos) {
    this.scale.range([0, this.length]);

    this.chart.append('g').call(this.axis).attr('id', this.id).
    attr("transform", `translate(${xPos}, ${yPos})`);
  }

  setLength(length) {
    this.length = length;
  }

  setup() {
    let svgAxis = this.chart.append('g').call(this.axis);
    this.width = svgAxis.node().getBBox().width;
    this.height = svgAxis.node().getBBox().height;

    svgAxis.remove();
  }}


class BarPlot {
  constructor(renderCanvas, xData, yData, metaInfo) {
    this.width = 1000;
    this.height = 500;
    this.margin = 20;
    this.xData = xData;
    this.yData = yData;
    this.metaInfo = metaInfo;
    this.renderCanvas = d3.select("#chart-container");
    this.svg = this.renderCanvas.append("svg").attr("width", this.width).attr("height", this.height);

    this.drawAxis();
    this.drawDots();
    this.drawLegend();
  }

  drawAxis() {
    this.xAxis = new Axis(this.svg, 'x-axis', d3.axisBottom(), d3.scaleLinear(), [d3.min(this.xData) - 1, d3.max(this.xData) + 1]);
    this.yAxis = new Axis(this.svg, 'y-axis', d3.axisLeft(), d3.scaleTime(), d3.extent(this.yData));

    this.xAxis.axis.tickFormat(d3.format('d'));
    this.yAxis.axis.tickFormat(d3.timeFormat('%M:%S'));

    this.xAxis.setLength(this.width - this.margin * 2 - this.yAxis.width);
    this.yAxis.setLength(this.height - this.margin * 2 - this.xAxis.height);

    this.xAxis.draw(this.margin + this.yAxis.width, this.height - this.margin - this.xAxis.height);
    this.yAxis.draw(this.margin + this.yAxis.width, this.margin);

    this.svg.append("text").text("Time in minutes").
    attr("text-anchor", "middle").
    attr("transform", "rotate(-90)").
    attr('y', this.margin - 5).
    attr('x', -this.height / 2);

    this.svg.append("text").text("Year").
    attr("text-anchor", "middle").
    attr('y', this.height).
    attr('x', this.width / 2);
  }

  drawLegend() {
    this.legend = this.svg.append('g').attr('id', 'legend').selectAll('#legend').
    data(this.colorPattern.domain()).enter().append('g').
    attr('class', 'legend-label').
    attr('transform', (data, index) => {
      return `translate(${-this.margin}, ${this.margin * 2 - index * 22} )`;
    });
    this.legend.append('rect').
    attr('x', this.width - this.margin).
    attr('width', 20).
    attr('height', 20).
    style('fill', this.colorPattern);

    this.legend.append('text').
    attr('x', this.width - this.margin - 5).
    attr('y', this.margin / 2).
    attr('dy', '.35em').
    style('text-anchor', 'end').
    text(data => data ? 'Riders with doping allegations' : 'No doping allegations');
  }

  drawDots() {
    let chart = this;
    this.tooltip = this.renderCanvas.append("div").attr('id', 'tooltip');

    this.colorPattern = d3.scaleOrdinal(d3.schemeCategory10);
    this.dots = this.svg.selectAll('dot').data(this.metaInfo).enter().
    append('circle').attr('class', 'dot').
    attr('data-xvalue', item => item.Year).
    attr('data-yvalue', item => item.Time).
    attr('r', 6).
    attr('cx', item => this.xAxis.scale(item.Year) + this.margin).
    attr('cy', item => this.yAxis.scale(item.Time) + this.margin).
    style('fill', item => this.colorPattern(item.Doping !== '')).
    on('mouseover', function (item) {
      let dot = d3.select(this);
      chart.updateTooltip(item);
    }).
    on('mouseout', function (index, item) {
      chart.tooltip.transition().duration(100).style('opacity', 0);
    });
  }

  updateTooltip(item, dot) {
    let htmlString = `
    <span>${item.Name}: ${item.Nationality}</span>
    <span>Year:${item.Year}, Time:${d3.timeFormat('%M:%S')(item.Time)}</span>
    <br/>
    <span>${item.Doping}</p>`;

    this.tooltip.html(htmlString);
    this.tooltip.attr('data-year', item.Year);
    this.tooltip.style('top', `${d3.event.pageY - 50}px`).
    style('left', `${d3.event.pageX + 10}px`);
    this.tooltip.transition().duration(100).style('opacity', 1);
  }}


function uniqueSortedValues(array) {
  return array.filter((year, index, self) => self.indexOf(year) === index).
  sort((a, b) => a - b);
}

$(document).ready(function () {
  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  (err, response) => {
    response.forEach(data => {
      let parsed = data.Time.split(":");
      data.Time = new Date(Date.UTC(1970, 1, 1, 0, parsed[0], parsed[1]));
    });
    let years = response.map(data => data.Year);
    let times = response.map(data => data.Time);

    years = uniqueSortedValues(years);
    times = uniqueSortedValues(times);

    let barplot = new BarPlot('chart-container', years, times, response);
  });
});
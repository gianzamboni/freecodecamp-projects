class Axis {
  constructor(chart, id, type, domainRange, rangeRound) {
    this.id = id;
    this.scale = d3.scaleBand().domain(domainRange);
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


class HeatMap {
  constructor(renderCanvas, xData, yData, metaInfo) {
    this.width = 1000;
    this.height = 500;
    this.margin = 20;
    this.xData = xData;
    this.yData = yData;
    this.metaInfo = metaInfo;
    this.renderCanvas = d3.select("#chart-container");
    this.svg = this.renderCanvas.append("svg").attr("width", this.width + 200).attr("height", this.height);

    this.drawAxis();
    this.drawCells();
    this.drawLegend();
  }

  drawAxis() {
    this.xAxis = new Axis(this.svg, 'x-axis', d3.axisBottom(), this.xData);
    this.yAxis = new Axis(this.svg, 'y-axis', d3.axisLeft(), this.yData);

    this.xAxis.axis.tickFormat(d3.format('d')).
    tickValues(this.xAxis.scale.domain().filter(year => year % 10 === 0));

    this.yAxis.axis.tickFormat(month => {
      let date = new Date(0);
      date.setUTCMonth(month);
      return d3.timeFormat('%B')(date);
    });

    this.xAxis.setLength(this.width - this.margin * 2 - this.yAxis.width);
    this.yAxis.setLength(this.height - this.margin * 2 - this.xAxis.height);

    this.xAxis.draw(this.margin * 2 + this.yAxis.width, this.height - this.margin - this.xAxis.height);
    this.yAxis.draw(this.margin * 2 + this.yAxis.width, this.margin);

    this.svg.append("text").text("Months").
    attr("text-anchor", "middle").
    attr("transform", "rotate(-90)").
    attr('y', this.margin - 5).
    attr('x', -this.height / 2);

    this.svg.append("text").text("Year").
    attr("text-anchor", "middle").
    attr('y', this.height).
    attr('x', this.width / 2);
  }

  drawCells() {
    let chart = this;
    this.tooltip = this.renderCanvas.append("div").attr('id', 'tooltip');

    this.temperatureVariance = this.metaInfo.monthlyVariance.map(data => data.variance);
    let varianceRange = [d3.min(this.temperatureVariance), d3.max(this.temperatureVariance)];
    this.colorPattern = d3.scaleSequential().
    domain(varianceRange).
    interpolator(d3.interpolateYlOrRd);

    this.cells = this.svg.append('g').
    attr('transform', `translate(${this.margin * 2 + this.yAxis.width}, ${this.margin})`).
    selectAll('rect').
    data(this.metaInfo.monthlyVariance).enter().
    append('rect').attr('class', 'cell').
    attr('fill', item => this.colorPattern(item.variance)).
    attr('data-year', item => item.year).
    attr('data-month', item => item.month - 1).
    attr('data-temp', item => item.variance).
    attr('width', this.xAxis.scale.bandwidth()).
    attr('height', this.yAxis.scale.bandwidth()).
    attr('x', item => this.xAxis.scale(item.year)).
    attr('y', item => this.yAxis.scale(item.month)).
    on('mouseover', function (event, item) {
      let dot = d3.select(this);
      chart.updateTooltip(event, item);
    }).
    on('mouseout', function (index, item) {
      chart.tooltip.transition().duration(100).style('opacity', 0);
    });;
  }

  drawLegend() {
    let varianceValues = this.temperatureVariance.sort((a, b) => a - b);
    let uniques = varianceValues.filter((value, index) => {
      return varianceValues.indexOf(value) === index;
    }).filter((element, index) => index % 5 === 0);

    this.legend = this.svg.append('g').attr('id', 'legend').selectAll('#legend').
    data(uniques).enter().append('g').
    attr('class', 'legend-label').
    attr('transform', (data, index) => {
      return `translate(${this.margin * 2}, ${this.margin + index} )`;
    });

    this.legend.append('rect').
    attr('x', this.width - this.margin).
    attr('width', 20).
    attr('height', 1).
    style('fill', this.colorPattern);

    let legendLabels = this.svg.append('g');

    legendLabels.append('text').
    attr('x', this.width + this.margin * 2).
    attr('y', this.margin / 2).
    attr('dy', '.35em').
    style('text-anchor', 'middle').
    text(`${(this.metaInfo.baseTemperature + uniques[0]).toFixed(2)}°C`);

    legendLabels.append('text').
    attr('x', this.width + this.margin * 2).
    attr('y', this.height - this.margin * 4).
    attr('dy', '.35em').
    style('text-anchor', 'middle').
    text(`${(this.metaInfo.baseTemperature + uniques[uniques.length - 1]).toFixed(2)}°C`);

  }

  updateTooltip(event, item) {
    let htmlString = `
    <span>${item.month}/${item.year}</span>
    <br/>
    <span>${(this.metaInfo.baseTemperature + item.variance).toFixed(2)}°C</span>
    <br/>
    <span>${item.variance.toFixed(2)}°C</p>`;

    this.tooltip.html(htmlString);
    this.tooltip.attr('data-year', item.year);
    this.tooltip.style('top', `${event.pageY - 50}px`).
    style('left', `${event.pageX + 10}px`);
    this.tooltip.transition().duration(100).style('opacity', 1);
  }}


function uniqueSortedValues(array) {
  return array.filter((year, index, self) => self.indexOf(year) === index).
  sort((a, b) => a - b);
}

$(document).ready(async () => {
  const xmlHttp = new XMLHttpRequest();
  const response = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json');

  let years = response.monthlyVariance.map(data => data.year);
  years = uniqueSortedValues(years);

  const months = [...Array(12).keys()].map(key => key + 1);

  const heatMap = new HeatMap('chart-container', years, months, response);
});
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


class BarChart {
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
    this.drawBars();
  }

  drawAxis() {
    this.xAxis = new Axis(this.svg, 'x-axis', d3.axisBottom(), d3.scaleTime(), d3.extent(this.xData));
    this.yAxis = new Axis(this.svg, 'y-axis', d3.axisLeft(), d3.scaleLinear(), [d3.max(this.yData), 0]);

    this.xAxis.setLength(this.width - this.margin * 2 - this.yAxis.width);
    this.yAxis.setLength(this.height - this.margin * 2 - this.xAxis.height);

    this.xAxis.draw(this.margin + this.yAxis.width, this.height - this.margin - this.xAxis.height);
    this.yAxis.draw(this.margin + this.yAxis.width, this.margin);

    this.svg.append("text").text("Gross Domestic Products (Billions)").
    attr("text-anchor", "middle").
    attr("transform", "rotate(-90)").
    attr('y', this.margin * 2 + this.yAxis.width).
    attr('x', -this.height / 2);
  }

  drawBars() {
    let linearScale = d3.scaleLinear().domain([0, d3.max(this.yData)]).
    range([0, this.yAxis.length]);
    let barWidth = this.xAxis.length / this.xData.length;
    let scaledYData = this.yData.map(item => linearScale(item));
    let chart = this;

    this.tooltip = this.renderCanvas.append("div").attr('id', 'tooltip');

    this.bars = this.svg.selectAll('rect').data(scaledYData).enter().
    append('rect').attr('class', 'bar').
    attr('data-date', (item, index) => this.metaInfo[0][index]).
    attr('data-gdp', (item, index) => this.metaInfo[1][index]).
    attr('height', (item, index) => item).
    attr('width', barWidth).
    attr('x', (item, index) => {
      return this.xAxis.scale(this.xData[index]) + this.yAxis.width + this.margin;
    }).
    attr('y', (item, index) => {
      return this.height - this.xAxis.height - this.margin - item;
    }).
    style('fill', 'blue').
    on('mouseover', function (index, item) {
      let bar = d3.select(this);
      chart.updateTooltip(bar.attr('data-date'), bar.attr('data-gdp'));
      bar.style('fill', 'lightblue');
    }).
    on('mouseout', function (index, item) {
      chart.tooltip.transition().duration(100).style('opacity', 0);
      d3.select(this).style('fill', 'blue');
    });
  }

  updateTooltip(date, gdp) {
    let parsedDate = d3.timeFormat('%b %Y')(new Date(date));
    let parsedGdp = d3.format("$,.2f")(gdp) + " Billions";
    let htmlString = `<div> ${parsedDate}</div><div> ${parsedGdp}</div>`;

    this.tooltip.attr('data-date', date);
    this.tooltip.html(htmlString);
    this.tooltip.style('top', d3.event.pageY - 75 + 'px').style('left', d3.event.pageX + 'px');
    this.tooltip.transition().duration(100).style('opacity', 1);
  }}



$(document).ready(function () {
  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  (err, data) => {
    let rawDates = data.data.map(item => item[0]);
    let gdp = data.data.map(item => item[1]);
    let dates = rawDates.map(item => new Date(item));

    let barchar = new BarChart("#chart-container", dates, gdp, [rawDates, gdp]);
  });
});
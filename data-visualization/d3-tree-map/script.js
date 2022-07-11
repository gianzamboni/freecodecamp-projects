function buildTreeMap(data) {
  let root = d3.hierarchy(data).sum((item) => item.value );
  d3.treemap()
    .size([960, 570])
    .padding(2)
    (root)

  let categoryNames = data.children.map((category) => category.name);
  let categoryColors = data.children.map((category, index) => d3.interpolateTurbo(index/data.children.length + 0.2));
  console.log(categoryColors);
  // let minBachelor = education.reduce(
  //   (prev, curr) => prev < curr.bachelorsOrHigher ? prev : curr.bachelorsOrHigher,
  //   100
  // )

  // let maxBachelor = education.reduce(
  //   (prev, curr) => prev > curr.bachelorsOrHigher ? prev : curr.bachelorsOrHigher,
  //   0
  // )

  let colorPalette = d3
    .scaleOrdinal()
    .domain(categoryNames)
    .range(categoryColors);

  let tooltip = d3.select('body').append("div").attr('id', 'tooltip')



  let svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", 960)
    .attr("height", 570)

    svg.append('g')
      .selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('class', 'tile')
      .attr('x', (item) => item.x0 )
      .attr('y', (item) => item.y0 )
      .attr('width', (item) => item.x1 - item.x0)
      .attr('height', (item) => item.y1 - item.y0)
      .attr('data-name', (item) => item.data.name)
      .attr('data-category', (item) => item.data.category)
      .attr('data-value', (item) => item.data.value)
      .style("fill", (item) => colorPalette(item.data.category))
      .style('opacity', 0.5)
      .on('mouseover', function(event, item) {
        let square = d3.select(this);
         tooltip.style('opacity', 1);
         tooltip.attr('data-value', square.attr('data-value'));
         tooltip.style('top', d3.event.pageY - 25 + 'px').style('left', d3.event.pageX + 'px');
         tooltip.html(`<p><b>${square.attr('data-name')}<b></p><p>Category:${square.attr('data-category')}</p><p>Value: \$${parseInt(square.attr('data-value')).toLocaleString()}</p>`)
         tooltip.transition().duration(100).style('opacity', 1);
      })
      .on('mouseout', (event, county) => {
        tooltip.style('opacity', 0);
      });

  
  let legend = svg.append('g')
     .attr('id', 'legend')
     .selectAll('rect')
     .data(categoryNames)
     .enter()
     .append('rect')
     .attr('class', 'legend-item')
     .attr('fill', (item) => colorPalette(item))
}

$(document).ready(function () {
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
  (response) => {
    console.log(response)
    buildTreeMap(response);
  }
  );
});
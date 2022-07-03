
let counties;
let education;

function getCountyData(county) {
  let countyId = typeof county === 'object'? county.id : county;
  console.log(countyId);
  return education.find((ed) => ed.fips === countyId);
};

function builsCloropeth() {
  let topology = topojson.feature(counties, counties.objects.counties).features;

  let minBachelor = education.reduce(
    (prev, curr) => prev < curr.bachelorsOrHigher ? prev : curr.bachelorsOrHigher,
    100
  )

  let maxBachelor = education.reduce(
    (prev, curr) => prev > curr.bachelorsOrHigher ? prev : curr.bachelorsOrHigher,
    0
  )

  let colorPalette = d3
    .scaleThreshold()
    .domain(d3.range(minBachelor, maxBachelor, (maxBachelor - minBachelor)/4))
    .range(d3.schemeGreens[5]);

  let colorRanges = colorPalette.range().map(d3Color => {
    range = colorPalette.invertExtent(d3Color);
    return [ range[0] ?? minBachelor, range[1] ?? maxBachelor];
  });

  let tooltip = d3.select('body').append("div").attr('id', 'tooltip')



  let svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 650)

  svg.append('g')
    .selectAll('path')
    .data(topology)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr("fill", (county) => {
      let countyData = getCountyData(county);
      return colorPalette(countyData.bachelorsOrHigher ?? 0);
    })
    .attr('data-fips', (county) => {
      return county.id;
    })
    .attr('data-education', (county) => {
      let countyData = getCountyData(county);
      return countyData.bachelorsOrHigher ?? 0;
    })
    .on('mouseover', function(event, item) {
      let county = d3.select(this);
      tooltip.style('opacity', 1);
      tooltip.attr('data-education', county.attr('data-education'));
      tooltip.html(`${county.attr('data-education')}`)
      tooltip.style('top', d3.event.pageY - 75 + 'px').style('left', d3.event.pageX + 'px');
      tooltip.transition().duration(100).style('opacity', 1);
    })
    .on('mouseout', (event, county) => {
      tooltip.style('opacity', 0);

    });
  
  svg.append('g')
     .attr('id', 'legend')
     .selectAll('rect')
     .data(colorRanges)
     .enter()
     .append('rect')
     .attr('fill', (colorRange) =>  {
      return colorPalette(colorRange[0])
     });
}

$(document).ready(function () {
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
  (countiesResponse) => {
    counties = countiesResponse;
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json', 
    (educationResponse) => {
      education = educationResponse
      builsCloropeth();
    });
  }
  );
});
// set the dimensions and margins of the graph
const margin = {top: 30, right: 10, bottom: 10, left: 10},
  width = 500 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("sample.csv").then(function(data) {

  // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
  dimensions = Object.keys(data[0])
  console.log(dimensions);
  // console.log(d3.extent(data));

  // For each dimension, I build a linear scale. I store all in a y object
  const x = {}
  for (i in dimensions) {
    name = dimensions[i]
    x[name] = d3.scaleOrdinal()
      .domain( [0,1])
      .range([100, width-100])
      
  }
  console.log(x['Water Heater']);
  // Build the X scale -> it find the best position for each Y axis
  y = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x[p](d[p]) + Math.floor(Math.random() * 30 - 15), y(p)]; }));
  }
  console.log(Math.floor(Math.random() * 10));

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .join("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(0," + y(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisBottom(x[d]).tickFormat(function(d,i){return ['Do not own','own'][i];}));})
    // Add axis title
    .append("text")
      .style("text-anchor", "start")
      .attr("y", -9)
      // .attr("x",0)
      .text(function(d) { return d; })
      .style("fill", "black")

})

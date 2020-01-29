// load data with queue
var url1 = "./data/neighborhood.geojson";
var url2 = "./data/listing_count.json";

var q = d3_queue.queue(1)
  .defer(d3.json, url1)
  .defer(d3.json, url2)
  // .defer(d3.csv, url3)
  .awaitAll(draw);

function draw(error, data) {
  "use strict";

  // important: First argument it expects is error
  if (error) throw error;

  // initialize the Bayview as the default neighborhood
  var field = "Bayview";

  var margin = 50,
    width = 450 - margin,
    height = 500 - margin;

  //color step 1 need to change
  //var colorScheme = ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f"];
  var color = //["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f"];
  d3.scaleThreshold()
    .domain([1, 25, 50, 100, 200, 300, 700])
    .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f"]);

  // create a projection properly scaled for SF
  var projection = d3.geoMercator()
    .center([-122.433701, 37.767683])
    .scale(175000)
    .translate([width / 1.5, height / 1.74]);

  // create a path to draw the neighborhoods
  var path = d3.geoPath()
    .projection(projection);

  //legend 

  var legendData =  [[1, 25], [25, 50], [50, 100], [100, 200], [200, 300], [300, 300]];
  //[[10, 10], [25, 30], [50, 50], [100, 100], [200, 300], [300, 500]];

  var ticksData = [1, 25, 50, 100, 200, 300, 600];
  var tickText = ["0", "1", "25", "50", "100", "200", "300", "700"];
  var textData = [0, 1, 25, 50, 100, 200, 300, 600];

  var legend = d3.select('#map')
              .selectAll('rect')
              .data(legendData)
              .enter()
              .append('rect')
              .attr('y', height + 130)
              .attr('x', function(d,i){return legendData[i][0]})
              .attr("height", 8)
              .attr("width", function(d,i){return legendData[i][1]})
              //.attr("width", function(d,i){console.log(legendData[i][0]) ;return legendData[i][0]})
              .attr("fill", function(d,i) {return color(legendData[i][0]);});
 
  var name = "Number of Airbnb Listing";
  var text = d3.select('#map')
            // .selectAll('text')
           // .data(legendData)
            // .enter()
            .append('text')
            .attr('y', height + 118)
            .attr('x', 5 + 'px')
            .text(name);

  var ticks = d3.select('#map')
            .selectAll('line')
            .data(ticksData)
            .enter()
            .append('line')
            .attr('x1', function(d,i){return ticksData[i]})
            .attr('x2', function(d,i){return ticksData[i]})
            .attr("y1", height + 130)
            .attr("y2", height + 150)
            .style('stroke', 'black')
            .style('stroke-width', 1);

  var ticksText = d3.select('#map')
             .selectAll('text')
             .data(tickText)
             .enter()
             .append('text')
             .attr('y', height + 168)
             .attr('x', function(d,i){console.log(textData[i]);return textData[i]})
             .text(function(d,i){console.log(tickText[i]);return tickText[i]});

  // create and append the map of SF neighborhoods
  var map = d3.select('#map').selectAll('path')
    .data(data[0].features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('stroke', 'black')
    .style('stroke-width', 0.75)
   // .style('margin-right', '50px');

  // // normalize neighborhood names
  map.datum(function(d) {
    var normalized = d.properties.neighbourhood
      .replace(/ /g, '_')
      .replace(/\//g, '_');

    d.properties.neighbourhood = normalized;
    d.count = data[1][d.properties.neighbourhood];
    return d;
  });

  // // add the neighborhood name as its class
  map
    .attr('class', function(d) {
      return d.properties.neighbourhood;
    })
    .attr("fill", function(d) {
      return color(d.count);
    //   function color() {
    //     var colori;
    //   for(var i = 0; i < color.length; ++i){
    //     return colori = color[i];
    //  }}
    })
    .attr("transform", "translate(60" + ", 50" + ")")
   
    //code from discussion example
    .on('mouseover', function(datum, index, nodes) {
      // select our tooltip
      var tooltip = d3.select('#myTooltip');

      // make sure our tooltip is going to be displayed
      tooltip.style('display', 'block');

      // set the initial position of the tooltip
      tooltip.style('left', d3.event.pageX + 'px');
      tooltip.style('top', d3.event.pageY + 'px');

      // set our tooltip to have the values for the 
      // element that we're mousing over
      var displayText = '<strong>'+ datum.properties.neighbourhood + '</strong>' + '<br>' + 'Number of Listings: ' + '<br>' + datum.count; 
      tooltip.html(displayText); 
  })

  .on('mouseleave', function(datum, index, nodes) {
      // select our tooltip 
      var tooltip = d3.select('#myTooltip');

      // hide tooltip if we leave the element we've been 
      // mousing over
      tooltip.style('display', 'none');
  })

  .on('mousedown', function(datum, index, nodes) {
    map.attr('opacity', 0.2);
    d3.select(this).attr('opacity', 1)
    //d3.event.stopPropagation();
  })
  .on('mouseout', function(datum, index, nodes) {
    map.attr('opacity', 1);
  });

}

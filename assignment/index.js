// Set the dimensions of the canvas / graph

var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

// parse the date / time
//var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("div.center").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv", function(error, data) {
    if (error) throw error;

    // format the data (i.e., process it such that strings are converted to their appropriate types)
    data.forEach(function(d) {
        d.country = d.country;
        d.year = +d.year;
        d.pop = +d.pop;
        d.continent = d.continent;
        d.lifeExp = +d.lifeExp;
        d.gdpPercap = +d.gdpPercap;

    });

    
    

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    y.domain([0, d3.max(data, function(d) { return d.lifeExp; })]);

    // // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


});

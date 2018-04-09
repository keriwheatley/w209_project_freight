
/////////////////////////////
// START This code loads the data from 3 csv documents into 3 variables:
/////////////////////////////

// 1. imports - contains all data
// 2. lookup - contains color lengend info
var imports = [];
var lookup = [];
d3.csv("/static/data/summed_data.csv", function(error, data){
    d3.csv("/static/data/default_data.csv", function(error, default_data){
        d3.csv("/static/data/region_legend.csv", function(error, region_data){
            if (error) {
                console.log(error);
            return error;}
    var filtered_data = data.filter(function(d) { return d.orig_name != d.dest_name; });
    console.log(default_data);
    imports = d3.merge([filtered_data,default_data]);
    lookup = region_data
    console.log(imports);
});});});

//3. category_range - contains the maximum range for the "min. metric" selector
var category_range = [];
d3.csv("/static/data/category_min_metric_range.csv", function(error, data){
    if (error) {
        console.log(error);
        return error;}
    category_range = data;
    console.log(category_range);
});
/////////////////////////////
// END code
/////////////////////////////


/////////////////////////////
// START Set up margin values and create SVG
/////////////////////////////

// these values/sizes are best left to the dashboard.html, not js code
// var margin = {top: 20, right: 620, bottom: 70, left: 40};

// the chordchart is fundamentally square
    // width = 1560 - margin.left - margin.right,
    // height = 1160 - margin.top - margin.bottom;

var margin = {top: 30, right: 30, bottom: 30, left: 30};
var height = d3.select("#chordchart").attr("height");
var width = d3.select("#chordchart").attr("width");
var innerheight = height - margin.bottom - margin.top;
var innerwidth = width - margin.right - margin.left;
var svgChart = d3.select("#chordchart").append("g").attr("id", "chords");




    // why are these set here, then reset at line ~116?
    // outerRadius = 450,
    // innerRadius = 450;

    // .attr("width", width )
    // .attr("height", height )
    //.append("g");
/////////////////////////////
// END code
/////////////////////////////



/////////////////////////////
// START This code creates the function that renders the chortchart
/////////////////////////////

function render(data, category, metric, metricyear, region, metric_min ) {

    // Remove previous rendered chortchart
    // svgChart
    //   .select("g")
    //   .remove();

    // Group source data
    var nest_data = d3.nest()
        .key(function(d) { return (d.orig_type + d.orig_name); }).sortKeys(d3.ascending)
        .key(function(d) { return (d.dest_type + d.dest_name); }).sortKeys(d3.ascending)
        .rollup(function(v) { return d3.sum(v, function(d) {
            return d[metricyear]; })})
        .entries(imports.filter(function(d){
            if (category == 'All') {
                return 1==1; }
            else {
                return (d.category == category || d.category == 'Default')}
        ;}))
    console.log(nest_data)

    // Create variable containing data for selected state only
    var selected_state_data = nest_data.filter(
        function(d){
            if (d.key.includes(region)) {
                return d; }
        });
    console.log(selected_state_data);

    // Create data matrix to feed into the chordchart
    var matrix = nest_data.map(
    function(orig_name, row) {
        return orig_name.values.map(
        function(dest_name, col) {
            if (Math.abs(dest_name.value + nest_data[col].values[row].value) > metric_min) {
                return Math.abs(dest_name.value + nest_data[col].values[row].value) }
            else {
                return 0 };
        })})

    // Create boolean matrix to determine direction of ribbon
    var color_matrix = nest_data.map(
    function(orig_name, row) {
      return orig_name.values.map(
        function(dest_name, col) {
          return Math.sign(dest_name.value + -1*nest_data[col].values[row].value)
        })})

    console.log(matrix);
    console.log(color_matrix);

    // Initialize canvas and inner/outer radii of the chords
    var outerRadius = Math.min(innerwidth, innerheight) * 0.5  - 60,
        innerRadius = outerRadius - 20;

    // Initialize chord diagram
    var chord = d3.chord()
        .padAngle(0.01)
        .sortSubgroups(d3.descending);

    // Set Arc Raddii
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // Set Ribbons
    var ribbon = d3.ribbon()
        .radius(innerRadius);

    // Add chordchart to svg
    console.log("render the chordchart!");
    var g = d3.select("#chords").datum(chord(matrix))
      .attr("transform", "translate(" + (width * 0.5) + "," + (height* 0.5) + ")"); // center it into its window
        //.datum(chord(matrix))
        // .attr("transform", "translate(" + 520 + "," + 530 + ")")

    // Defines each "group" in the chord diagram
    var group = g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { return chords.groups; })
      .enter()

    // Draw the radial arcs for each group
    group.append("path")
        .style("fill", function(d,i) {
          return lookup[i].color;
        })
        .style("stroke", function(d,i) { return lookup[i].color; })
        .attr("d", arc)

    // Draw the ribbons that go from group to group
    var ribbons =   g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter().append("path")
      .attr("d", ribbon)
      .style("fill", function(d){ return lookup[d.source.index].color;})
      .style("stroke", function(d){ return lookup[d.source.index].color;})
      .style("opacity", 0.01);

    var description = d3.select("#description").selectAll("p").remove()
    d3.select("#description").append("p")
      .data(selected_state_data)
      .attr("class", "descript")
      .text(function(d){
          var str = "With " + region + " as the region of interest, ";
          str += "the net export for category "+ category;
            var temp=0;
            for (var i=0;i<59;i++) {
                temp=temp-parseFloat(d.values[i].value);
            }
          return str + " is " + Math.round(temp) + " " +metricyear;
      });

    // /////////////////////////////
    // // START This code builds a list of the top 10 largest states in the chordchart.
    // // The variable relevant states is used to show state names in the chordchart.
    // // This reduces the clutter on the chordchart.
    // /////////////////////////////
    // var relevant_states = []

    // // Total values for origin states. It's necessary to calculate origin and dest
    // // state values because origin state is always alphebetically before dest state
    // // in order to produce "net" export/import.
    // var states_orig = d3.nest()
    //     .key(function(d) { return (d.orig_type + d.orig_name); })
    //     .rollup(function(v) { return d3.sum(v, function(d) {
    //         return Math.abs(d[metricyear]); })})
    //     .entries(imports.filter(function(d){
    //         if (category == 'All') {
    //             return 1==1; }
    //         else {
    //             return (d.category == category || d.category == 'Default')}
    //     ;}));

    // // Total values for dest states
    // var states_dest = d3.nest()
    //     .key(function(d) { return (d.dest_type + d.dest_name); })
    //     .rollup(function(v) { return d3.sum(v, function(d) {
    //         return Math.abs(d[metricyear]); })})
    //     .entries(imports.filter(function(d){
    //         if (category == 'All') {
    //             return 1==1; }
    //         else {
    //             return (d.category == category || d.category == 'Default')}
    //     ;}));

    // // Combine origin and dest state values to get top 10 largest states
    // var top_10_states = d3.nest()
    //     .key(function(d) { return (d.key); })
    //     .rollup(function(v) { return d3.sum(v, function(d) {
    //         return d.value; })})
    //     .entries(d3.merge([states_orig,states_dest]))
    //     .sort(function(p1, p2) { return p2.value - p1.value; })
    //     .slice(0, 10);

    // // Add top 10 states to variable relevant_states
    // for (index in top_10_states) {
    //     relevant_states.push(top_10_states[index]['key']);
    // };

    // // console.log(relevant_states);

    // /////////////////////////////
    // // END code
    // /////////////////////////////

    // Set color on ribbons for currently selected state
    ribbons
        .filter(function(row) {
            // if (lookup[row.source.index].type == region || lookup[row.source.index].name == region){
                // relevant_states.push(lookup[row.source.index].type + lookup[row.source.index].name);
                // relevant_states.push(lookup[row.target.index].type + lookup[row.target.index].name); }
            // if (lookup[row.target.index].type == region || lookup[row.target.index].name == region){
                // relevant_states.push(lookup[row.source.index].type + lookup[row.source.index].name);
                // relevant_states.push(lookup[row.target.index].type + lookup[row.target.index].name); }
            return lookup[row.source.index].type == region
                || lookup[row.source.index].name == region
                || lookup[row.target.index].type == region
                || lookup[row.target.index].name == region
                ; })
        .style("fill", function(d){ return lookup[d.source.index].color;})
        .style("stroke", function(d){ return lookup[d.source.index].color;})
        .style("opacity", 0.6)
        .on("mouseover", function (d, i) {
            d3.select(this).style("opacity", 1)
                .append("title")
                .text(function(d){
                    formatDecimalComma = d3.format(",.2f")
                    if (metric == 'million_dollars'){
                        amount = d.target.value
                            tooltip_value = "$" + formatDecimalComma(amount)+"M"}
                    if (metric == 'ton_miles'){
                        amount = d.target.value
                            tooltip_value = formatDecimalComma(amount)+" ton-miles"}
                    if (metric == 'ktons'){
                        amount = d.target.value
                            tooltip_value = formatDecimalComma(amount)+" kilotons"}
                    return "Flow Info:\n" + lookup[d.source.index].name + " → " + lookup[d.target.index].name + ": " + tooltip_value;});
        })
        .on("mouseout", function (d, i) {d3.select(this).style("opacity", 0.6); });

    // Add labels to each state
    group.append("text")
        .attr("dy", ".35em") //width
        .attr("class", "name-label")
        .attr("font-size","12px")
        .attr("font","sans-serif")
        .attr("transform", function(d,i) { //angle
            d.angle = (d.startAngle + d.endAngle) / 2; //calculate the average of the start angle and the end angle
            // console.log(d.angle)
            d.name = lookup[i].name;
            d.type_name = lookup[i].type + lookup[i].name;
            return "rotate(" + (d.angle * 180 / Math.PI) + ")" +
                "translate(0," + -1.01* outerRadius + ")" +
                ((d.angle >= Math.PI * 1 ) ? "rotate(90)" : "rotate(270)");
        }) //to spin when the angle between 135 to 225 degrees
        .style("text-anchor", function(d) {
            if (d.angle >= Math.PI * 1 ) {
                return "end"}
            else {
                return "start"; }})
        .text(function(d) {
            if (d.value>0) {return d.name};
            });

    /////////////////////////////
    // START code for commentary to the right of the chordchart
    /////////////////////////////

    // svgChart.select("#description").append("p")
    //     .data(selected_state_data)
    //     //.attr("id","description")
    //     .attr("font-size", 30)
    //     .attr("fill", "black")
    //     // .attr("x", 500)           // x,y cannot have negative values and are ignored if they do
    //     // .attr("y", -350)          // this location pushes the barchart off the side, so I'm moving it to below
    //     .text(function(d){
    //         return "With " + region + " as the region of interest";
    //     });
    //
    // svgChart.select("#description").enter().append("p")
    //     .data(selected_state_data)
    //     .attr("id","discription")
    //     .attr("font-size", 30)
    //     .attr("fill", "black")
    //     .attr("x", 500)
    //     .attr("y",-315)
    //     .text(function(d){
    //         return "the net export for category "+ category;
    //     });
    //
    // svgChart.select("#description").append("p")
    //     .data(selected_state_data)
    //     .attr("id","discription")
    //     .attr("font-size", 30)
    //     .attr("fill", "black")
    //     .attr("x", 500)
    //     .attr("y", -280)
    //     .text(function(d){
    //         var temp=0;
    //         for (var i=0;i<59;i++) {
    //             temp=temp-parseFloat(d.values[i].value);}
    //         return "is " + Math.round(temp) + " " +metricyear;
    //     });
    /////////////////////////////
    // END code for commentary to the right of the chordchart
    /////////////////////////////
};
/////////////////////////////
// END Code to create the function that renders the chortchart
/////////////////////////////



/////////////////////////////
// START This code updates the filter values and calls the function
// to render the chord chart
/////////////////////////////

// Get all the filter values and call render chordchart function
function select() {
    var category = d3.select( "#d3-dropdown-category" ).node().value
    var year = d3.select( "#d3-dropdown-year" ).node().value
    var metric = d3.select( "#d3-dropdown-metric" ).node().value
    var region = d3.select( "#d3-dropdown-region" ).node().value
    var metric_min = document.getElementById("number").value
    render( imports, category, metric, metric+'_'+year, region, metric_min );
    console.log( category );
    console.log( metric+'_'+year );
    console.log( region )
    console.log( metric_min );
}

// If Explore Data option is run, reset What-If Scenarios to empty
function myExploreFunction() {
  document.getElementById('d3-dropdown-scenario').value = 'none';
  select()
}

// If What-If Scenarios  option is run, change the filters for the Explore Data section
function myScenarioFunction() {
    scenario_type = d3.select( "#d3-dropdown-scenario" ).node().value
    if (scenario_type=='nafta') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region').value = 'Canada';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select();}
    else if (scenario_type=='tariff') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region').value = 'Eastern Asia';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select();}
    else if (scenario_type=='natural_disaster') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region').value = 'Oregon';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select();}
    else if (scenario_type=='electronics') {
        document.getElementById('d3-dropdown-category').value = 'Electronics';
        document.getElementById('d3-dropdown-region').value = 'International';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 5000;
        document.getElementById('slider').value = 5000;
        select();}
    else {console.log("Do nothing")}
};

// If a new item is selected in the Category dropdown,
// 1. change the max range for the Min. Metric slider
// 2. set the Min. Metric slider value to 0
function changeCategory(selected_category) {
    console.log(selected_category)
    // console.log(range_number/10);
    var selected_metric = d3.select( "#d3-dropdown-metric" ).node().value
    // console.log(selected_metric);
    var selected_year = d3.select( "#d3-dropdown-year" ).node().value
    // console.log(selected_year);
    var range = window.category_range.filter(function(row) {
      return row.category == selected_category;})
    // console.log(range)
    var range_number = range[0][selected_metric+'_'+selected_year]-5
    var range_value = Math.round(range_number/20,0)
    document.getElementById('number').value = range_value;
    document.getElementById('slider').value = range_value;
    console.log("Range max: " + range_number)
    document.getElementById('number').max = range_number;
    document.getElementById('slider').max = range_number;
};

// If a new item is selected in the Metric dropdown,
// 1. change the max range for the Min. Metric slider
// 2. set the Min. Metric slider value to 0
function changeMetric(selected_metric) {
    console.log(selected_metric)
    var selected_category = d3.select( "#d3-dropdown-category" ).node().value
    console.log(selected_category);
    var selected_year = d3.select( "#d3-dropdown-year" ).node().value
    console.log(selected_year);
    var range = window.category_range.filter(function(row) {
      return row.category == selected_category;})
    console.log(range)
    var range_number = range[0][selected_metric+'_'+selected_year]-5
    var range_value = Math.round(range_number/20,0)
    document.getElementById('number').value = range_value;
    document.getElementById('slider').value = range_value;
    console.log("Range max: " + range_number)
    document.getElementById('number').max = range_number;
    document.getElementById('slider').max = range_number;
};
/////////////////////////////
// END This code updates the filter values and calls the function
// to render the chord chart
/////////////////////////////

// Create initial chordchart
// There is an added 1 second delay so data can load first
setTimeout(func, 2000);
function func() {
    console.log('Load initial chordchart');
    document.getElementById('run_explore').click();
}

render()
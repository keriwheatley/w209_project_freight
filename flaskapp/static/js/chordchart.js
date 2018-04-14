/////////////////////////////
// START This code loads the data from 3 csv documents into 3 variables:
/////////////////////////////

// 1. imports - contains all data
// 2. lookup - contains color legend info
var imports = [];
var lookup = [];
d3.csv("/static/data/summed_data.csv", function(error, data){
    d3.csv("/static/data/default_data.csv", function(error, default_data){
        d3.csv("/static/data/lookup_states.csv", function(error, region_data){
            if (error) {
                console.log(error);
            return error;}
    var filtered_data = data.filter(function(d) { return d.orig_name != d.dest_name; });
    console.log("default_data", default_data);
    imports = d3.merge([filtered_data,default_data]);
    lookup = region_data
    console.log("imports", imports);
});});});

//3. category_range - contains the maximum range for the "min. metric" selector
var category_range = [];
d3.csv("/static/data/category_min_metric_range.csv", function(error, data){
    if (error) {
        console.log(error);
        return error;}
    category_range = data;
    console.log("category_range", category_range);
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

function render( explore_scenario_type, data, category, year, metric, metricyear, region1, region2, metric_min ) {

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
    console.log("nest_data", nest_data)

    // // Create variable containing data for selected state only
    // var selected_state_data = nest_data.filter(
    //     function(d){
    //         if (d.key.includes(region1)) {
    //             return d; }
    //     });
    // console.log(selected_state_data);

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
          return Math.sign(dest_name.value + nest_data[col].values[row].value)
        })})

    console.log("matrix", matrix);
    console.log("color_matrix", color_matrix);

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

    // remove and re-add new chordchart
    console.log("render the chordchart!");
    d3.select("#chords").remove();
    var g = d3.select("#chordchart")
        .append("g").datum(chord(matrix))
        .attr("id", "chords")
        .attr("transform", "translate(" + (width * .445) + "," + (height* 0.5) + ")"); // center it into its window

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
      .style("fill", function(d){ 
            if (color_matrix[d.source.index][d.target.index] == 1) { 
                return lookup[d.source.index].color; }
            else { 
                return lookup[d.target.index].color; }
            })
      .style("stroke", function(d){ 
            if (color_matrix[d.source.index][d.target.index] == 1) { 
                return lookup[d.source.index].color; }
            else { 
                return lookup[d.target.index].color; }
            })
      .style("opacity", 0.01);

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
    var region1_net = 0
    var region2_net = 0
    ribbons
        .filter(function(row) {


            if (region1 != 'All') {
                if (lookup[row.source.index].type == region1 || lookup[row.source.index].name == region1) {
                    if (color_matrix[row.source.index][row.target.index] == 1) {
                        region1_net += row.source.value
                    } else {
                        region1_net -= row.source.value
                    }
                }
                if (lookup[row.target.index].type == region1 || lookup[row.target.index].name == region1) {
                    if (color_matrix[row.source.index][row.target.index] == 1) {
                        region1_net -= row.target.value
                    } else {
                        region1_net += row.target.value
                    }
                }
            }



            if (region2 != 'All') {
                if (lookup[row.source.index].type == region2 || lookup[row.source.index].name == region2) {
                    if (color_matrix[row.source.index][row.target.index] == 1) {
                        region2_net += row.source.value
                    } else {
                        region2_net -= row.source.value
                    }
                }
                if (lookup[row.target.index].type == region2 || lookup[row.target.index].name == region2) {
                    if (color_matrix[row.source.index][row.target.index] == 1) {
                        region2_net -= row.target.value
                    } else {
                        region2_net += row.target.value
                    }
                }
            }



            if (region1 == 'All' && region2 == 'All') {
                return row
            }
            else if (region1 == 'All') {
                return lookup[row.source.index].type == region2
                    || lookup[row.source.index].name == region2
                    || lookup[row.target.index].type == region2
                    || lookup[row.target.index].name == region2;
            }
            else if (region2 == 'All') {
                return lookup[row.source.index].type == region1
                    || lookup[row.source.index].name == region1
                    || lookup[row.target.index].type == region1
                    || lookup[row.target.index].name == region1;
            }
            else {
                return (lookup[row.source.index].type == region1
                    || lookup[row.source.index].name == region1
                    || lookup[row.target.index].type == region1
                    || lookup[row.target.index].name == region1) && 
                    (lookup[row.source.index].type == region2
                    || lookup[row.source.index].name == region2
                    || lookup[row.target.index].type == region2
                    || lookup[row.target.index].name == region2);
                }; })
        .style("fill", function(d){ 
            if (color_matrix[d.source.index][d.target.index] == 1) { 
                return lookup[d.source.index].color; }
            else { 
                return lookup[d.target.index].color; }
            })
        .style("stroke", function(d){ 
            if (color_matrix[d.source.index][d.target.index] == 1) { 
                return lookup[d.source.index].color; }
            else { 
                return lookup[d.target.index].color; }
            })
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

                    if (color_matrix[d.source.index][d.target.index] == 1) {
                        return "Flow Info:\n" + lookup[d.source.index].name + " → " + 
                            lookup[d.target.index].name + ": " + tooltip_value;
                    } else {
                        return "Flow Info:\n" + lookup[d.target.index].name + " → " + 
                            lookup[d.source.index].name + ": " + tooltip_value;
                    };
        })})
        .on("mouseout", function (d, i) {d3.select(this).style("opacity", 0.6); });
    console.log("region1_net", region1, region1_net);
    console.log("region2_net", region2, region2_net);


    var description = d3.select("#description")
        .selectAll("p").remove()
        d3.select("#description").append("p")
        // .data(selected_state_data)
        .attr("class", "descript")
        .text(function(d){
            if (explore_scenario_type == 'explore') {
                str = ""
                var formatDecimalComma = d3.format(",.2f")
                if (region1 == 'All' && region2 == 'All') {
                    str = "Showing all regions";
                }
                if (region1 != 'All') {
                    str = region1;
                    if (Math.sign(region1_net)==-1){
                        str += " ( net importer of ";}
                    else {
                        str += " ( net exporter of ";}
                    if (metric == 'million_dollars'){
                        var amount = formatDecimalComma(Math.abs(region1_net))
                        str += "$" + amount + "M";}
                    if (metric == 'ton_miles'){
                        var amount = formatDecimalComma(Math.abs(region1_net))
                        str += amount + " ton-miles";}
                    if (metric == 'ktons'){
                        var amount = formatDecimalComma(Math.abs(region1_net))
                        str += amount + " kilotons";}
                    str+= " ) ";
                }
                if (region1 != 'All' & region2 != 'All') {
                    str += " and ";
                }
                if (region2 != 'All') {
                    str += region2;
                    if (Math.sign(region2_net)==-1){
                        str += " ( net importer of ";}
                    else {
                        str += " ( net exporter of ";}
                    if (metric == 'million_dollars'){
                        var amount = formatDecimalComma(Math.abs(region2_net))
                        str += "$" + amount + "M";}
                    if (metric == 'ton_miles'){
                        var amount = formatDecimalComma(Math.abs(region2_net))
                        str += amount + " ton-miles";}
                    if (metric == 'ktons'){
                        var amount = formatDecimalComma(Math.abs(region2_net))
                        str += amount + " kilotons";}
                    str+= " ) ";
                }
            }
            if (explore_scenario_type == 'nafta') {var str = "nafta blah blah"};
            if (explore_scenario_type == 'tariff') {var str = "Tariffs blah blah"};
            if (explore_scenario_type == 'natural_disaster') {
                var str = "Though Oregon may look like a small player in the "
                str += " import and export business (with net imports totaling "
                str += " -$1,010M in 2015) blah blah"};
            if (explore_scenario_type == 'electronics') {var str = "Electronics blah blah"}
          return str

      });


    // Add labels to each state
    group.append("text")
        .attr("dy", ".35em") //width
        .attr("class", "name-label")
        .attr("font-size","12px")
        .attr("font","sans-serif")
        .attr("transform", function(d,i) { //angle
            d.angle = (d.startAngle + d.endAngle) / 2; //calculate the average of the start angle and the end angle
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
function select(explore_scenario_type) {
    var category = d3.select( "#d3-dropdown-category" ).node().value
    var year = d3.select( "#d3-dropdown-year" ).node().value
    var metric = d3.select( "#d3-dropdown-metric" ).node().value
    var region1 = d3.select( "#d3-dropdown-region1" ).node().value
    var region2 = d3.select( "#d3-dropdown-region2" ).node().value
    var metric_min = document.getElementById("number").value
    render( explore_scenario_type, imports, category, year, metric, metric+'_'+year, region1, region2, metric_min );
    console.log( "category", category );
    console.log( "metric year", metric+'_'+year );
    console.log( "region1", region1 )
    console.log( "region2", region2 )
    console.log( "metric_min", metric_min );
}

// If Explore Data option is run, reset What-If Scenarios to empty
function myExploreFunction() {
  document.getElementById('d3-dropdown-scenario').value = 'none';
  select("explore")
}

// If What-If Scenarios  option is run, change the filters for the Explore Data section
function myScenarioFunction() {
    scenario_type = d3.select( "#d3-dropdown-scenario" ).node().value
    if (scenario_type=='nafta') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region1').value = 'Canada';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select(scenario_type);}
    else if (scenario_type=='tariff') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region1').value = 'Eastern Asia';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select(scenario_type);}
    else if (scenario_type=='natural_disaster') {
        document.getElementById('d3-dropdown-category').value = 'All';
        document.getElementById('d3-dropdown-region1').value = 'Oregon';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 1000;
        document.getElementById('slider').value = 1000;
        select(scenario_type);}
    else if (scenario_type=='electronics') {
        document.getElementById('d3-dropdown-category').value = 'Electronics';
        document.getElementById('d3-dropdown-region1').value = 'International';
        document.getElementById('d3-dropdown-year').value = '2015';
        document.getElementById('d3-dropdown-metric').value = 'million_dollars';
        document.getElementById('number').value = 5000;
        document.getElementById('slider').value = 5000;
        select(scenario_type);}
    else {console.log("Do nothing")}
};

// If a new item is selected in the Category dropdown,
// 1. change the max range for the Min. Metric slider
// 2. set the Min. Metric slider value to 0
function changeCategory(selected_category) {
    console.log("selected_category", selected_category);
    var selected_metric = d3.select( "#d3-dropdown-metric" ).node().value
    console.log("selected_metric", selected_metric);
    var selected_year = d3.select( "#d3-dropdown-year" ).node().value
    console.log("selected_year", selected_year);
    if (selected_metric != "none" && selected_year != "none" && selected_category != "none") {
        var range = window.category_range.filter(function(row) {
          return row.category == selected_category;})
        // console.log(range)
        var range_number = range[0][selected_metric+'_'+selected_year]-5
        var range_value = Math.round(range_number/20,0)
        console.log("Range max: " + range_number)
        document.getElementById('number').max = range_number;
        document.getElementById('slider').max = range_number;
        document.getElementById('number').value = range_value;
        document.getElementById('slider').value = range_value;    
    }
};

// If a new item is selected in the Metric dropdown,
// 1. change the max range for the Min. Metric slider
// 2. set the Min. Metric slider value to 0
function changeMetric(selected_metric) {
    console.log("selected_metric", selected_metric)
    var selected_category = d3.select( "#d3-dropdown-category" ).node().value
    console.log("selected_category", selected_category);
    var selected_year = d3.select( "#d3-dropdown-year" ).node().value
    console.log("selected_year", selected_year);
    if (selected_metric != "none" && selected_year != "none" && selected_category != "none") {
        var range = window.category_range.filter(function(row) {
          return row.category == selected_category;})
        console.log("range", range)
        var range_number = range[0][selected_metric+'_'+selected_year]-5
        var range_value = Math.round(range_number/20,0)
        document.getElementById('number').max = range_number;
        document.getElementById('slider').max = range_number;
        document.getElementById('number').value = range_value;
        document.getElementById('slider').value = range_value;
        console.log("Range max: " + range_number)
    }
};


// If a new item is selected in the Metric dropdown,
// 1. change the max range for the Min. Metric slider
// 2. set the Min. Metric slider value to 0
function changeYear(selected_year) {
    console.log("selected_year", selected_year)
    var selected_category = d3.select( "#d3-dropdown-category" ).node().value
    console.log("selected_category", selected_category);
    var selected_metric = d3.select( "#d3-dropdown-metric" ).node().value
    console.log("selected_metric", selected_metric);
    if (selected_metric != "none" && selected_year != "none" && selected_category != "none") {
        var range = window.category_range.filter(function(row) {
          return row.category == selected_category;})
        console.log("range", range)
        var range_number = range[0][selected_metric+'_'+selected_year]-5
        var range_value = Math.round(range_number/20,0)
        document.getElementById('number').max = range_number;
        document.getElementById('slider').max = range_number;
        document.getElementById('number').value = range_value;
        document.getElementById('slider').value = range_value;
        console.log("Range max: " + range_number)
    }
};
/////////////////////////////
// END This code updates the filter values and calls the function
// to render the chord chart
/////////////////////////////


// Create initial chordchart
// There is an added 1 second delay so data can load first
setTimeout(func, 1500);
function func() {

    // console.log("Load legend")

    // var legend5 = d3.select('.legend5').selectAll("legend")
    // .data(legendVals)

    // legend5.enter().append("div")
    // .attr("class","legend5")

    // var p = legend5.append("p").attr("class","country-name")
    // p.append("span").attr("class","key-dot")
    // .style("background",function(d,i) { return d.color } ) 
    // p.insert("text").text(function(d,i) { return d.type } ) 
    // console.log()
    // console.log("end test")

    console.log('Load initial chordchart');
    render( "explore", imports, "All", "2015", "million_dollars", 
        "million_dollars_2015", "All","All", "0" );
    // document.getElementById('run_explore').click();
}


render()

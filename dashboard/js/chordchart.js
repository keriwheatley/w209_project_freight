
  // Store data in object "imports" to be accessed later.
  var imports = [];
  var lookup = [];
  d3.csv("data/summed_data_new.csv", function(error, data){
    d3.csv("data/zero_data.csv", function(error, default_data){
      d3.csv("data/region_colors.csv", function(error, region_data){
        if (error) {
          console.log(error);
          return error;}
        var filtered_data = data.filter(function(d) { return d.orig_name != d.dest_name; });
        imports = d3.merge([filtered_data,default_data]);
        lookup = region_data
        // console.log(colors);
        //console.log(imports);
        // console.log(default_data);
        // console.log(imports);
  });});});

  var category_range = [];
  d3.csv("data/category_range.csv", function(error, data){
        if (error) {
          console.log(error);
          return error;}
        category_range = data;
        //console.log(category_range);
  });
  var svgChart = d3.select("#chordchart");
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = +svgChart.attr("width")  - margin.left - margin.right,
      height = +svgChart.attr("height") - margin.top - margin.bottom,
      innerRadius = height / 3;
      outerRadius = innerRadius + 40;

  svgChart
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g");


  function render(data, category, metricyear, region, metric_min ) {

    // console.log(metric)

    svgChart
      .select("g")
      .remove();

    var nest_data = d3.nest()
      .key(function(d) { return (d.orig_type + d.orig_name); }).sortKeys(d3.ascending)
      .key(function(d) { return (d.dest_type + d.dest_name); }).sortKeys(d3.ascending)
      .rollup(function(v) { return d3.sum(v, function(d) {
        return d[metricyear]; })})
      .entries(imports.filter(function(d){
        if (category == 'All') { return 1==1; }
        else { return (d.category == category || d.category == 'Default')}
        ;}))

    //console.log(nest_data)

    var matrix = nest_data.map(
    function(orig_name, row) {
      return orig_name.values.map(
        function(dest_name, col) {

          if (Math.abs(dest_name.value + nest_data[col].values[row].value) > metric_min)
            { return Math.abs(dest_name.value + nest_data[col].values[row].value) }
          else
            { return 0 };
          // return Math.abs(dest_name.value + nest_data[col].values[row].value)

        })})

    var color_matrix = nest_data.map(
    function(orig_name, row) {
      return orig_name.values.map(
        function(dest_name, col) {
          return Math.sign(dest_name.value + -1*nest_data[col].values[row].value)
        })})

    // console.log(matrix);
    // console.log(color_matrix);

    //Initialize canvas and inner/outer radii of the chords
    var outerRadius = Math.min(width, height) * 0.5 - 35,
        innerRadius = outerRadius - 20;

    //Initialize chord diagram
    var chord = d3.chord()
        .padAngle(0.01)
        .sortSubgroups(d3.descending);

    //Set Arc Raddii
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    //Set Ribbons
    var ribbon = d3.ribbon()
        .radius(innerRadius);

    //What does this do?
    var g = svgChart.append("g")
        .attr("transform", "translate(" + (outerRadius + margin.left) + "," + (outerRadius + margin.top) + ")")
        .datum(chord(matrix));







    //Defines each "group" in the chord diagram
    var group = g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { return chords.groups; })
      .enter()

    //Draw the radial arcs for each group
    group.append("path")
        .style("fill", function(d,i) {
          return lookup[i].color;
        })
        .style("stroke", function(d,i) { return lookup[i].color; })
        .attr("d", arc)
        // .on("mouseover", function(d,i){
        //   console.log("arc mouseover");
        //   ribbons
        //     .style("fill", function(d){ return lookup[d.source.index].color;})
        //     .style("stroke", function(d){ return lookup[d.source.index].color;})
        //     .style("opacity", .6)
        //   ribbons
        //     .filter(function(d) { return d.source.index != i && d.target.index != i; })
        //     .transition()
        //     .style("fill", "#404040")
        //     .style("stroke", "#404040")
        //     .style("opacity", .05);
        //   ribbons
        //     .filter(function(d) {return d.target.index == i || d.source.index == i; })
        //     .style("opacity", .95);
        // })
        // .on("mouseout", function(d) {
        //   console.log("arc mouseout");
        //   ribbons
        //     .style("opacity", .6)
        //     .style("fill", function(d){ return lookup[d.source.index].color; })
        //     .style("stroke", function(d){ return lookup[d.source.index].color; })
        // ;})

    //Add labels to each group
    group.append("text")
          .attr("dy", ".35em") //width
          .attr("class", "name-label")
          .attr("font-size","12px")
          .attr("font","sans-serif")
          .attr("transform", function(d,i) { //angle
            d.angle = (d.startAngle + d.endAngle) / 2; //calculate the average of the start angle and the end angle
            d.name = lookup[i].name; //assignment for the city
            d.odd=0
            if (i%2==0)
              d.odd=0.05
            return "rotate(" + (d.angle * 180 / Math.PI) + ")" +
              "translate(0," + -(1.03 +d.odd)* outerRadius + ")" +
              ((d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4) ? "rotate(180)" : "");
          }) //to spin when the angle between 135 to 225 degrees
          .text(function(d) {
            if (d.value>0) {return d.name};
          });

    //Draw the ribbons that go from group to group
    var ribbons =   g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter().append("path")
      .attr("d", ribbon)
      .style("fill", function(d){ return lookup[d.source.index].color;})
      .style("stroke", function(d){ return lookup[d.source.index].color;})
      .style("opacity", 0.01);

      ribbons
          .filter(function(row) {
            // console.log(row);
            // console.log(lookup[row.source.index]);
            return lookup[row.source.index].type == region
                || lookup[row.target.index].type == region
                || lookup[row.source.index].name == region
                || lookup[row.target.index].name == region; })
          .style("fill", function(d){ return lookup[d.source.index].color;})
          .style("stroke", function(d){ return lookup[d.source.index].color;})
          .style("opacity", 0.6)

          .on("mouseover", function (d, i) {
            d3.select(this).style("opacity", 1)
              .append("title")
              .text(function(d){
                var p = d3.format(".2%"),
                q = d3.formatPrefix(".2", 1000)
                return "Flow Info:\n" + lookup[d.source.index].name + " → " + lookup[d.target.index].name + ": " + d.target.value;});
          })
          .on("mouseout", function (d, i) {d3.select(this).style("opacity", 0.6); });

var selected_state_data = nest_data.filter(
    function(d){
      if (d.key.includes(region)) { return d; }
    });

      svgChart.select("g").append("text")
        .data(selected_state_data)
        .attr("id","discription")
        .attr("font-size", 15)
        .attr("fill", "black")
        .attr("x", 500)
        .attr("y", 0)
        .text(function(d){
          var temp=0;
          for (var i=0;i<59;i++)
          {
            temp=temp-parseFloat(d.values[i].value);
          }
          return "For " + region + ", the net export for category = "+ category +  " is " + Math.round(temp) + " " +metricyear;
        });




          //.on("mouseover", function (d, i) {
          //  svgChart
          //  .append("title")
          //.text(function(d){
          //  var p = d3.format(".2%"),
          //  q = d3.formatPrefix(".2", 1000)

          //return "Flow Info:\n" + lookup[d.source.index].name + " → " + lookup[d.target.index].name + ": " + d.target.value;});})

    // var ribbons =   g.append("g")
    //   .attr("class", "ribbons")
    //   .selectAll("path")
    //   .data(function(chords) { return chords; })
    //   .enter().append("path")
    //   .attr("d", ribbon)
    //   .style("fill", function(d){
    //     return lookup[d.source.index].color;})
    //   .style("stroke", function(d){
    //     return lookup[d.source.index].color;})
    //   .style("opacity", .6)
    //   .on("mouseover", function(d,i){
    //     console.log("ribbon mouseover");
    //     ribbons
    //       .style("fill", function(d){ return lookup[d.source.index].color;})
    //       .style("stroke", function(d){ return lookup[d.source.index].color;})
    //       .style("opacity", .6);
    //     ribbons
    //       .filter(function(row) {
    //           return row.source.index != d.source.index || row.target.index != d.target.index;})
    //       .style("fill", "#404040")
    //       .style("stroke", "#404040")
    //       .style("opacity", .05);
    //     ribbons
    //       .filter(function(row) {
    //           return row.source.index == d.source.index && row.target.index == d.target.index;})
    //       .style("opacity", .95);
    //     })
    //   .on("mouseout", function(d) {
    //     console.log("ribbon mouseout");
    //     ribbons
    //       .style("fill", function(d){ return lookup[d.source.index].color;})
    //       .style("stroke", function(d){ return lookup[d.source.index].color;})
    //       .style("opacity", .6)
    //     });






  }

  function select() {
    var category = d3.select( "#d3-dropdown-category" ).node().value;
    var year = d3.select( "#d3-dropdown-year" ).node().value;
    var metric = d3.select( "#d3-dropdown-metric" ).node().value;
    var region = d3.select( "#d3-dropdown-region" ).node().value;
    var metric_min = document.getElementById("number").value;
    render( imports, category, metric+'_'+year, region, metric_min );
    // console.log( category );
    // console.log( metric+'_'+year );
    // console.log( region );
    // console.log( metric_min );
  }

    function myExploreFunction() {
      document.getElementById('d3-dropdown-scenario').value = 'none';
      select();
    }

    function myScenarioFunction() {
        scenario_type = d3.select( "#d3-dropdown-scenario" ).node().value;
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

    function changeCategory(selected_category) {
        console.log(selected_category)
        document.getElementById('number').value = 0;
        document.getElementById('slider').value = 0;
        var selected_metric = d3.select( "#d3-dropdown-metric" ).node().value
        console.log(selected_metric);
        var selected_year = d3.select( "#d3-dropdown-year" ).node().value
        console.log(selected_year);
        var range = window.category_range.filter(function(row) {
          return row.category == selected_category;})
        console.log(range)
        var range_number = range[0][selected_metric+'_'+selected_year]-5
        console.log("Range max: " + range_number)
        document.getElementById('number').max = range_number;
        document.getElementById('slider').max = range_number;
    };

    function changeMetric(selected_metric) {
        console.log(selected_metric)
        document.getElementById('number').value = 0;
        document.getElementById('slider').value = 0;
        var selected_category = d3.select( "#d3-dropdown-category" ).node().value
        console.log(selected_category);
        var selected_year = d3.select( "#d3-dropdown-year" ).node().value
        console.log(selected_year);
        var range = window.category_range.filter(function(row) {
          return row.category == selected_category;})
        console.log(range)
        var range_number = range[0][selected_metric+'_'+selected_year]-5
        console.log("Range max: " + range_number)
        document.getElementById('number').max = range_number;
        document.getElementById('slider').max = range_number;
    };

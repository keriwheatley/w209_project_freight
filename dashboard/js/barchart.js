
var lib = lib || {};

lib.barChartModule = function() {
  var data = [];

  function data_(_) {
    var that = this;
    if (!arguments.length) return data;
    data = _;
    return that;
  }

  function plot_net_vertical(name, accessor_x, accessor_y) {
    var x = d3.scaleLinear().range([0, barchartwidth]),
        y = d3.scaleBand().rangeRound([barchartheight, 0]).padding(0.1);
    x.domain(d3.extent(data, function(d) {return d.net_total_m_dollar}));
    y.domain(data.map(function(d) {return d.state; }));

    g.select(".title").remove();
    g.append("text")
      .attr("class", "title")
      .attr("font-size", "20")
      .attr("x", 150)
      .attr("y", 50)
      .text(name);

    g.selectAll("g.axis").remove();

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axisy")
        .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll("rect")
      .data(data);

    bars.transition().duration(300)
      .attr("id", function(d) {return accessor_y(d); })
      .attr("x", function(d) {return x(Math.min(0, +accessor_x(d))); })
      .attr("y", function(d) {return y(accessor_y(d)); })
      .attr("height", y.bandwidth())
      .attr("width", function(d) { return Math.abs(x(accessor_x(d)) - x(0)); });


    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) {return accessor_y(d); })
        .attr("x", function(d) { return x(Math.min(0, +accessor_x(d))); })
        .attr("y", function(d) { return y(accessor_y(d)); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return Math.abs(x(accessor_x(d)) - x(0)); });

    bars.exit().transition().duration(300).remove();

  }

  function plot_net_horizontal(name, accessor_x, accessor_y) {
    var y = d3.scaleLinear().range([barchartheight, 0]),
        x = d3.scaleBand().rangeRound([barchartwidth, 0]).padding(0.1);

    // must be linear
    y.domain(d3.extent(data, accessor_y));

    // must be categorical
    x.domain(data.map(accessor_x));

    g.select(".title").remove();
    g.append("text")
      .attr("class", "title")
      .attr("font-size", "20")
      .attr("x", 150)
      .attr("y", 50)
      .text(name);

    g.selectAll("g.axis").remove();
    g.attr("transform", "translate(75,0)");

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(10," + barchartheight + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axisy")
        .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll("rect")
      .data(data);

    bars.transition().duration(300)
      .attr("id", accessor_x)
      .attr("datum", accessor_y)
      .attr("x", function(d) { return x(accessor_x(d)); })
      .attr("y", function(d) {return y(Math.max(0, accessor_y(d))); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return Math.abs(y(accessor_y(d)) - y(0)); });


    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("datum", accessor_y)
      .attr("id", function(d) {return accessor_x(d); })
      .attr("x", function(d) { return x(accessor_x(d)); })
      .attr("y", function(d) { return y(Math.max(0, accessor_y(d))); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return Math.abs(y(accessor_y(d)) - y(0)); });

    bars.exit().transition().duration(300).remove();
    g.select(".axisx").selectAll("g").attr("transform", function(d) {
      return this.getAttribute("transform") + " rotate(90)";
    });

  }

  function plot_absolute(name, accessor) {
  var x = d3.scaleBand().rangeRound([0, barchartwidth]).padding(0.1),
      y = d3.scaleLinear().rangeRound([barchartheight, 0]);

    y.domain([0, d3.max(data, accessor)]);
    x.domain(data.map(function(d) {return d.state_origin; }));

    g.select(".title").remove();
    g.append("text")
      .attr("class", "title")
      .attr("font-size", "20")
      .attr("x", 150)
      .attr("y", 50)
      .text(name);

    g.selectAll("g.axis").remove();

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(0," + barchartheight + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axisy")
        .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll("rect")
      .data(data);


    bars.transition().duration(300)
      .attr("id", function(d) {return d.state_origin; })
      .attr("x", function(d) { return x(d.state_origin); })
      .attr("y", function(d) { return y(accessor(d)); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(accessor(d)); });


    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) {return d.state_origin; })
        .attr("x", function(d) { return x(d.state_origin); })
        .attr("y", function(d) { return y(accessor(d)); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barchartheight - y(accessor(d)); });

    bars.exit().transition().duration(300).remove();

  }

  return {
    "data": data_,
    "plot_absolute": plot_absolute,
    "plot_net_vertical": plot_net_vertical,
    "plot_net_horizontal": plot_net_horizontal
  };
};


var svg = d3.select("#barchart"),
    margin = {top: 20, right: 20, bottom: 30, left: 100},

    barchartwidth = +svg.attr("width") - margin.left - margin.right,
    barchartheight = +svg.attr("height") - margin.top - margin.bottom;


var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("data/by_state.csv", function(d) {
//   d.total_ktons = +d.total_ktons;
//   d.total_m_dollar = +d.total_m_dollar;
//   return d;
// }, function(error, data) {
//   if (error) throw error;
//
//
//   //console.log(data[0])
//   var top_ten = data.sort(function(a,b) {return b.total_m_dollar- a.total_m_dollar}).slice(0,10);
//   //x.domain(data.map(function(d) { return d.state_origin; }));
//
//
//   var myBars = lib.barChartModule();
//   myBars.data(top_ten);
//   myBars.plot_absolute("Millions of Dollars",function(d) {
//     return d.total_m_dollar;
//   });
//
//
//   d3.select("#transition").on("click", function() {
//     top_ten = data.sort(function(a,b) {return b.total_ktons - a.total_ktons}).slice(0,10);
//     myBars.data(top_ten);
//     myBars.plot_absolute("Thousands of Tons", function(d) {
//       return d.total_ktons;
//     });
//   });
//
//   d3.select("#transition2").on("click", function() {
//     top_ten = data.sort(function(a,b) {return b.total_m_dollar- a.total_m_dollar}).slice(0,10);
//     myBars.data(top_ten);
//     myBars.plot_absolute("Millions of Dollars", function(d) {
//       return d.total_m_dollar;
//     });
//   });
// });

d3.csv("data/domestic_combined.csv", function(d) {
  d.net_total_ktons = +d.net_total_ktons;
  d.net_total_m_dollar = +d.net_total_m_dollar;
  d.net_total_ton_mile= +d.net_total_ton_mile;
  return d;
}, function(error, data) {
  if (error) throw error;

  var top_ten = data.sort(function(a,b) {return b.net_total_m_dollar - a.net_total_m_dollar}).slice(0,10);
  var bottom_ten = data.slice(-1,-10);
  //console.log(bottom_ten.length)

  var myBars2= lib.barChartModule();
  myBars2.data(data);
  //myBars2.plot_net_horizontal("Millions of Dollars, Net", function(d) {return d.state}, function(d) { return d.net_total_m_dollar; });
  myBars2.plot_net_vertical("Millions of Dollars, Net", function(d) {return d.net_total_m_dollar}, function(d) { return d.state; });

  function renderBarChart() {
    console.log("render the barchart!")
    var category = d3.select( "#d3-dropdown-category" ).node().value;
    var year = d3.select( "#d3-dropdown-year" ).node().value;
    var metric = d3.select( "#d3-dropdown-metric" ).node().value;
    var region = d3.select( "#d3-dropdown-region" ).node().value;
    var metric_min = document.getElementById("number").value;
    console.log(metric);
    switch(metric) {
      case "million_dollars":
        console.log("millions of dollars!");
        myBars2.plot_net_vertical("Millions of Dollars",
        function(d) {
          return d.net_total_m_dollar;
        }, function(d) {
          return d.state;
        });
        break;
      case "ktons":
        //console.log("ktons!");
        myBars2.plot_net_vertical("Thousands of Tons",
        function(d) {
          return d.net_total_ktons;
        }, function(d) {
          return d.state;
        });
        break;
      case "ton_miles":
        //console.log("ktons!");
        myBars2.plot_net_vertical("Ton-Miles",
        function(d) {
          return d.net_total_ton_mile;
        }, function(d) {
          return d.state;
        });
        break;
      default:
        console.log("default!");
    }
    console.log("done");
  }

  d3.select("#master").on("click", renderBarChart);

});

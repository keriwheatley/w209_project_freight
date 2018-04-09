
var lib = lib || {};

lib.barChartModule = function() {
  var data = [];

  function data_(_) {
    var that = this;
    if (!arguments.length) return data;
    data = _;
    return that;
  }

  function plot_opposition_vertical(name, accessor_x1, accessor_x2, accessor_y) {
    console.log("plotting opposition barchart");
    var midpoint = barchartwidth / 2.0;
    var x1 = d3.scaleLinear().range([midpoint, 0]),
        x2 = d3.scaleLinear().range([midpoint, barchartwidth]),
        y = d3.scaleBand().rangeRound([barchartheight - 30, 30]).padding(0.1);
    x1.domain(d3.extent(data, function(d) {
      return accessor_x1(d)}));
    x2.domain(d3.extent(data, function(d) {return accessor_x2(d)}));
    y.domain(data.map(function(d) {return d.state; }));

    g.select(".title").remove();
    g.append("text")
      .attr("class", "title")
      .attr("font-size", "20")
      .attr("text-anchor", "middle")
      .attr("x", x1(0))
      .attr("y", 10)
      .text(name);

    g.selectAll("g.axis").remove();

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(0," + (barchartheight - 20) + ")")
        .call(d3.axisBottom(x1))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(0," + (barchartheight - 20) + ")")
        .call(d3.axisBottom(x2))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    g.append("g")
        .attr("class", "axis axisy")
        .call(d3.axisLeft(y).ticks(10));

    var leftbars = g.selectAll(".leftbar")
      .data(data);

    var rightbars = g.selectAll(".rightbar")
      .data(data);

    leftbars.transition().duration(300)
      .attr("id", function(d) { return accessor_y(d); })
      .attr("x", function(d) { return x1(+accessor_x1(d)); })
      .attr("y", function(d) { return y(accessor_y(d)); })
      .attr("height", y.bandwidth())
      .attr("width", function(d) { return Math.abs(x1(accessor_x1(d)) - x1(0)); });

    rightbars.transition().duration(300)
      .attr("id", function(d) {return accessor_y(d); })
      .attr("x", function(d) {
          return x2(0);
      })
      .attr("y", function(d) {return y(accessor_y(d)); })
      .attr("height", y.bandwidth())
      .attr("width", function(d) { return x2(accessor_x2(d)) - x2(0); });

    leftbars.enter().append("rect")
        .attr("class", "leftbar bar")
        .attr("id", function(d) {return accessor_y(d); })
        .attr("x", function(d) { return x1(+accessor_x1(d)); })
        .attr("y", function(d) { return y(accessor_y(d)); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return Math.abs(x1(accessor_x1(d)) - x1(0)); });
    rightbars.enter().append("rect")
        .attr("class", "rightbar bar")
        .attr("id", function(d) {return accessor_y(d); })
        .attr("x", function(d) { return x2(0); })
        .attr("y", function(d) { return y(accessor_y(d)); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return x2(accessor_x2(d)) - x2(0); });

    leftbars.exit().transition().duration(300).remove();
    rightbars.exit().transition().duration(300).remove();

  }

  function plot_net_vertical(name, accessor_x, accessor_y) {
    console.log("plot_net_vertical called.");
    var x = d3.scaleLinear().range([0, barchartwidth]),
        y = d3.scaleBand().rangeRound([barchartheight, 0]).padding(0.1);
    x.domain(d3.extent(data, function(d) {return accessor_x(d)}));
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
    "plot_net_horizontal": plot_net_horizontal,
    "plot_opposition_vertical": plot_opposition_vertical
  };
};


var svg = d3.select("#barchart"),
    margin = {top: 20, right: 20, bottom: 30, left: 120},

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
// function getData() {
//   var data = d3.json("/states");//, function(d) {
//     // d.tons_total_exported= +d.tons_total_exported;
//     // d.value_total_exported = +d.value_total_exported;
//     // d.curval_total_exported = +d.curval_total_exported;
//     // d.tons_total_imported= +d.tons_total_imported;
//     // d.value_total_imported = +d.value_total_imported;
//     // d.curval_total_imported = +d.curval_total_imported;
//     // d.tmiles_total_imported = +d.tmiles_total_imported;
//     // d.tmiles_total_exported = +d.tmiles_total_exported;
//    // return d;
//
//     //console.log("rest data: " + d);
//     //return d;
//     //if (error) throw error;
//
//     //var top_ten = data.sort(function(a,b) {return b.net_total_m_dollar - a.net_total_m_dollar}).slice(0,10);
//     //var bottom_ten = data.slice(-1,-10);
//     //console.log(bottom_ten.length)
//     //myBars2.plot_net_horizontal("Millions of Dollars, Net", function(d) {return d.state}, function(d) { return d.net_total_m_dollar; });
//     // myBars2.plot_net_vertical("Millions of Dollars, Net", function(d) {return d.value_total_exported }, function(d) { return d.state; });
//   //});
//   console.log(data);
// }


function renderBarChart(bars) {
  d3.json(options.STATES_URL, function(d) {
    bars.data(d);
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
        bars.plot_opposition_vertical("Imports/Exports in Millions of Dollars",
        function(d) {
          return d.value_total_imported;
        }, function(d) {
          return d.value_total_exported;
        }, function(d) {
          return d.state;
        });
        break;
      case "ktons":
        //console.log("ktons!");
        bars.plot_opposition_vertical("Imports/Exports in Thousands of Tons",
        function(d) {
          return d.tons_total_imported;
        }, function(d) {
          return d.tons_total_exported;
        }, function(d) {
          return d.state;
        });
        break;
      case "ton_miles":
        //console.log("ktons!");
        bars.plot_opposition_vertical("Imports/Exports in Ton-Miles",
        function(d) {
          return d.tmiles_total_imported;
        }, function(d) {
          return d.tmiles_total_exported;
        }, function(d) {
          return d.state;
        });
        break;
      default:
        console.log("default!");
    }
    console.log("done");
  });
}


var bars = lib.barChartModule();
renderBarChart(bars);

d3.select("#master").on("click", function() {
    renderBarChart(bars);
});
// data = d3.json("/states").json();
// bars.plot_opposition_vertical("Millions of Dollars, Net",
//   function(d) {
//     return +d.value_total_imported;
//   }, function(d) {
//     return +d.value_total_exported;
//   }, function(d) {
//     return d.state;
//   }
// );

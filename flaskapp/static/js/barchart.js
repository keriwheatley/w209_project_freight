
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

  function plot_absolute(name, accessor_x, accessor_y, g, poi1, poi2) {
    var x = d3.scaleBand().rangeRound([0, barchartwidth]).padding(0.1),
        y = d3.scaleLinear().rangeRound([barchartheight, 10]);

    x.domain(data.map(accessor_x));
    y.domain([0, d3.max(data, accessor_y)]);

    console.log('plotting absolute');
    console.log(data.map(accessor_x))
    console.log(data);
    g.select(".title").remove();
    g.append("text")
      .attr("class", "title")
      .attr("font-size", "14")
      .attr("x", -30)
      .attr("y", 0)
      .text(name);

    g.selectAll("g.axis").remove();

    g.append("g")
        .attr("class", "axis axisx")
        .attr("transform", "translate(0," + barchartheight + ")")
        .call(d3.axisBottom(x))
        .selectAll(".tick text")
          .call(wrap, x.bandwidth());
        // .selectAll("text")
        //   .attr("y", 0)
        //   .attr("x", 9)
        //   .attr("dy", ".35em")
        //   .attr("transform", "rotate(45)")
        //   .style("text-anchor", "start")

    g.append("g")
        .attr("class", "axis axisy")
        .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll("rect")
      .data(data);


    bars.transition().duration(300)
      .attr("id", function(d) { return accessor_x(d);})
      .attr("class", function(d) {
          if (accessor_x(d) == mapState(poi1)) {
            return "poi1";
          } else if (accessor_x(d) == mapState(poi2)){
              return "poi2"
          } else {
            return "bar";
          }
        })
      .attr("x", function(d) { return x(accessor_x(d)); })
      .attr("y", function(d) { return y(accessor_y(d)); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return barchartheight - y(accessor_y(d)); });
    console.log('here?');


    bars.enter().append("rect")
        .attr("class", function(d) {
          if (accessor_x(d) == mapState(poi1)) {
            return "poi1";
          } else if (accessor_x(d) == mapState(poi2)){
              return "poi2"
          } else {
            return "bar";
          }
        })
        .attr("id", function(d) {return accessor_x(d);})
        .attr("x", function(d) { return x(accessor_x(d));})
        .attr("y", function(d) {
          // console.log(d);
          // console.log(accessor_y(d));
          return y(accessor_y(d)); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return  barchartheight - y(accessor_y(d)); });

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


var margin = {top: 20, right: 10, bottom: 30, left: 60};
var svg1 = d3.select("#barchart1"),
    barchartwidth = +svg1.attr("width") - margin.left - margin.right,
    barchartheight = +svg1.attr("height") - margin.top - margin.bottom;

var svg2 = d3.select("#barchart2"),
    barchartwidth = +svg2.attr("width") - margin.left - margin.right,
    barchartheight = +svg2.attr("height") - margin.top - margin.bottom;

var g1 = svg1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g2 = svg2.append("g")
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
    var region1 = d3.select( "#d3-dropdown-region1" ).node().value;
    var region2 = d3.select( "#d3-dropdown-region2" ).node().value;
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

function mapState(state) {
  switch(state) {
    case "Alabama":
      return "AL"
      break;
    case "Alaska":
      return "AK"
      break;
    case "Arizona":
      return "AZ"
      break;
    case "Arkansas":
      return "AR"
      break;
    case "California":
      return "CA"
      break;
    case "Colorado":
      return "CO"
      break;
    case "Connecticut":
      return "CT"
      break;
    case "Delaware":
      return "DE"
      break;
    case "Florida":
      return "FL"
      break;
    case "Georgia":
      return "GA"
      break;
    case "Hawaii":
      return "HI"
      break;
    case "Idaho":
      return "ID"
      break;
    case "Illinois":
      return "IL"
      break;
    case "Indiana":
      return "IN"
      break;
    case "Iowa":
      return "IA"
      break;
    case "Kansas":
      return "KS"
      break;
    case "Kentucky":
      return "KY"
      break;
    case "Louisiana":
      return "LA"
      break;
    case "Maine":
      return "ME"
      break;
    case "Maryland":
      return "MD"
      break;
    case "Massachusetts":
      return "MA"
      break;
    case "Michigan":
      return "MI"
      break;
    case "Minnesota":
      return "ME"
      break;
    case "Mississippi":
      return "MS"
      break;
    case "Missouri":
      return "MO"
      break;
    case "Montana":
      return "MT"
      break;
    case "Nebraska":
      return "NE"
      break;
    case "Nevada":
      return "NV"
      break;
    case "New Hampshire":
      return "NH"
      break;
    case "New Jersey":
      return "NJ"
      break;
    case "New Mexico":
      return "NM"
      break;
    case "New York":
      return "NY"
      break;
    case "North Carolina":
      return "NC"
      break;
    case "North Dakota":
      return "ND"
      break;
    case "Ohio":
      return "OH"
      break;
    case "Oklahoma":
      return "OK"
      break;
    case "Oregon":
      return "OR"
      break;
    case "Pennsylvania":
      return "PA"
      break;
    case "Rhode Island":
      return "RI"
      break;
    case "South Carolina":
      return "SC"
      break;
    case "South Dakota":
      return "SD"
      break;
    case "Tennessee":
      return "TN"
      break;
    case "Texas":
      return "TX"
      break;
    case "Utah":
      return "UT"
      break;
    case "Vermont":
      return "VT"
      break;
    case "Virginia":
      return "VA"
      break;
    case "Washington":
      return "WA"
      break;
    case "West Virginia":
      return "WV"
      break;
    case "Wisconsin":
      return "WI"
      break;
    case "Wyoming":
      return "WY"
      break;
    case "District of Columbia":
      return "DC"
      break;
    default:
      return state;
    }
}

function getYearAccessor(year, metric) {
    switch(year) {
      case "2012":
        if (metric == "value") {
          return function(d) {return +d.value_2012;}
        } else if (metric == "tons") {
          return function(d) {return +d.tons_2012;}
        } else if (metric == "tmiles") {
          return function(d) {return +d.tmiles_2012;}
        }
        break;
      case "2013":
        if (metric == "value") {
          return function(d) {return +d.value_2013;}
        } else if (metric == "tons") {
          return function(d) {return +d.tons_2013;}
        } else if (metric == "tmiles") {
          return function(d) {return +d.tmiles_2013;}
        }
        break;
      case "2014":
        if (metric == "value") {
          return function(d) {return +d.value_2014;}
        } else if (metric == "tons") {
          return function(d) {return +d.tons_2014;}
        } else if (metric == "tmiles") {
          return function(d) {return +d.tmiles_2014;}
        }
        break;
      case "2015":
        if (metric == "value") {
          return function(d) {return +d.value_2015;}
        } else if (metric == "tons") {
          return function(d) {return +d.tons_2015;}
        } else if (metric == "tmiles") {
          return function(d) {return +d.tmiles_2015;}
        }
        break;
      default:
        if (metric == "value") {
          return function(d) {return +d.value_total;}
        } else if (metric == "tons") {
          return function(d) {return +d.tons_total;}
        } else if (metric == "tmiles") {
          return function(d) {return +d.tmiles_total;}
        }
        break;
    }
}

function renderOutgoingBarChart(bars) {
    var commodity = d3.select( "#d3-dropdown-category" ).node().value.replace(/\ /g, "_").replace(/\./g, "");
    var year = d3.select( "#d3-dropdown-year" ).node().value;
    var metric = d3.select( "#d3-dropdown-metric" ).node().value;
    var origin = d3.select( "#d3-dropdown-region1" ).node().value;
    var dest = d3.select( "#d3-dropdown-region2" ).node().value;
    var metric_min = document.getElementById("number").value;
    switch(metric) {
      case "million_dollars":
        metric = "value";
        break;
      case "ktons":
        metric = "tons";
        break;
      case "ton_miles":
        metric = "tmiles";
        break;
      default:
        metric = "value";
    }
    console.log("dest is");
    console.log(dest);
    var params = "?"
    if (dest == "none") {
      dest = "All";
    }
    if (origin == "none") {
      origin = "All";
    }
    if (commodity != "none") {
      params += "commodity=" + commodity + "&";
    }

    if (year != "none") {
      params += "year=" + year + "&";
    }
    if (commodity == "none") {
      commodity = "All";
    }
    params += "dest=" + mapState(dest) + "&";
    params += "origin=" + mapState(origin) + "&";
    params += "metric=" + metric;
    console.log(options.OUTGOING_URL +params);
  d3.json(options.OUTGOING_URL + params, function(d) {
    console.log("render the outgoing barchart! The data is:");
    console.log(d.length);
    console.log(metric);
    switch(metric) {
      case "value":
        console.log("millions of dollars outgoing");
        console.log(d);
        d = d.sort(function(b, a) {return getYearAccessor(year, "value")(a) - getYearAccessor(year, "value")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Exporters (USD Millions), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.origin;
          }, getYearAccessor(year, "value"), g1, origin, dest);
        break;
      case "tons":
        console.log("ktons!!");
        console.log(d);
        //console.log("ktons!");
        d = d.sort(function(b, a) {return getYearAccessor(year, "tons")(a) - getYearAccessor(year, "tons")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Exporters (Kilotons), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.origin;
          }, getYearAccessor(year, "tons"), g1, origin, dest);
        break;
      case "tmiles":
        //console.log("ktons!");
        d = d.sort(function(b, a) {return getYearAccessor(year, "tmiles")(a) - getYearAccessor(year, "tmiles")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Exporters (Ton-miles), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.origin;
          }, getYearAccessor(year, "tmiles"), g1, origin, dest);
        break;
      default:
      // for default, just use dollar value
        console.log("default");
        console.log("millions of dollars!");
        d = d.sort(function(b, a) {return getYearAccessor(year, "value")(a) - getYearAccessor(year, "value")(b)}).slice(0, 10);
        console.log(d);
        bars.data(d);
        bars.plot_absolute("Top Exporters (USD Millions), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.origin;
          }, getYearAccessor(year, "value"), g1, origin, dest);
        break;
    }
    console.log("done");
  });
}

function renderIncomingBarChart(bars) {
    var commodity = d3.select( "#d3-dropdown-category" ).node().value.replace(/\ /g, "_").replace(/\./g, "");
    var year = d3.select( "#d3-dropdown-year" ).node().value;
    var metric = d3.select( "#d3-dropdown-metric" ).node().value;
    var origin = d3.select( "#d3-dropdown-region1" ).node().value;
    var dest = d3.select( "#d3-dropdown-region2" ).node().value;
    var metric_min = document.getElementById("number").value;
    switch(metric) {
      case "million_dollars":
        metric = "value";
        break;
      case "ktons":
        metric = "tons";
        break;
      case "ton_miles":
        metric = "tmiles";
        break;
      default:
        metric = "value";
    }
    var params = "?"
    if (dest == "none") {
      dest = "All";
    }
    if (origin == "none") {
      origin = "All";
    }
    if (commodity != "none") {
      params += "commodity=" + commodity + "&";
    }

    if (year != "none") {
      params += "year=" + year + "&";
    }
    params += "dest=" + mapState(dest) + "&";
    params += "origin=" + mapState(origin) + "&";
    params += "metric=" + metric;
    if (commodity == "none") {
      commodity = "All";
    }

    console.log(params);
  d3.json(options.INCOMING_URL + params, function(d) {
    console.log("fetch incoming");
    switch(metric) {
      case "value":
        d = d.sort(function(b, a) {return getYearAccessor(year, "value")(a) - getYearAccessor(year, "value")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Importers (USD Millions), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.dest;
          }, getYearAccessor(year, "value"), g2, origin, dest);
        break;
      case "tons":
        console.log("KTONS");
        d = d.sort(function(b, a) {return getYearAccessor(year, "tons")(a) - getYearAccessor(year, "tons")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Importers (Kilotons), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.dest;
          }, getYearAccessor(year, "tons"), g2, origin, dest);
        break;
      case "tmiles":
        //console.log("ktons!");
        d = d.sort(function(b, a) {return getYearAccessor(year, "tmiles")(a) - getYearAccessor(year, "tmiles")(b)}).slice(0, 10);
        bars.data(d);
        bars.plot_absolute("Top Importers (Ton-miles), " + commodity.replace(/_/g, " "),
        function(d) {
          return d.dest;
        }, getYearAccessor(year, "tmiles"), g2, origin, dest);
        break;
      default:
      // for default, just use dollar value
      console.log("default incoming");
        console.log("millions of dollars!");
        d = d.sort(function(b, a) {return getYearAccessor(year, "value")(a) - getYearAccessor(year, "value")(b)}).slice(0, 10);
        console.log(d);
        bars.data(d);
        bars.plot_absolute("Top Importers (USD Millions), " + commodity.replace(/_/g, " "),
          function(d) {
            return d.dest;
          }, getYearAccessor(year, "value"), g2, origin, dest);
        break;
    }
    console.log("done incoming");
  });
}
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


var bars = lib.barChartModule();
renderOutgoingBarChart(bars);
renderIncomingBarChart(bars);

d3.select("#run_explore").on("click", function() {
    renderOutgoingBarChart(bars);
    renderIncomingBarChart(bars);
});

d3.select("#scenario").on("click", function() {
    renderOutgoingBarChart(bars);
    renderIncomingBarChart(bars);
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

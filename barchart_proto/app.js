
var lib = lib || {};

lib.barChartModule = function() {
  var data = [];

  function data_(_) {
    var that = this;
    if (!arguments.length) return data;
    data = _;
    return that;
  }

  function plot_net(name, accessor) {
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);
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
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll("rect")
      .data(data);

    bars.transition().duration(300)
      .attr("id", function(d) {return d.state; })
      .attr("x", function(d) {return x(Math.min(0, +accessor(d))); })

      .attr("y", function(d) { return y(d.state); })
      .attr("height", y.bandwidth())
      .attr("width", function(d) { return Math.abs(x(accessor(d)) - x(0)); });


    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) {return d.state; })
        .attr("x", function(d) { return x(Math.min(0, +accessor(d))); })
        .attr("y", function(d) { return y(d.state); })
        .attr("height", y.bandwidth())
        .attr("width", function(d) { return Math.abs(x(accessor(d)) - x(0)); });

    bars.exit().transition().duration(300).remove();

  }

  function plot_absolute(name, accessor) {
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

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
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
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
        .attr("height", function(d) { return height - y(accessor(d)); });

    bars.exit().transition().duration(300).remove();

  }

  return {
    "data": data_,
    "plot_absolute": plot_absolute,
    "plot_net": plot_net
  };
};


var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;


var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("by_state.csv", function(d) {
  d.total_ktons = +d.total_ktons;
  d.total_m_dollar = +d.total_m_dollar;
  return d;
}, function(error, data) {
  if (error) throw error;


  //console.log(data[0])
  var top_ten = data.sort(function(a,b) {return b.total_m_dollar- a.total_m_dollar}).slice(0,10);
  //x.domain(data.map(function(d) { return d.state_origin; }));


  var myBars = lib.barChartModule();
  myBars.data(top_ten);
  myBars.plot_absolute("Millions of Dollars",function(d) {
    return d.total_m_dollar;
  });


  d3.select("#transition").on("click", function() {
    top_ten = data.sort(function(a,b) {return b.total_ktons - a.total_ktons}).slice(0,10);
    myBars.data(top_ten);
    myBars.plot_absolute("Thousands of Tons", function(d) {
      return d.total_ktons;
    });
  });

  d3.select("#transition2").on("click", function() {
    top_ten = data.sort(function(a,b) {return b.total_m_dollar- a.total_m_dollar}).slice(0,10);
    myBars.data(top_ten);
    myBars.plot_absolute("Millions of Dollars", function(d) {
      return d.total_m_dollar;
    });
  });
});

d3.csv("domestic_combined.csv", function(d) {
  d.net_total_ktons = +d.net_total_ktons;
  d.net_total_m_dollar = +d.net_total_m_dollar;
  d.net_total_ton_mile= +d.net_total_ton_mile;
  return d;
}, function(error, data) {
  if (error) throw error;

  var top_ten = data.sort(function(a,b) {return b.net_total_m_dollar - a.net_total_m_dollar}).slice(0,10);
  var bottom_ten = data.slice(-1,-10);
  console.log(bottom_ten.length)

  var myBars2= lib.barChartModule();
  myBars2.data(data);
  myBars2.plot_net("Millions of Dollars, Net",function(d) {
    return d.net_total_m_dollar;
  });
  });

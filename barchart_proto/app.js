var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function update(data, accessor) {
  g.selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.state_origin); })
      .attr("y", function(d) { return y(accessor(d)); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(accessor(d)); });
}

d3.csv("sample_data.csv", function(d) {
  d.total_ktons = +d.total_ktons;
  d.total_m_dollar = +d.total_m_dollar;
  return d;
}, function(error, data) {
  if (error) throw error;

  var top_ten = data.sort(function(a,b) {return b.total_ktons - a.total_ktons}).slice(0,9);
  //console.log(data[0])
  x.domain(top_ten.map(function(d) { return d.state_origin; }));
  y.domain([0, d3.max(data, function(d) { return d.total_ktons; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  update(top_ten, function(d) {
    return d.total_m_dollar;
  });
});

d3.select("#transition").on("click", function() {
    console.log("clicked!");
});

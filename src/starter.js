import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg

const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
// console.log(height);
const margin = { top: 30, right: 50, bottom: 30, left: 70 };

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");
const formatXAxis = d3.timeFormat("%b %Y");
const formatDate = d3.timeFormat("%b %d, %Y");
const formatPrice = d3.format(",.2f");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// axis
const xAxis = d3
  .axisBottom(xScale)
  .ticks(6)
  .tickFormat((d) => formatXAxis(d))
  .tickSizeOuter(0);

const yAxis = d3
  .axisLeft(yScale)
  .ticks(6)
  .tickSize(-width + margin.right + margin.left);

// line

const line = d3
  .line()
  .curve(d3.curveNatural)
  .x((d) => xScale(d.date_parsed))
  .y((d) => yScale(d.price));

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)

let data = [];
let lastValue;
let path, circle;

d3.json("data/bitcoin-data.json").then((raw_data) => {
  data = raw_data.map((d) => {
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  // console.log(data[data.length - 1]);
  // console.log(data.length);

  // scale
  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  // console.log(d3.extent(data, (d) => d.date_parsed));

  // axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  //path
  path = svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "rgb(148, 140, 253)")
    .attr("opacity", 0.9)
    .attr("stroke-width", 2);

  //last value
  lastValue = data[data.length - 1];
  // console.log(lastValue);

  d3.select("#price").text(formatPrice(lastValue.price));
  d3.select("#date").text(formatDate(lastValue.date_parsed));

  circle = svg
    .append("circle")
    .attr("cx", xScale(lastValue.date_parsed))
    .attr("cy", yScale(lastValue.price))
    .attr("r", 5)
    .attr("fill", "rgb(148, 140, 253)");
});

//resize
window.addEventListener("resize", () => {
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  // console.log(width);

  xScale.range([margin.left, width - margin.right]);
  yScale.range([height - margin.bottom, margin.top]);

  line.x((d) => xScale(d.date_parsed)).y((d) => yScale(d.price));

  path.attr("d", line);

  circle
    .attr("cx", xScale(lastValue.date_parsed))
    .attr("cy", yScale(lastValue.price));

  d3.select(".x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  yAxis.tickSize(-width + margin.right + margin.left);

  d3.select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
});

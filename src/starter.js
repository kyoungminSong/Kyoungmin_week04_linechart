import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg

const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
// console.log(height);
const margin = { top: 50, right: 30, bottom: 50, left: 30 };

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

// axis

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

d3.json("data/bitcoin-data.json").then((raw_data) => {
  data = raw_data.map((d) => {
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  // scale
  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  console.log(d3.extent(data, (d) => d.price));

  //path
  svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "rgb(148, 140, 253)")
    .attr("opacity", 0.9)
    .attr("stroke-width", 2);
});

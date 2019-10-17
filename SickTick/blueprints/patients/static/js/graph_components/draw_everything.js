import draw_circles from './circles.js';
import draw_circles2 from './circles2.js';

var width = 1500;
var height = 780;
var margin = { top: 15, right: 40, bottom: 20, left: 80 };
var innerHeight = height - margin.top - margin.bottom;
var innerWidth = width - margin.left - margin.right;
var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
var oneDaySecs = 24 * 60 * 60 * 1000;

var diffDays = function diffDays(d1, d2) {
  return Math.round(Math.abs((d1 - d2) / oneDaySecs));
};

var draw_everything = function draw_everything(props) {
  // console.log(props);
  d3.select('.graph > *').remove();
  d3.select('.graph').append('svg').attr('height', height).attr('width', width).attr('id', 'graph');

  var svg = d3.select('#graph');

  var chart = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var getValidDate = function getValidDate(date_string) {
    var parts = date_string.split(".");
    var dateISO = parts[2] + "-" + parts[1] + "-" + parts[0];
    // console.log(new Date(dateISO).getTime());
    return new Date(dateISO).getTime();
  };

  var treatmentDuration = diffDays(getValidDate(props.patient.general_info.admission_date), getValidDate(props.patient.general_info.discharge_date));

  var temp = Array.from({ length: treatmentDuration + 1 }, function (v, k) {
    return Math.random() * (42.0 - 35.0) + 35.0;
  });

  var xBandwidth = innerWidth / treatmentDuration;

  var dateFormat = function dateFormat(date) {
    var day = date.getDate();
    var month = months[date.getMonth(date)];
    return day + '-' + month;
  };

  var xScale = d3.scaleTime().domain([getValidDate(props.patient.general_info.admission_date), getValidDate(props.patient.general_info.discharge_date)]).range([0, innerWidth]);

  var xAxis = d3.axisBottom(xScale).tickFormat(dateFormat);

  chart.append('g').attr('transform', 'translate(0, ' + innerHeight + ')').attr('class', 'xAxis').call(xAxis.ticks(treatmentDuration));

  var ticks = d3.selectAll(".xAxis text");
  ticks.each(function (_, i) {
    if (i % 3 !== 0) d3.select(this).remove();
  });

  //temperature
  temp = Object.values(props.patient.temperature);

  // const max_temp = temp
  var max_temp = Math.max.apply(Math, temp.map(function (o) {
    return parseFloat(o.temp);
  }));
  max_temp = max_temp + 1 > 42 ? 42.0 : max_temp + 0.5;

  var min_temp = Math.min.apply(Math, temp.map(function (o) {
    return parseFloat(o.temp);
  }));
  min_temp = min_temp - 1 < 35 ? 35.0 : min_temp - 0.5;

  var tempFormat = function tempFormat(temp) {
    if (temp === 35.0 || temp === 42.0) {
      return '';
    } else return temp;
  };

  var yTempScale = d3.scaleLinear().domain([max_temp, min_temp]).range([0, innerHeight]);

  var yTempAxis = d3.axisLeft(yTempScale).tickFormat(tempFormat);

  chart.append('g').call(yTempAxis).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

  var getX = function getX(d, i) {
    return i * xBandwidth / 2;
  };
  // ((d, i) => {i * xBandwidth; console.log(i)})

  var lineGenerator = d3.line().x(getX).y(function (d) {
    return yTempScale(d.temp);
  }).curve(d3.curveMonotoneX);

  chart.append('path').attr('class', 'templine').attr('d', lineGenerator(temp)).style('fill', 'none').style('stroke', 'black').style('stroke-width', '2');

  chart.selectAll(".dot").data(temp).enter().append("circle").attr("class", "dot").attr('id', function (d, i) {
    return i;
  }).attr("cx", function (d, i) {
    return i * xBandwidth / 2;
  }).attr("cy", function (d) {
    return yTempScale(d.temp);
  }).attr("r", 4);

  chart.selectAll(".temptext").data(temp).enter().append("text").attr('class', 'temptext').text(function (d) {
    return parseFloat(d.temp).toFixed(1);
  }).attr("text-anchor", "middle").attr("x", function (d, i) {
    return i * xBandwidth / 2 + 15;
  }).attr("y", function (d) {
    return yTempScale(d.temp) - 5;
  }).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "black");

  // draw_temperature();
  // let t = props.patients[0].name;
  // svg.append('text')
  // 	.style('text-anchor', 'middle')
  // 	.style('fill', 'black')
  // 	.attr('x', 20)
  // 	.attr('y', 50)
  // 	.text(t);

  // draw_circles(svg, x);
  // draw_circles2(svg, x, 200);
};

export default draw_everything;
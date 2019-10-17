import draw_circles from './circles.js';
import draw_circles2 from './circles2.js';

var width = 960;
var height = 500;
var margin = { top: 15, right: 40, bottom: 20, left: 80 };
var innerHeight = height - margin.top - margin.bottom;
var innerWidth = width - margin.left - margin.right;
var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

var draw_everything = function draw_everything(props) {
	// console.log(props);
	d3.select('.graph > *').remove();
	d3.select('.graph').append('svg').attr('height', height).attr('width', width).attr('id', 'graph');

	var svg = d3.select('#graph');

	var chart = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var getValidDate = function getValidDate(date_string) {
		var parts = date_string.split(".");
		var dateISO = parts[2] + "-" + parts[1] + "-" + parts[0];
		console.log(new Date(dateISO).getTime());
		return new Date(dateISO).getTime();
	};

	var dateFormat = function dateFormat(date) {
		var day = date.getDate();
		var month = months[date.getMonth(date)];
		return day + '-' + month;
	};

	// console.log(getValidDate(props.patient.general_info.admission_date));
	var xScale = d3.scaleTime().domain([getValidDate(props.patient.general_info.admission_date), getValidDate(props.patient.general_info.discharge_date)]).range([0, innerWidth]);

	var xAxis = d3.axisBottom(xScale).tickFormat(dateFormat);

	chart.append('g').attr('transform', 'translate(0, ' + innerHeight + ')').call(xAxis);

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
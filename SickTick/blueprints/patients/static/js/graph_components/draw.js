import draw_circles from './circles.js';
import draw_circles2 from './circles2.js';

var width = 960;
var height = 500;

var draw = function draw(props) {
	d3.select('.graph > *').remove();
	d3.select('.graph').append('svg').attr('height', 500).attr('width', 960).attr('id', 'graph');

	var svg = d3.select('#graph');

	var x = d3.scaleLinear().domain([0, 100]).range([0, 400]);

	svg.call(d3.axisBottom(x));

	// let t = props.patients[0].name;
	// svg.append('text')
	// 	.style('text-anchor', 'middle')
	// 	.style('fill', 'black')
	// 	.attr('x', 20)
	// 	.attr('y', 50)
	// 	.text(t);

	draw_circles(svg, x);
	draw_circles2(svg, x, 200);
};

export default draw;
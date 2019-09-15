import draw_circles from './draw_elements/circles.js';
import draw_circles2 from './draw_elements/circles2.js';

var draw = function draw() {
	var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	d3.select('.graph > *').remove();
	d3.select('.graph').append('svg').attr('height', 500).attr('width', 500).attr('id', 'graph');

	var svg = d3.select('#graph');

	// Create a scale: transform value in pixel
	var x = d3.scaleLinear().domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
	.range([0, 400]); // This is the corresponding value I want in Pixel

	// Show the axis that corresponds to this scale
	svg.call(d3.axisBottom(x));
	draw_circles(svg, x);
	draw_circles2(svg, x);
};

export default draw;
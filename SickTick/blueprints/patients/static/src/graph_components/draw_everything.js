import draw_circles from './circles.js'
import draw_circles2 from './circles2.js'

const width = 960;
const height = 500;
const margin = {top: 15, right: 40, bottom: 20, left: 80};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const draw_everything = (props) => {
	d3.select('.graph > *').remove();
	d3.select('.graph').append('svg')
		.attr('height', height)
		.attr('width', width)
		.attr('id', 'graph')

	const svg = d3.select('#graph');

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

	// var x = d3.scaleLinear()
	//     .domain([0, 100])
	//     .range([0, 400]);
  //
	// svg.call(d3.axisBottom(x));

	// let t = props.patients[0].name;
	// svg.append('text')
	// 	.style('text-anchor', 'middle')
	// 	.style('fill', 'black')
	// 	.attr('x', 20)
	// 	.attr('y', 50)
	// 	.text(t);

	// draw_circles(svg, x);
	// draw_circles2(svg, x, 200);

}

export default draw_everything;

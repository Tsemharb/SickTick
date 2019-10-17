import draw_circles from './circles.js'
import draw_circles2 from './circles2.js'

const width = 960;
const height = 500;
const margin = {top: 15, right: 40, bottom: 20, left: 80};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
                'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const draw_everything = (props) => {
	// console.log(props);
	d3.select('.graph > *').remove();
	d3.select('.graph').append('svg')
		.attr('height', height)
		.attr('width', width)
		.attr('id', 'graph')

	const svg = d3.select('#graph');

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

	const getValidDate = date_string => {
		var parts = date_string.split(".")
		var dateISO = parts[2] + "-" + parts[1] + "-" + parts[0];
		console.log(new Date(dateISO).getTime());
		return new Date(dateISO).getTime();
	}

	const dateFormat = date => {
    let day = date.getDate();
    let month = months[date.getMonth(date)];
    return day + '-' + month;
    }

// console.log(getValidDate(props.patient.general_info.admission_date));
	const xScale = d3.scaleTime()
			.domain([getValidDate(props.patient.general_info.admission_date),
				 			 getValidDate(props.patient.general_info.discharge_date)])
			.range([0, innerWidth]);

	const xAxis = d3.axisBottom(xScale)
		.tickFormat(dateFormat);

	chart.append('g')
		.attr('transform', `translate(0, ${innerHeight})`)
		.call(xAxis);

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

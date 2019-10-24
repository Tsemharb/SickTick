import draw_circles from './circles.js'
import draw_circles2 from './circles2.js'


const width = 1500;
const height = 780;
const margin = {top: 15, right: 40, bottom: 20, left: 80};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
                'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const oneDaySecs = 24*60*60*1000;

const diffDays = (d1, d2) =>
    Math.round(Math.abs((d1 - d2)/(oneDaySecs)));


const draw_everything = (props) => {
  let {patient} = props.patient

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
		// console.log(new Date(dateISO).getTime());
		return new Date(dateISO).getTime();
	}

  const treatmentDuration = diffDays(getValidDate(patient.general_info.admission_date),
                                     getValidDate(patient.general_info.discharge_date));

   let temp = Array.from({length: treatmentDuration + 1}, (v, k) => Math.random() * (42.0 - 35.0) + 35.0);


   const xBandwidth = (innerWidth)/treatmentDuration;

	const dateFormat = date => {
    let day = date.getDate();
    let month = months[date.getMonth(date)];
    return day + '-' + month;
    }

	const xScale = d3.scaleTime()
			.domain([getValidDate(patient.general_info.admission_date),
				 			 getValidDate(patient.general_info.discharge_date)])
			.range([0, innerWidth]);

	const xAxis = d3.axisBottom(xScale)
		.tickFormat(dateFormat);

	chart.append('g')
		.attr('transform', `translate(0, ${innerHeight})`)
    .attr('class', 'xAxis')
		.call(xAxis.ticks(treatmentDuration));


  let ticks = d3.selectAll(".xAxis text");
  ticks.each(function(_,i){
      if(i%3 !== 0) d3.select(this).remove();
  });

//temperature
  temp = Object.values(patient.temperature);

// const max_temp = temp
  let max_temp = Math.max.apply(Math, temp.map(function(o) { return parseFloat(o.temp); }));
  max_temp = (max_temp + 1 > 42) ? 42.0 : max_temp + 0.5;

  let min_temp = Math.min.apply(Math, temp.map(function(o) { return parseFloat(o.temp); }));
  min_temp = (min_temp - 1 < 35) ? 35.0 : min_temp - 0.5;

    const tempFormat = temp => {
    if (temp === 35.0 || temp === 42.0){
      return ''
    }
    else return temp
  }

  const yTempScale = d3.scaleLinear()
    .domain([max_temp, min_temp])
    .range([0, innerHeight])

  const yTempAxis = d3.axisLeft(yTempScale)
    .tickFormat(tempFormat);

  chart.append('g')
    .call(yTempAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('dy', '-.8em')
    .attr('dx', '1em')
    .style('text-anchor', 'middle');


  const getX = (d,i) => {return (i * xBandwidth/2);}
  // ((d, i) => {i * xBandwidth; console.log(i)})

  const lineGenerator = d3.line()
    .x(getX)
    .y(d => yTempScale(d.temp))
    .curve(d3.curveMonotoneX)

  chart.append('path')
    .attr('class', 'templine')
    .attr('d', lineGenerator(temp))
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '2');

  chart.selectAll(".dot")
    .data(temp)
    .enter().append("circle")
    .attr("class", "dot")
    .attr('id', (d, i) => (i))
    .attr("cx", (d, i) => (i * xBandwidth/2))
    .attr("cy", d => yTempScale(d.temp))
    .attr("r", 4)

  chart.selectAll(".temptext")
    .data(temp)
    .enter().append("text")
    .attr('class', 'temptext')
    .text(d => parseFloat(d.temp).toFixed(1))
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => (i * xBandwidth/2 + 15))
    .attr("y", d => yTempScale(d.temp) - 5)
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black");


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




  // function updateChart() {
  //
  //     let extent = d3.event.selection
  //
  //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
  //     if(!extent){
  //       if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
  //       xScale.domain([ 4,8])
  //     }else{
  //       xScale.domain([ xScale.invert(extent[0]), xScale.invert(extent[1]) ])
  //       chart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  //     }
  //
  //     // Update axis and circle position
  //     xAxis.transition().duration(1000).call(d3.axisBottom(x))
  //     scatter
  //       .selectAll("circle")
  //       .transition().duration(1000)
  //       .attr("cx", function (d) { return x(d.Sepal_Length); } )
  //       .attr("cy", function (d) { return y(d.Petal_Length); } )
  //
  //     }
  //
  // d3.select("#graph")
  //       .call( d3.brushX()                     // Add the brush feature using the d3.brush function
  //         .extent( [ [margin.left, 0], [width, height] ] )
  //         .on("end", updateChart)        // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //       )

}

export default draw_everything;

// set min brush width to avoid non-selecting temperature elements
// change brush event to brushing insted of end
// svg resize
// remove last tick in xAxis

import getSVGString from '../controller_components/getSVGString.js'
import svgString2Image from '../controller_components/svgString2Image.js'
import d3_react_link from '../controller_components/d3-react-link.js'

const margin = { top: 15, right: 40, bottom: 20, left: 80 };
const navSize = { height: 40, margin: 45 };
const width = window.innerWidth * 0.7;
const height = width * 0.52 + navSize.height + navSize.margin;
const innerHeight = height - margin.top - margin.bottom - navSize.height - navSize.margin;
const innerWidth = width - margin.left - margin.right;
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
]

// maps number from in domain to out domain
const mapNumber = (number, in_min, in_max, out_min, out_max) => {
    return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

const getValidDate = date_string => {
    var date_chunks = date_string.split(".")
    var dateISO = date_chunks[2] + "-" + date_chunks[1] + "-" + date_chunks[0];
    return new Date(dateISO).getTime();
}


const draw_everything = (props) => {
    let { patient, drawTemp, drawAb, viewport_start, viewport_end } = props.graphData;
    console.log(patient);
    const admission_timestamp = getValidDate(patient.general_info.admission_date);
    const discharge_timestamp = getValidDate(patient.general_info.discharge_date);
    const dateFormat = date => {
        let day = date.getDate();
        let month = months[date.getMonth(date)];
        return day + '-' + month;
    }

    d3.select('.graph > *').remove();
    d3.select('.graph').append('svg')
        .attr('height', height)
        .attr('width', width)
        .attr('id', 'graph')

    const svg = d3.select('#graph');

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        //.attr('transform', `translate(0, ${margin.top})`) //IT SHOULD BE HERE!!! BUT WORKS WRONG WHEN UNCOMMENTED
        .attr("x", 0)
        .attr("y", 0);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('class', 'chart')
        .attr("clip-path", "url(#clip)");

    const xScale = d3.scaleTime()
        .domain([admission_timestamp, discharge_timestamp])
        .range([0, innerWidth]);


    let xAxis = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
        .attr('class', 'xAxis')
        //.call(xAxis.ticks(treatmentDuration));
        .call(d3.axisBottom(xScale)
            // .ticks(d3.timeDay.every(1))
            .tickFormat(dateFormat))


    // let ticks = d3.selectAll(".xAxis text");
    // ticks.each(function(_, i) {
    //     if (i % 2 !== 0) d3.select(this).remove();
    // });

    //get temperature data
    const temp = Object.values(patient.temperature);
    // let temp = Array.from({ length: treatmentDuration + 1 }, (v, k) => Math.random() * (42.0 - 35.0) + 35.0);
    const antibiotics = Object.values(patient.antibiotics);


    const abColors = ['aliceblue', 'aqua', 'brown', 'cyan', 'darkred',
        'deeppink', 'fuchsia', 'lightgrey', 'olive', 'peru', 'tan'
    ]


    // define max/min temeperatures to set proper temperature domain
    let max_temp = Math.max.apply(Math, temp.map(o => parseFloat(o.temp)));
    max_temp = (max_temp + 1 > 42) ? 42.0 : max_temp + 0.5;
    let min_temp = Math.min.apply(Math, temp.map(o => parseFloat(o.temp)));
    min_temp = (min_temp - 1 < 35) ? 35.0 : min_temp - 0.5;

    const tempFormat = temp => {
        if (temp === 35.0 || temp === 42.0) {
            return ''
        } else return temp
    }

    // temperature y scale
    const yTempScale = d3.scaleLinear()
        .domain([max_temp, min_temp])
        .range([0, innerHeight])
    // create y temperature axis
    let yTempAxis = svg.append('g')
        .attr('class', 'yTempAxis')
    // create temperature path generator
    const tempPathGen = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yTempScale(d.temp))
        .curve(d3.curveMonotoneX)


    //antibiotics
    const yAbLabel = ab => ab.name.toUpperCase().substring(0, 3);
    const abColor = ab => abColors[Math.floor(Math.random() * abColors.length)];

    const yAbScale = d3.scaleBand()
        .domain(antibiotics.map(yAbLabel))
        .range([0, innerHeight])
    const yAbAxis = d3.axisLeft(yAbScale);

    svg.append('g')
        .attr('class', 'yAbAxis')
        .call(yAbAxis)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .selectAll('text')
        .attr('transform', 'rotate(-90)')
        .attr('dy', '-2em')
        .attr('x', '0')
        .attr('font-weight', '700')
        .style('text-anchor', 'middle');
    d3.selectAll('.yAbAxis .tick line')
        .remove();

    svg.selectAll('.color-label rect').data(antibiotics).enter()
        .append('rect')
        .attr('class', 'color-label')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('x', -30)
        .attr('y', ab => yAbScale(yAbLabel(ab)))
        .attr('width', 30)
        .attr('height', yAbScale.bandwidth())
        .style('fill', ab => abColor(ab));


    //////// display temperature block
    if (drawTemp) {
        yTempAxis
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yTempScale).tickFormat(tempFormat))
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-.8em')
            .attr('dx', '1em')
            .style('text-anchor', 'middle');

        chart.append('path')
            .attr('class', 'temp_curve')
            .attr('d', tempPathGen(temp))
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '2');

        chart.selectAll(".dot")
            .data(temp)
            .enter().append("circle")
            .attr("class", "dot")
            .attr('id', (d, i) => (i))
            .attr("cx", d => xScale(d.timestamp))
            .attr("cy", d => yTempScale(d.temp))
            .attr("r", 4);

        chart.selectAll(".temptext")
            .data(temp)
            .enter().append("text")
            .attr('class', 'temptext')
            .text(d => parseFloat(d.temp).toFixed(1))
            .attr("text-anchor", "middle")
            .attr("x", d => xScale(d.timestamp) + 15)
            .attr("y", d => yTempScale(d.temp) - 5)
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black");
    }

    function updateChart() {
        // console.log('update')
        // return
        let extent = d3.event.selection;
        // get treatment days brushed by user
        let domain_min = mapNumber(extent[0], 0, innerWidth, admission_timestamp, discharge_timestamp);
        let domain_max = mapNumber(extent[1], 0, innerWidth, admission_timestamp, discharge_timestamp);
        // reset and rescale xAxis
        xScale.domain([domain_min, domain_max]);
        svg.select('.xAxis')
            .transition().duration(1000)
            .call(d3.axisBottom(xScale).tickFormat(dateFormat));

        if (drawTemp) {
            //get temperature data brushed by user
            let selected_temp = []
            for (let i = 0; i <= temp.length - 1; i++) {
                if (temp[i].timestamp >= domain_min && temp[i].timestamp <= domain_max) {
                    selected_temp.push(temp[i]['temp'])
                }
            }
            // console.log(selected_temp);

            // get max/min from selected temperatures
            let max_t = Math.max(...selected_temp);
            max_t = (max_t + 1 > 42) ? 42.0 : max_t + 0.5;
            let min_t = Math.min(...selected_temp)
            min_t = (min_t - 1 < 35) ? 35.0 : min_t - 0.5;
            // reset and rescale temperature axis
            yTempScale.domain([max_t, min_t]);
            svg.select('.yTempAxis')
                .transition().duration(1000)
                .call(d3.axisLeft(yTempScale).tickFormat(tempFormat))
                .selectAll('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '-.8em')
                .attr('dx', '1em')
                .style('text-anchor', 'middle');

            // redraw temperature curve, dots and text
            chart.selectAll(".dot")
                .transition().duration(300)
                .attr("cx", d => xScale(d.timestamp))
                .attr("cy", d => yTempScale(d.temp))
            chart.selectAll(".temptext")
                .transition().duration(250)
                .attr("x", d => xScale(d.timestamp) + 15)
                .attr("y", d => yTempScale(d.temp) - 5)
            chart.selectAll(".temp_curve")
                .transition().duration(350)
                .attr('d', tempPathGen(temp))
        }
        // console.log(min_t);
        // console.log(max_t);
        d3_react_link();

    }

    //save to png
    const png_save_btn = d3.select('button.png_save');
    png_save_btn.on('click', function() {
        var svgString = getSVGString(svg.node());
        svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

        function save(dataBlob, filesize) {
            saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
        }
    });


    // add nav chart
    const navGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top + navSize.margin})`)
        .attr('class', 'navGroup');
    // add nav background
    navGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", innerWidth)
        .attr("height", navSize.height)
        .style("fill", "#F5F5F5")
        .style("shape-rendering", "crispEdges")
        .attr("transform", "translate(0, 0)");
    // add nav xAxis
    let xNavAxis = navGroup.append('g')
        .attr('transform', `translate(0, ${navSize.height})`)
        .call(d3.axisBottom(xScale).tickFormat(dateFormat))

    let viewport = d3.brushX()
        .extent([
            [0, 0],
            [innerWidth, navSize.height]
        ])
        .on("brush", updateChart)

     const x1 = viewport_start ? viewport_start : xScale(admission_timestamp)
     const x2 = viewport_end ? viewport_end : xScale(discharge_timestamp)

    let brushSelection = navGroup.selectAll('.brush').data([viewport]);
    brushSelection
        .enter()
        .insert('g', '.brush')
        .attr('class', 'brush')
        .each(function(brushObj) {
            // this init's the brush
            brushObj(d3.select(this));
            brushObj.move(d3.select(this), [
                x1,
                x2
            ]);
        });


}

export default draw_everything;
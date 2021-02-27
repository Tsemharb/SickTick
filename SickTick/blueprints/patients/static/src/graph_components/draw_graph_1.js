// svg resize
// remove last tick in xAxis

import getSVGString from '../controller_components/getSVGString.js'
import svgString2Image from '../controller_components/svgString2Image.js'
import d3_react_link from '../controller_components/d3-react-link.js'

const margin = { top: 15, right: 40, bottom: 20, left: 80 };
const navSize = { height: 30, margin: 45 };
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


const draw_graph_1 = (props) => {
    // console.log(props)
    const { patient, drawTemp, drawAb, adjustAbScope, viewport_start_timestamp, viewport_end_timestamp, 
            additional_tests, draw_annotations, unique_antibiotics_order } = props.graphData;

    const add_tests_keys = Object.keys(props.graphData.patient.additional_tests)
    const admission_timestamp = props.graphData.patient.general_info.admission_timestamp;
    const discharge_timestamp = props.graphData.patient.general_info.discharge_timestamp;

    const dateFormat = date => {
        let day = date.getDate();
        let month = months[date.getMonth(date)];
        return day + '-' + month;
    }

    d3.select('.app__graph-1 .graph > *').remove();
    d3.select('.app__graph-1 .graph').append('svg')
        .attr('height', height)
        .attr('width', width)
        .attr('id', 'graph_1')

    const svg = d3.select('#graph_1');

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

    //get data to draw
    const temp = Object.values(patient.temperature);
    let tempChunks = []
    let chunk = [temp[0]]
    for (let i = 1; i < temp.length; i++) {
        if (temp[i].timestamp - temp[i - 1].timestamp <= 86400000) {
            chunk.push(temp[i])
        } else {
            tempChunks.push(chunk)
            chunk = [temp[i]]
        }
        if (i === temp.length - 1) {
            tempChunks.push(chunk)
        }
    }

    //get antibiotics selected to be drawn while preserving theirs order
    let antibiotics = []
    for (let j = 0; j < unique_antibiotics_order.length; j++){
        for (let i = 0; i < patient.antibiotics.length; i++) {
            if (patient.antibiotics[i].draw && unique_antibiotics_order[j] === patient.antibiotics[i].name) {
                antibiotics.push(patient.antibiotics[i])
            }
        }
    }
    const ab_set = Array.from(new Set(antibiotics.map(ab => ab.name)));

    // define max/min temeperatures to set proper temperature domain
    let max_temp = Math.max.apply(Math, temp.map(o => parseFloat(o.temp)));
    max_temp = (max_temp + 1 > 42) ? 42.0 : max_temp + 0.5;
    let min_temp = Math.min.apply(Math, temp.map(o => parseFloat(o.temp)));
    min_temp = (min_temp - 1 < 35) ? 35.0 : min_temp - 0.5;

    const tempFormat = temp => {
        if (temp === 35.0 || temp === 42.0) { return '' } else return temp
    }

    // set correct y position of temperature label
    const tempLabelY = ab => {
        const t = parseFloat(ab.temp);
        // first element
        if (ab.id === 0) {
            if (t <= parseFloat(temp[1].temp))
                return yTempScale(t) + 12;
            else return yTempScale(t) - 5;
        }
        // last element
        if (ab.id === temp.length - 1) {
            if (t <= parseFloat(temp[temp.length - 2].temp))
                return yTempScale(t) + 12;
            else return yTempScale(t) - 5;
        }
        // another elements
        const prevT = parseFloat(temp[ab.id - 1].temp);
        const nextT = parseFloat(temp[ab.id + 1].temp);
        //if both less
        if (t <= prevT && t <= nextT) {
            return yTempScale(t) + 12;
        }
        //if both greater
        if (t >= prevT && t >= nextT) {
            return yTempScale(t) - 5;
        }
        // one greater than other
        return yTempScale(t) - 5
    }

    // set correct x position of temperature label
    const tempLabelX = ab => {
        const t = parseFloat(ab.temp);
        // first element
        if (ab.id === 0 || ab.id === temp.length - 1) {
            return xScale(ab.timestamp);
        }
        // left greater than right
        const prevT = parseFloat(temp[ab.id - 1].temp);
        const nextT = parseFloat(temp[ab.id + 1].temp);
        if (t <= prevT && t >= nextT) {
            return xScale(ab.timestamp) + 10
        }
        // right greater than left
        if (t >= prevT && t <= nextT) {
            return xScale(ab.timestamp) - 10
        }
        //default case
        return xScale(ab.timestamp)
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


    ///////////antibiotics
    const yAbLabel = ab => ab.name;
    const abColorInit = ab => {
        for (let i = 0; i < antibiotics.length; i++) {
            if (antibiotics[i].name === ab) {
                return antibiotics[i].color;
            }
        }
    }
    const abColor = ab => ab.color;
    const abFormat = ab => {
        for (let i = 0; i < antibiotics.length; i++) {
            if (antibiotics[i].name === ab) {
                return antibiotics[i].abbrev;
            }
        }
    }//ab.toUpperCase().substring(0, 3);

    const yAbScale = d3.scaleBand()
        .domain(antibiotics.map(yAbLabel))
        .range([0, innerHeight]);
    const yAbAxis = d3.axisLeft(yAbScale);
    if (drawAb) {
        // append yAbAxis
        svg.append('g')
            .attr('class', 'yAbAxis')
            .call(yAbAxis.tickFormat(abFormat))
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-2em')
            .attr('x', '0')
            .attr('font-weight', '700')
            .style('text-anchor', 'middle');
        d3.selectAll('.yAbAxis .tick line')
            .remove();

        // append abColorAxis
        svg.selectAll('.color-label').data(ab_set).enter()
            .append('rect')
            .attr('class', 'color-label')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('x', -30)
            .attr('y', ab => yAbScale(ab))
            .attr('width', 30)
            .attr('height', yAbScale.bandwidth())
            .style('fill', ab => abColorInit(ab))

        // render antibiotics
        chart.selectAll('.antibiotic').data(antibiotics).enter()
            .append('rect')
            .attr('class', 'antibiotic')
            .attr('y', ab => yAbScale(yAbLabel(ab)))
            .attr('x', ab => xScale(ab.timestamps.begin))
            .attr('rx', 5)
            .attr('width', ab => xScale(ab.timestamps.end) - xScale(ab.timestamps.begin))
            .attr('height', yAbScale.bandwidth())
            .style('fill', ab => abColor(ab));
    }

    //////// display temperature block
    if (drawTemp.curve) {
        yTempAxis
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yTempScale).tickFormat(tempFormat))
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-.8em')
            .attr('dx', '1em')
            .style('text-anchor', 'middle');

        tempChunks.forEach((chunk) => {
            chart.append('path')
                .attr('class', `temp_curve_${chunk[0].timestamp}`)
                .attr('d', tempPathGen(chunk))
                .style('fill', 'none')
                .style('stroke', 'black')
                .style('opacity', 0.5)
                .style('stroke-width', '2');
        })
        if (drawTemp.dots) {
            chart.selectAll(".dot")
                .data(temp)
                .enter().append("circle")
                .attr("class", "dot")
                .attr('id', (d, i) => (i))
                .attr("cx", d => xScale(d.timestamp))
                .attr("cy", d => yTempScale(d.temp))
                .attr("r", 3);
        }
        if (drawTemp.labels) {
            chart.selectAll(".temptext")
                .data(temp)
                .enter().append("text")
                .attr('class', 'temptext')
                .text(d => parseFloat(d.temp).toFixed(1))
                .attr("text-anchor", "middle")
                .attr("x", d => tempLabelX(d))
                .attr("y", d => tempLabelY(d))
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black");
        }
    }

    function updateChart() {
        // return
        const extent = d3.event.selection;
        // get treatment days brushed by user
        const domain_min = mapNumber(extent[0], 0, innerWidth, admission_timestamp, discharge_timestamp);
        const domain_max = mapNumber(extent[1], 0, innerWidth, admission_timestamp, discharge_timestamp);

        // reset and rescale xAxis
        xScale.domain([domain_min, domain_max]);
        svg.select('.xAxis')
            .call(d3.axisBottom(xScale).tickFormat(dateFormat));

        //get antibiotics brushed by user
        const selected_ab = []
        for (let i = 0; i < antibiotics.length; i++) {
            if (antibiotics[i].timestamps.end >= domain_min && antibiotics[i].timestamps.begin <= domain_max) {
                selected_ab.push(antibiotics[i])
            }
        }
        const selected_ab_set = Array.from(new Set(selected_ab.map(ab => ab.name)));
        if (drawAb) {
            if(adjustAbScope){
                yAbScale.domain(selected_ab.map(yAbLabel));
                //redraw yAbAxis
                svg.select('.yAbAxis')
                    .call(yAbAxis.tickFormat(abFormat))
                    .selectAll('text')
                    .attr('x', '0')
                    .attr('transform', 'rotate(-90)')
                    .attr('dy', '-2em')
                    .attr('font-weight', '700')
                    .style('text-anchor', 'middle');
                d3.selectAll('.yAbAxis .tick line')
                    .remove();
            }

            //redraw abColorAxis
            if(adjustAbScope){
                const abColorLabels = svg.selectAll('.color-label').data(selected_ab_set);
                abColorLabels.exit().remove();
                abColorLabels.enter().append('rect')
                    .attr('class', 'color-label')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .attr('x', -30)
                    .attr('width', 30);
                abColorLabels
                    .attr('y', ab => yAbScale(ab))
                    .attr('height', yAbScale.bandwidth())
                    .style('fill', ab => abColorInit(ab))
            }

            // redraw antibiotics
            const abRender = chart.selectAll('.antibiotic').data(selected_ab);
            abRender.exit().remove();
            abRender.enter().append('rect')
                .attr('class', 'antibiotic');
            abRender
                .attr('class', 'antibiotic')
                .attr('y', ab => yAbScale(yAbLabel(ab)))
                .attr('x', ab => xScale(ab.timestamps.begin))
                .attr('rx', 5)
                .attr('width', ab => xScale(ab.timestamps.end) - xScale(ab.timestamps.begin))
                .attr('height', yAbScale.bandwidth())
                .style('fill', ab => abColor(ab));
        }

        if (drawTemp.curve) {
            //get temperature data brushed by user
            const selected_temp = []
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].timestamp >= domain_min && temp[i].timestamp <= domain_max) {
                    selected_temp.push(temp[i]['temp'])
                }
            }

            // get max/min from selected temperatures
            let max_t = Math.max(...selected_temp);
            max_t = (max_t + 1 > 42) ? 42.0 : max_t + 0.5;
            let min_t = Math.min(...selected_temp)
            min_t = (min_t - 1 < 35) ? 35.0 : min_t - 0.5;
            // reset and rescale temperature axis
            yTempScale.domain([max_t, min_t]);
            svg.select('.yTempAxis')
                .call(d3.axisLeft(yTempScale).tickFormat(tempFormat))
                .selectAll('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '-.8em')
                .attr('dx', '1em')
                .style('text-anchor', 'middle');

            // redraw temperature curve, dots and text
            if (drawTemp.dots) {
                chart.selectAll(".dot")
                    .attr("cx", d => xScale(d.timestamp))
                    .attr("cy", d => yTempScale(d.temp))
            }
            if (drawTemp.labels) {
                chart.selectAll(".temptext")
                    .attr("x", d => tempLabelX(d))
                    .attr("y", d => tempLabelY(d))
            }
            tempChunks.forEach((chunk) => {
                chart.selectAll(`.temp_curve_${chunk[0].timestamp}`)
                    .attr('d', tempPathGen(chunk))
            })
        }

        //redraw annotations
        svg.selectAll('.annotation').remove();
        // console.log(patient.additional_tests);
        let annotations = []
        add_tests_keys.map(key => {
            patient.additional_tests[key].forEach(test => {
                if (test.draw) {
                    if (!test.y) {
                        test.y = innerHeight + margin.top
                    }
                    let annotation = {};
                    annotation.id = test.id;
                    annotation.note = {};
                    annotation.color = "grey";
                    annotation.note.label_color = test.result_color;
                    annotation.note.label_font_size = test.result_font_size;
                    annotation.note.label_bold = test.result_bold;
                    annotation.note.title_color = test.title_color;
                    annotation.note.title_font_size = test.title_font_size;
                    annotation.note.title_bold = test.title_bold;
                    annotation.note.label = test.result;
                    annotation.note.title = key;
                    annotation.note.wrap = 250;
                    annotation.x = xScale(test.timestamp) + margin.left;
                    annotation.y = test.y;
                    annotation.dx = test.dx;
                    annotation.dy = test.dy;
                    annotation.connector = {};
                    annotation.connector.end = "arrow";
                    annotations.push(annotation);
                }
            })
        })

        // Add annotation to the chart
        const makeAnnotations = d3.annotation()
            .editMode(true)
            .annotations(annotations)
        svg
            .append("g")
            // .style('font-size', 10)
            .call(makeAnnotations)
        // .attr('transform', 'translate(100, 100)')

        d3_react_link(domain_min, domain_max);
    }

    //display general controls
    d3.select('.general_controls').style('display', 'inherit');

    //save to png
    const png_save_btn = d3.select('button.png_save');
    png_save_btn.on('click', function() {
        let svgString = getSVGString(svg.node());
        let viewport = new XMLSerializer().serializeToString(svg.node().querySelector('.navGroup'));
        viewport = viewport.replace('xmlns="http://www.w3.org/2000/svg" ', '');
        svgString = svgString.replace(viewport, '');
        svgString = svgString.replace(/(height=")[\d.]+"/, `height="${width * 0.52}"`)
        svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

        function save(dataBlob, filesize) {
            saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
        }
    });

    //remove annotation handlers
    const toggle_handlers = d3.select('.toggle-handlers');
    toggle_handlers.on('change', function() {
        if (this.checked) {
            svg.selectAll('.handle')
                .style('display', 'none');
        } else {
            svg.selectAll('.handle')
                .style('display', 'inherit');
        }
    })


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

    const x1 = viewport_start_timestamp ? xScale(viewport_start_timestamp) : xScale(admission_timestamp)
    const x2 = viewport_end_timestamp ? xScale(viewport_end_timestamp) : xScale(discharge_timestamp)

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

export default draw_graph_1;
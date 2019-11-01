import draw_circles from './circles.js';
import draw_circles2 from './circles2.js';

// set min brush width to avoid non-selecting temperature elements
//change brush event to brushing insted of end
// draw brush on start of script
// svg resize
// control panel

var margin = { top: 15, right: 40, bottom: 20, left: 80 };
var navSize = { height: 40, margin: 45 };
var width = window.innerWidth * 0.7;
var height = width * 0.52 + navSize.height + navSize.margin;
var innerHeight = height - margin.top - margin.bottom - navSize.height - navSize.margin;
var innerWidth = width - margin.left - margin.right;
var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

// maps number from in domain to out domain
var mapNumber = function mapNumber(number, in_min, in_max, out_min, out_max) {
    return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

var getValidDate = function getValidDate(date_string) {
    var date_chunks = date_string.split(".");
    var dateISO = date_chunks[2] + "-" + date_chunks[1] + "-" + date_chunks[0];
    return new Date(dateISO).getTime();
};

var draw_everything = function draw_everything(props) {
    var patient = props.patient;

    var admission_timestamp = getValidDate(patient.general_info.admission_date);
    var discharge_timestamp = getValidDate(patient.general_info.discharge_date);
    var dateFormat = function dateFormat(date) {
        var day = date.getDate();
        var month = months[date.getMonth(date)];
        return day + '-' + month;
    };

    d3.select('.graph > *').remove();
    d3.select('.graph').append('svg').attr('height', height).attr('width', width).attr('id', 'graph');

    var svg = d3.select('#graph');

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath").attr("id", "clip").append("svg:rect").attr("width", innerWidth).attr("height", innerHeight)
    //.attr('transform', `translate(0, ${margin.top})`) //IT SHOULD BE HERE!!! BUT WORKS WRONG WHEN UNCOMMENTED
    .attr("x", 0).attr("y", 0);

    var chart = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr('class', 'chart').attr("clip-path", "url(#clip)");

    var xScale = d3.scaleTime().domain([admission_timestamp, discharge_timestamp]).range([0, innerWidth]);

    var xAxis = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + (innerHeight + margin.top) + ')').attr('class', 'xAxis')
    //.call(xAxis.ticks(treatmentDuration));
    .call(d3.axisBottom(xScale).tickFormat(dateFormat));

    // add nav chart
    var navGroup = svg.append("g").attr("transform", 'translate(' + margin.left + ', ' + (innerHeight + margin.top + navSize.margin) + ')');

    // add nav background
    navGroup.append("rect").attr("x", 0).attr("y", 0).attr("width", innerWidth).attr("height", navSize.height).style("fill", "#F5F5F5").style("shape-rendering", "crispEdges").attr("transform", "translate(0, 0)");

    var xNavAxis = navGroup.append('g').attr('transform', 'translate(0, ' + navSize.height + ')').call(d3.axisBottom(xScale).tickFormat(dateFormat));

    var viewport = d3.brushX().extent([[0, 0], [innerWidth, navSize.height]])
    // .move(navGroup.select('.rrr'), [xScale(admission_timestamp), xScale(discharge_timestamp)])
    .on("end", updateChart);

    navGroup.append("g").attr("class", "brush").call(viewport);

    // let ticks = d3.selectAll(".xAxis text");
    // ticks.each(function(_, i) {
    //     if (i % 2 !== 0) d3.select(this).remove();
    // });


    //////// display temperature block
    //get temperature data
    var temp = Object.values(patient.temperature);
    console.log(temp);

    // let temp = Array.from({ length: treatmentDuration + 1 }, (v, k) => Math.random() * (42.0 - 35.0) + 35.0);

    // define max/min temeperatures to set proper temperature domain
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

    //temperature scale
    var yTempScale = d3.scaleLinear().domain([max_temp, min_temp]).range([0, innerHeight]);

    //create and append temperature axis
    var yTempAxis = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr('class', 'yTempAxis').call(d3.axisLeft(yTempScale).tickFormat(tempFormat)).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

    var lineGenerator = d3.line().x(function (d) {
        return xScale(d.timestamp);
    }).y(function (d) {
        return yTempScale(d.temp);
    }).curve(d3.curveMonotoneX);

    chart.append('path').attr('class', 'temp_curve').attr('d', lineGenerator(temp)).style('fill', 'none').style('stroke', 'black').style('stroke-width', '2');

    chart.selectAll(".dot").data(temp).enter().append("circle").attr("class", "dot").attr('id', function (d, i) {
        return i;
    }).attr("cx", function (d) {
        return xScale(d.timestamp);
    }).attr("cy", function (d) {
        return yTempScale(d.temp);
    }).attr("r", 4);

    chart.selectAll(".temptext").data(temp).enter().append("text").attr('class', 'temptext').text(function (d) {
        return parseFloat(d.temp).toFixed(1);
    }).attr("text-anchor", "middle").attr("x", function (d) {
        return xScale(d.timestamp) + 15;
    }).attr("y", function (d) {
        return yTempScale(d.temp) - 5;
    }).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "black");

    function updateChart() {
        var extent = d3.event.selection;
        // get treatment days brushed by user
        var domain_min = mapNumber(extent[0], 0, innerWidth, admission_timestamp, discharge_timestamp);
        var domain_max = mapNumber(extent[1], 0, innerWidth, admission_timestamp, discharge_timestamp);
        // reset and rescale xAxis
        xScale.domain([domain_min, domain_max]);
        svg.select('.xAxis').transition().duration(1000).call(d3.axisBottom(xScale).tickFormat(dateFormat));

        //get temperature data brushed by user
        var selected_temp = [];
        for (var i = 0; i <= temp.length - 1; i++) {
            if (temp[i].timestamp >= domain_min && temp[i].timestamp <= domain_max) {
                selected_temp.push(temp[i]['temp']);
            }
        }
        console.log(selected_temp);

        // get max/min from selected temperatures
        var max_t = Math.max.apply(Math, selected_temp);
        max_t = max_t + 1 > 42 ? 42.0 : max_t + 0.5;
        var min_t = Math.min.apply(Math, selected_temp);
        min_t = min_t - 1 < 35 ? 35.0 : min_t - 0.5;
        // reset and rescale temperature axis
        yTempScale.domain([max_t, min_t]);
        svg.select('.yTempAxis').transition().duration(1000).call(d3.axisLeft(yTempScale).tickFormat(tempFormat));

        // redraw temperature curve, dots and text
        chart.selectAll(".dot").transition().duration(550).attr("cx", function (d) {
            return xScale(d.timestamp);
        }).attr("cy", function (d) {
            return yTempScale(d.temp);
        });
        chart.selectAll(".temptext").transition().duration(700).attr("x", function (d) {
            return xScale(d.timestamp) + 15;
        }).attr("y", function (d) {
            return yTempScale(d.temp) - 5;
        });
        chart.selectAll(".temp_curve").transition().duration(500).attr('d', lineGenerator(temp));

        // console.log(min_t);
        // console.log(max_t);
    }
};

export default draw_everything;
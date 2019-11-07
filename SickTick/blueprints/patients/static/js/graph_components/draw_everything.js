// set min brush width to avoid non-selecting temperature elements
// change brush event to brushing insted of end
// svg resize
// remove last tick in xAxis

import getSVGString from '../controller_components/getSVGString.js';
import svgString2Image from '../controller_components/svgString2Image.js';
import d3_react_link from '../controller_components/d3-react-link.js';

var margin = { top: 15, right: 40, bottom: 20, left: 80 };
var navSize = { height: 30, margin: 45 };
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
    // console.log(props)
    var _props$graphData = props.graphData,
        patient = _props$graphData.patient,
        drawTemp = _props$graphData.drawTemp,
        drawAb = _props$graphData.drawAb,
        viewport_start = _props$graphData.viewport_start,
        viewport_end = _props$graphData.viewport_end;

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
    .call(d3.axisBottom(xScale)
    // .ticks(d3.timeDay.every(1))
    .tickFormat(dateFormat));

    // let ticks = d3.selectAll(".xAxis text");
    // ticks.each(function(_, i) {
    //     if (i % 2 !== 0) d3.select(this).remove();
    // });

    //get data to draw
    var temp = Object.values(patient.temperature);
    // console.log(temp)
    var tempChunks = [];
    var chunk = [temp[0]];
    for (var i = 1; i < temp.length; i++) {
        if (temp[i].timestamp - temp[i - 1].timestamp <= 86400000) {
            chunk.push(temp[i]);
        } else {
            tempChunks.push(chunk);
            chunk = [temp[i]];
        }
        if (i === temp.length - 1) {
            tempChunks.push(chunk);
        }
    }

    // let temp = Array.from({ length: treatmentDuration + 1 }, (v, k) => Math.random() * (42.0 - 35.0) + 35.0);
    var antibiotics = patient.antibiotics;
    var ab_set = Array.from(new Set(antibiotics.map(function (ab) {
        return ab.name;
    })));

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

    // temperature y scale
    var yTempScale = d3.scaleLinear().domain([max_temp, min_temp]).range([0, innerHeight]);
    // create y temperature axis
    var yTempAxis = svg.append('g').attr('class', 'yTempAxis');
    // create temperature path generator
    var tempPathGen = d3.line().x(function (d) {
        return xScale(d.timestamp);
    }).y(function (d) {
        return yTempScale(d.temp);
    }).curve(d3.curveMonotoneX);

    ///////////antibiotics
    var yAbLabel = function yAbLabel(ab) {
        return ab.name;
    };
    var abColorInit = function abColorInit(ab) {
        for (var _i = 0; _i < antibiotics.length; _i++) {
            if (antibiotics[_i].name === ab) {
                return antibiotics[_i].color;
            }
        }
    };
    var abColor = function abColor(ab) {
        return ab.color;
    };
    var abFormat = function abFormat(ab) {
        return ab.toUpperCase().substring(0, 3);
    };

    var yAbScale = d3.scaleBand().domain(antibiotics.map(yAbLabel)).range([0, innerHeight]);
    var yAbAxis = d3.axisLeft(yAbScale);
    if (drawAb) {
        // append yAbAxis
        svg.append('g').attr('class', 'yAbAxis').call(yAbAxis.tickFormat(abFormat)).attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-2em').attr('x', '0').attr('font-weight', '700').style('text-anchor', 'middle');
        d3.selectAll('.yAbAxis .tick line').remove();

        // append abColorAxis
        svg.selectAll('.color-label').data(ab_set).enter().append('rect').attr('class', 'color-label').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr('x', -30).attr('y', function (ab) {
            return yAbScale(ab);
        }).attr('width', 30).attr('height', yAbScale.bandwidth()).style('fill', function (ab) {
            return abColorInit(ab);
        });

        // render antibiotics
        chart.selectAll('.antibiotic').data(antibiotics).enter().append('rect').attr('class', 'antibiotic').attr('y', function (ab) {
            return yAbScale(yAbLabel(ab));
        }).attr('x', function (ab) {
            return xScale(ab.timestamps.begin);
        }).attr('rx', 5).attr('width', function (ab) {
            return xScale(ab.timestamps.end) - xScale(ab.timestamps.begin);
        }).attr('height', yAbScale.bandwidth()).style('fill', function (ab) {
            return abColor(ab);
        });
    }

    //////// display temperature block
    if (drawTemp) {
        yTempAxis.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').call(d3.axisLeft(yTempScale).tickFormat(tempFormat)).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

        tempChunks.forEach(function (chunk) {
            chart.append('path').attr('class', 'temp_curve_' + chunk[0].timestamp).attr('d', tempPathGen(chunk)).style('fill', 'none').style('stroke', 'black').style('stroke-width', '2');
        });

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
    }

    function updateChart() {
        // return
        var extent = d3.event.selection;
        // get treatment days brushed by user
        var domain_min = mapNumber(extent[0], 0, innerWidth, admission_timestamp, discharge_timestamp);
        var domain_max = mapNumber(extent[1], 0, innerWidth, admission_timestamp, discharge_timestamp);
        // reset and rescale xAxis
        xScale.domain([domain_min, domain_max]);
        svg.select('.xAxis').transition() //.duration(1000)
        .call(d3.axisBottom(xScale).tickFormat(dateFormat));

        //get antibiotics brushed by user
        var selected_ab = [];
        for (var _i2 = 0; _i2 < antibiotics.length; _i2++) {
            if (antibiotics[_i2].timestamps.end >= domain_min && antibiotics[_i2].timestamps.begin <= domain_max) {
                selected_ab.push(antibiotics[_i2]);
            }
        }
        var selected_ab_set = Array.from(new Set(selected_ab.map(function (ab) {
            return ab.name;
        })));
        // let selected_ab_set = Array.from(new Set(selected_ab.map(ab => ab.name)));
        if (drawAb) {
            yAbScale.domain(selected_ab.map(yAbLabel));
            //redraw yAbAxis
            svg.select('.yAbAxis').transition() //.duration(1000)
            .call(yAbAxis.tickFormat(abFormat)).selectAll('text').attr('x', '0').attr('transform', 'rotate(-90)').attr('dy', '-2em').attr('font-weight', '700').style('text-anchor', 'middle');
            d3.selectAll('.yAbAxis .tick line').remove();

            //redraw abColorAxis
            var abColorLabels = svg.selectAll('.color-label').data(selected_ab_set);
            abColorLabels.exit().remove();
            abColorLabels.enter().append('rect').attr('class', 'color-label').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr('x', -30).attr('width', 30);
            abColorLabels.transition().attr('y', function (ab) {
                return yAbScale(ab);
            }).attr('height', yAbScale.bandwidth()).style('fill', function (ab) {
                return abColorInit(ab);
            });

            // redraw antibiotics
            var abRender = chart.selectAll('.antibiotic').data(selected_ab);
            abRender.exit().remove();
            abRender.enter().append('rect').attr('class', 'antibiotic');
            abRender.attr('class', 'antibiotic').attr('y', function (ab) {
                return yAbScale(yAbLabel(ab));
            }).attr('x', function (ab) {
                return xScale(ab.timestamps.begin);
            }).attr('rx', 5).attr('width', function (ab) {
                return xScale(ab.timestamps.end) - xScale(ab.timestamps.begin);
            }).attr('height', yAbScale.bandwidth()).style('fill', function (ab) {
                return abColor(ab);
            });
        }

        if (drawTemp) {
            //get temperature data brushed by user
            var selected_temp = [];
            for (var _i3 = 0; _i3 < temp.length; _i3++) {
                if (temp[_i3].timestamp >= domain_min && temp[_i3].timestamp <= domain_max) {
                    selected_temp.push(temp[_i3]['temp']);
                }
            }

            // get max/min from selected temperatures
            var max_t = Math.max.apply(Math, selected_temp);
            max_t = max_t + 1 > 42 ? 42.0 : max_t + 0.5;
            var min_t = Math.min.apply(Math, selected_temp);
            min_t = min_t - 1 < 35 ? 35.0 : min_t - 0.5;
            // reset and rescale temperature axis
            yTempScale.domain([max_t, min_t]);
            svg.select('.yTempAxis').transition() //.duration(1000)
            .call(d3.axisLeft(yTempScale).tickFormat(tempFormat)).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

            // redraw temperature curve, dots and text
            chart.selectAll(".dot").transition() //.duration(300)
            .attr("cx", function (d) {
                return xScale(d.timestamp);
            }).attr("cy", function (d) {
                return yTempScale(d.temp);
            });
            chart.selectAll(".temptext").transition() //.duration(250)
            .attr("x", function (d) {
                return xScale(d.timestamp) + 15;
            }).attr("y", function (d) {
                return yTempScale(d.temp) - 5;
            });
            tempChunks.forEach(function (chunk) {
                chart.selectAll('.temp_curve_' + chunk[0].timestamp).transition() //.duration(350)
                .attr('d', tempPathGen(chunk));
            });
        }
        d3_react_link();
    }

    //save to png
    var png_save_btn = d3.select('button.png_save');
    png_save_btn.on('click', function () {
        var svgString = getSVGString(svg.node());
        var viewport = new XMLSerializer().serializeToString(svg.node().querySelector('.navGroup'));
        viewport = viewport.replace('xmlns="http://www.w3.org/2000/svg" ', '');
        svgString = svgString.replace(viewport, '');
        svgString = svgString.replace(/(height=")[\d.]+"/, 'height="' + width * 0.52 + '"');
        svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

        function save(dataBlob, filesize) {
            saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
        }
    });

    // add nav chart
    var navGroup = svg.append("g").attr("transform", 'translate(' + margin.left + ', ' + (innerHeight + margin.top + navSize.margin) + ')').attr('class', 'navGroup');
    // add nav background
    navGroup.append("rect").attr("x", 0).attr("y", 0).attr("width", innerWidth).attr("height", navSize.height).style("fill", "#F5F5F5").style("shape-rendering", "crispEdges").attr("transform", "translate(0, 0)");
    // add nav xAxis
    var xNavAxis = navGroup.append('g').attr('transform', 'translate(0, ' + navSize.height + ')').call(d3.axisBottom(xScale).tickFormat(dateFormat));

    var viewport = d3.brushX().extent([[0, 0], [innerWidth, navSize.height]]).on("brush", updateChart);

    var x1 = viewport_start ? viewport_start : xScale(admission_timestamp);
    var x2 = viewport_end ? viewport_end : xScale(discharge_timestamp);

    var brushSelection = navGroup.selectAll('.brush').data([viewport]);
    brushSelection.enter().insert('g', '.brush').attr('class', 'brush').each(function (brushObj) {
        // this init's the brush
        brushObj(d3.select(this));
        brushObj.move(d3.select(this), [x1, x2]);
    });
};

export default draw_everything;
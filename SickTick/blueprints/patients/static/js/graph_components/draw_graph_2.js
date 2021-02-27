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

var draw_graph_2 = function draw_graph_2(props) {
    // console.log(props)
    var _props$graphData = props.graphData,
        patient = _props$graphData.patient,
        drawTemp = _props$graphData.drawTemp,
        drawAb = _props$graphData.drawAb,
        adjustAbScope = _props$graphData.adjustAbScope,
        viewport_start_timestamp = _props$graphData.viewport_start_timestamp,
        viewport_end_timestamp = _props$graphData.viewport_end_timestamp,
        additional_tests = _props$graphData.additional_tests,
        draw_annotations = _props$graphData.draw_annotations,
        unique_antibiotics_order = _props$graphData.unique_antibiotics_order;


    var add_tests_keys = Object.keys(props.graphData.patient.additional_tests);
    var admission_timestamp = props.graphData.patient.general_info.admission_timestamp;
    var discharge_timestamp = props.graphData.patient.general_info.discharge_timestamp;

    var dateFormat = function dateFormat(date) {
        var day = date.getDate();
        var month = months[date.getMonth(date)];
        return day + '-' + month;
    };

    d3.select('.app__graph-2 .graph > *').remove();
    d3.select('.app__graph-2 .graph').append('svg').attr('height', height).attr('width', width).attr('id', 'graph_2');

    var svg = d3.select('#graph_2');

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

    //get antibiotics selected to be drawn while preserving theirs order
    var antibiotics = [];
    for (var j = 0; j < unique_antibiotics_order.length; j++) {
        for (var _i = 0; _i < patient.antibiotics.length; _i++) {
            if (patient.antibiotics[_i].draw && unique_antibiotics_order[j] === patient.antibiotics[_i].name) {
                antibiotics.push(patient.antibiotics[_i]);
            }
        }
    }
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

    // set correct y position of temperature label
    var tempLabelY = function tempLabelY(ab) {
        var t = parseFloat(ab.temp);
        // first element
        if (ab.id === 0) {
            if (t <= parseFloat(temp[1].temp)) return yTempScale(t) + 12;else return yTempScale(t) - 5;
        }
        // last element
        if (ab.id === temp.length - 1) {
            if (t <= parseFloat(temp[temp.length - 2].temp)) return yTempScale(t) + 12;else return yTempScale(t) - 5;
        }
        // another elements
        var prevT = parseFloat(temp[ab.id - 1].temp);
        var nextT = parseFloat(temp[ab.id + 1].temp);
        //if both less
        if (t <= prevT && t <= nextT) {
            return yTempScale(t) + 12;
        }
        //if both greater
        if (t >= prevT && t >= nextT) {
            return yTempScale(t) - 5;
        }
        // one greater than other
        return yTempScale(t) - 5;
    };

    // set correct x position of temperature label
    var tempLabelX = function tempLabelX(ab) {
        var t = parseFloat(ab.temp);
        // first element
        if (ab.id === 0 || ab.id === temp.length - 1) {
            return xScale(ab.timestamp);
        }
        // left greater than right
        var prevT = parseFloat(temp[ab.id - 1].temp);
        var nextT = parseFloat(temp[ab.id + 1].temp);
        if (t <= prevT && t >= nextT) {
            return xScale(ab.timestamp) + 10;
        }
        // right greater than left
        if (t >= prevT && t <= nextT) {
            return xScale(ab.timestamp) - 10;
        }
        //default case
        return xScale(ab.timestamp);
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
        for (var _i2 = 0; _i2 < antibiotics.length; _i2++) {
            if (antibiotics[_i2].name === ab) {
                return antibiotics[_i2].color;
            }
        }
    };
    var abColor = function abColor(ab) {
        return ab.color;
    };
    var abFormat = function abFormat(ab) {
        for (var _i3 = 0; _i3 < antibiotics.length; _i3++) {
            if (antibiotics[_i3].name === ab) {
                return antibiotics[_i3].abbrev;
            }
        }
    }; //ab.toUpperCase().substring(0, 3);

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
    if (drawTemp.curve) {
        yTempAxis.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').call(d3.axisLeft(yTempScale).tickFormat(tempFormat)).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

        tempChunks.forEach(function (chunk) {
            chart.append('path').attr('class', 'temp_curve_' + chunk[0].timestamp).attr('d', tempPathGen(chunk)).style('fill', 'none').style('stroke', 'black').style('opacity', 0.5).style('stroke-width', '2');
        });
        if (drawTemp.dots) {
            chart.selectAll(".dot").data(temp).enter().append("circle").attr("class", "dot").attr('id', function (d, i) {
                return i;
            }).attr("cx", function (d) {
                return xScale(d.timestamp);
            }).attr("cy", function (d) {
                return yTempScale(d.temp);
            }).attr("r", 3);
        }
        if (drawTemp.labels) {
            chart.selectAll(".temptext").data(temp).enter().append("text").attr('class', 'temptext').text(function (d) {
                return parseFloat(d.temp).toFixed(1);
            }).attr("text-anchor", "middle").attr("x", function (d) {
                return tempLabelX(d);
            }).attr("y", function (d) {
                return tempLabelY(d);
            }).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "black");
        }
    }

    function updateChart() {
        // return
        var extent = d3.event.selection;
        // get treatment days brushed by user
        var domain_min = mapNumber(extent[0], 0, innerWidth, admission_timestamp, discharge_timestamp);
        var domain_max = mapNumber(extent[1], 0, innerWidth, admission_timestamp, discharge_timestamp);

        // reset and rescale xAxis
        xScale.domain([domain_min, domain_max]);
        svg.select('.xAxis').call(d3.axisBottom(xScale).tickFormat(dateFormat));

        //get antibiotics brushed by user
        var selected_ab = [];
        for (var _i4 = 0; _i4 < antibiotics.length; _i4++) {
            if (antibiotics[_i4].timestamps.end >= domain_min && antibiotics[_i4].timestamps.begin <= domain_max) {
                selected_ab.push(antibiotics[_i4]);
            }
        }
        var selected_ab_set = Array.from(new Set(selected_ab.map(function (ab) {
            return ab.name;
        })));
        if (drawAb) {
            if (adjustAbScope) {
                yAbScale.domain(selected_ab.map(yAbLabel));
                //redraw yAbAxis
                svg.select('.yAbAxis').call(yAbAxis.tickFormat(abFormat)).selectAll('text').attr('x', '0').attr('transform', 'rotate(-90)').attr('dy', '-2em').attr('font-weight', '700').style('text-anchor', 'middle');
                d3.selectAll('.yAbAxis .tick line').remove();
            }

            //redraw abColorAxis
            if (adjustAbScope) {
                var abColorLabels = svg.selectAll('.color-label').data(selected_ab_set);
                abColorLabels.exit().remove();
                abColorLabels.enter().append('rect').attr('class', 'color-label').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').attr('x', -30).attr('width', 30);
                abColorLabels.attr('y', function (ab) {
                    return yAbScale(ab);
                }).attr('height', yAbScale.bandwidth()).style('fill', function (ab) {
                    return abColorInit(ab);
                });
            }

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

        if (drawTemp.curve) {
            //get temperature data brushed by user
            var selected_temp = [];
            for (var _i5 = 0; _i5 < temp.length; _i5++) {
                if (temp[_i5].timestamp >= domain_min && temp[_i5].timestamp <= domain_max) {
                    selected_temp.push(temp[_i5]['temp']);
                }
            }

            // get max/min from selected temperatures
            var max_t = Math.max.apply(Math, selected_temp);
            max_t = max_t + 1 > 42 ? 42.0 : max_t + 0.5;
            var min_t = Math.min.apply(Math, selected_temp);
            min_t = min_t - 1 < 35 ? 35.0 : min_t - 0.5;
            // reset and rescale temperature axis
            yTempScale.domain([max_t, min_t]);
            svg.select('.yTempAxis').call(d3.axisLeft(yTempScale).tickFormat(tempFormat)).selectAll('text').attr('transform', 'rotate(-90)').attr('dy', '-.8em').attr('dx', '1em').style('text-anchor', 'middle');

            // redraw temperature curve, dots and text
            if (drawTemp.dots) {
                chart.selectAll(".dot").attr("cx", function (d) {
                    return xScale(d.timestamp);
                }).attr("cy", function (d) {
                    return yTempScale(d.temp);
                });
            }
            if (drawTemp.labels) {
                chart.selectAll(".temptext").attr("x", function (d) {
                    return tempLabelX(d);
                }).attr("y", function (d) {
                    return tempLabelY(d);
                });
            }
            tempChunks.forEach(function (chunk) {
                chart.selectAll('.temp_curve_' + chunk[0].timestamp).attr('d', tempPathGen(chunk));
            });
        }

        //redraw annotations
        svg.selectAll('.annotation').remove();
        // console.log(patient.additional_tests);
        var annotations = [];
        add_tests_keys.map(function (key) {
            patient.additional_tests[key].forEach(function (test) {
                if (test.draw) {
                    if (!test.y) {
                        test.y = innerHeight + margin.top;
                    }
                    var annotation = {};
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
            });
        });

        // Add annotation to the chart
        var makeAnnotations = d3.annotation().editMode(true).annotations(annotations);
        svg.append("g")
        // .style('font-size', 10)
        .call(makeAnnotations);
        // .attr('transform', 'translate(100, 100)')

        d3_react_link(domain_min, domain_max);
    }

    //display general controls
    d3.select('.general_controls').style('display', 'inherit');

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

    //remove annotation handlers
    var toggle_handlers = d3.select('.toggle-handlers');
    toggle_handlers.on('change', function () {
        if (this.checked) {
            svg.selectAll('.handle').style('display', 'none');
        } else {
            svg.selectAll('.handle').style('display', 'inherit');
        }
    });

    // add nav chart
    var navGroup = svg.append("g").attr("transform", 'translate(' + margin.left + ', ' + (innerHeight + margin.top + navSize.margin) + ')').attr('class', 'navGroup');
    // add nav background
    navGroup.append("rect").attr("x", 0).attr("y", 0).attr("width", innerWidth).attr("height", navSize.height).style("fill", "#F5F5F5").style("shape-rendering", "crispEdges").attr("transform", "translate(0, 0)");
    // add nav xAxis
    var xNavAxis = navGroup.append('g').attr('transform', 'translate(0, ' + navSize.height + ')').call(d3.axisBottom(xScale).tickFormat(dateFormat));

    var viewport = d3.brushX().extent([[0, 0], [innerWidth, navSize.height]]).on("brush", updateChart);

    var x1 = viewport_start_timestamp ? xScale(viewport_start_timestamp) : xScale(admission_timestamp);
    var x2 = viewport_end_timestamp ? xScale(viewport_end_timestamp) : xScale(discharge_timestamp);

    var brushSelection = navGroup.selectAll('.brush').data([viewport]);
    brushSelection.enter().insert('g', '.brush').attr('class', 'brush').each(function (brushObj) {
        // this init's the brush
        brushObj(d3.select(this));
        brushObj.move(d3.select(this), [x1, x2]);
    });
};

export default draw_graph_2;
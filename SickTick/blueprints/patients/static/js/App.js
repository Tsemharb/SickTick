var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Clock from './Clock.js';
import Graph from './Graph.js';
import General_info from './General_info.js';
import Temp_controller from './controller_components/Temp_controller.js';
import Ab_controller from './controller_components/Ab_controller.js';
import CBC_controller from './controller_components/CBC_controller.js';
import Add_tests_controller from './controller_components/Add_tests_controller.js';
import path from './path.js';

var DragDropContext = window.ReactBeautifulDnd.DragDropContext;

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.toggleTemp = function (e) {
            var drawTemp = _this.state.drawTemp;
            switch (e.target.id) {
                case "showTemp":
                    drawTemp.curve = !drawTemp.curve;
                    break;
                case "showDots":
                    drawTemp.dots = !drawTemp.dots;
                    break;
                case "showLabels":
                    drawTemp.labels = !drawTemp.labels;
            }
            _this.setState({ drawTemp: drawTemp, update: true });
        };

        _this.toggleAb = function () {
            return _this.setState({ drawAb: !_this.state.drawAb, update: true });
        };

        _this.toggleSingleAb = function (e) {
            // console.log(this.state.patient.antibiotics);
            var data = _this.state.patient;
            for (var i = 0; i < data.antibiotics.length; i++) {
                if (data.antibiotics[i].name == e.target.id) {
                    data.antibiotics[i].draw = e.target.checked;
                }
            }
            _this.setState({ patient: data, update: true });
        };

        _this.toggleAbScope = function () {
            return _this.setState({ adjustAbScope: !_this.state.adjustAbScope, update: true });
        };

        _this.setAbAbbrev = function (e) {
            var data = _this.state.patient;
            for (var i = 0; i < data.antibiotics.length; i++) {
                if (data.antibiotics[i].name == e.target.id) {
                    data.antibiotics[i].abbrev = e.target.value;
                }
            }
            _this.setState({ patient: data, update: true });
        };

        _this.onDragEnd = function (result) {
            var source = result.source,
                destination = result.destination,
                draggableId = result.draggableId;


            if (!destination) {
                return;
            }

            if (destination.droppableId === source.droppableId && destination.index === source.index) {
                return;
            }

            var new_order = _this.state.unique_antibiotics_order;
            new_order.splice(source.index, 1);
            new_order.splice(destination.index, 0, draggableId);
            _this.setState({ unique_antibiotics_order: new_order, update: true });
        };

        _this.toggleCBC = function () {
            return _this.setState({ drawCBC: !_this.state.drawCBC, update: true });
        };

        _this.toggleCBCComponent = function () {
            return console.log('toggle');
        };

        _this.updateAdditionalTestResult = function (id, updatedResult) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(data.additional_tests)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id === id) {
                            data.additional_tests[key][i].result = updatedResult;
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };

        _this.resetInitialTestPosition = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.entries(data.additional_tests)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = _slicedToArray(_ref3, 2);

                    var key = _ref4[0];
                    var value = _ref4[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-reset" === e.target.id) {
                            data.additional_tests[key][i].timestamp = data.additional_tests[key][i].timestamp_init;
                            data.additional_tests[key][i].y = null;
                            data.additional_tests[key][i].dx = 60;
                            data.additional_tests[key][i].dy = -60;
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        };

        _this.increaseResultFontSize = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.entries(data.additional_tests)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ref5 = _step3.value;

                    var _ref6 = _slicedToArray(_ref5, 2);

                    var key = _ref6[0];
                    var value = _ref6[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-increase-result-font" === e.target.id) {
                            data.additional_tests[key][i].result_font_size = ++data.additional_tests[key][i].result_font_size;
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        };

        _this.decreaseResultFontSize = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.entries(data.additional_tests)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _ref7 = _step4.value;

                    var _ref8 = _slicedToArray(_ref7, 2);

                    var key = _ref8[0];
                    var value = _ref8[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-decrease-result-font" === e.target.id) {
                            if (data.additional_tests[key][i].result_font_size > 7) {
                                data.additional_tests[key][i].result_font_size = --data.additional_tests[key][i].result_font_size;
                                _this.setState({ patient: data, update: true });
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        };

        _this.increaseTitleFontSize = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = Object.entries(data.additional_tests)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _ref9 = _step5.value;

                    var _ref10 = _slicedToArray(_ref9, 2);

                    var key = _ref10[0];
                    var value = _ref10[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-increase-title-font" === e.target.id) {
                            data.additional_tests[key][i].title_font_size = ++data.additional_tests[key][i].title_font_size;
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        };

        _this.decreaseTitleFontSize = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = Object.entries(data.additional_tests)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _ref11 = _step6.value;

                    var _ref12 = _slicedToArray(_ref11, 2);

                    var key = _ref12[0];
                    var value = _ref12[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-decrease-title-font" === e.target.id) {
                            if (data.additional_tests[key][i].title_font_size > 8) {
                                data.additional_tests[key][i].title_font_size = --data.additional_tests[key][i].title_font_size;
                                _this.setState({ patient: data, update: true });
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        };

        _this.setTitleColor = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = Object.entries(data.additional_tests)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _ref13 = _step7.value;

                    var _ref14 = _slicedToArray(_ref13, 2);

                    var key = _ref14[0];
                    var value = _ref14[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-title-color" === e.target.id) {
                            data.additional_tests[key][i].title_color = e.target.style.cssText.split(' ')[1].slice(0, -1);
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        };

        _this.setResultTextColor = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = Object.entries(data.additional_tests)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _ref15 = _step8.value;

                    var _ref16 = _slicedToArray(_ref15, 2);

                    var key = _ref16[0];
                    var value = _ref16[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-result-text-color" === e.target.id) {
                            data.additional_tests[key][i].result_color = e.target.style.cssText.split(' ')[1].slice(0, -1);
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        };

        _this.toggleSingleAddTest = function (e) {
            var data = _this.state.patient;
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = Object.entries(data.additional_tests)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var _ref17 = _step9.value;

                    var _ref18 = _slicedToArray(_ref17, 2);

                    var key = _ref18[0];
                    var value = _ref18[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id + "-checkbox" === e.target.id) {
                            data.additional_tests[key][i].draw = e.target.checked;
                            _this.setState({ patient: data, update: true });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }
        };

        _this.handleViewportPosition = function (e) {
            e.target.id === 'viewport_x1' ? _this.setState({ viewport_start_timestamp: parseInt(e.target.value), update: false }) : _this.setState({ viewport_end_timestamp: parseInt(e.target.value), update: false });
        };

        _this.updateAnnotationCoords = function () {
            var add_tests_keys = Object.keys(_this.state.patient.additional_tests);
            var id = document.querySelector('#annotation-id').value;
            var x = parseInt(document.querySelector('#annotation-x').value);
            var y = parseInt(document.querySelector('#annotation-y').value);
            var dx = parseInt(document.querySelector('#annotation-dx').value);
            var dy = parseInt(document.querySelector('#annotation-dy').value);
            var width = parseFloat(document.querySelector('#www').value);
            var timestamp = (x - 80 - 0) * (_this.state.viewport_end_timestamp - _this.state.viewport_start_timestamp) / (width - 0) + _this.state.viewport_start_timestamp;
            var data = _this.state.patient;
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = Object.entries(data.additional_tests)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var _ref19 = _step10.value;

                    var _ref20 = _slicedToArray(_ref19, 2);

                    var key = _ref20[0];
                    var value = _ref20[1];

                    for (var i = 0; i < value.length; i++) {
                        if (value[i].id === id) {
                            data.additional_tests[key][i].timestamp = timestamp;
                            data.additional_tests[key][i].y = y;
                            data.additional_tests[key][i].dx = dx;
                            data.additional_tests[key][i].dy = dy;
                            _this.setState({ patient: data, update: false });
                        }
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }
        };

        _this.state = {
            isLoaded: false,
            drawGraph: false,
            update: true,
            patient: {}
        };
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var location = window.location.href;
            var patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
            fetch(path + patient_id).then(function (response) {
                return response.json().then(function (data) {
                    _this2.setState({
                        isLoaded: true,
                        drawGraph: false,
                        update: true,
                        drawTemp: { curve: true, dots: true, labels: true },
                        drawAb: true,
                        drawCBC: true,
                        adjustAbScope: true,
                        draw_annotations: true,
                        patient: data,
                        unique_antibiotics_order: Array.from(new Set(data.antibiotics.map(function (item) {
                            return item.name;
                        })))
                    });
                });
            });
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return nextState.update;
        }

        // edit additional test result


        // set new coordinates for annotation so that on rerender it will take up relevant position

    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                isLoaded = _state.isLoaded,
                drawGraph = _state.drawGraph,
                drawTemp = _state.drawTemp,
                drawAb = _state.drawAb,
                patient = _state.patient,
                viewport_start_timestamp = _state.viewport_start_timestamp,
                viewport_end_timestamp = _state.viewport_end_timestamp,
                draw_annotations = _state.draw_annotations,
                unique_antibiotics_order = _state.unique_antibiotics_order,
                adjustAbScope = _state.adjustAbScope;


            if (!isLoaded) {
                return React.createElement(
                    'div',
                    null,
                    ' loading... '
                );
            } else if (patient.is_error) {
                return React.createElement(
                    'div',
                    null,
                    patient.errors.map(function (error) {
                        return React.createElement(
                            'div',
                            null,
                            error
                        );
                    })
                );
            } else {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(Clock, null),
                    React.createElement('hr', null),
                    React.createElement(General_info, { info: patient }),
                    React.createElement(
                        'div',
                        { className: 'app' },
                        React.createElement(
                            'div',
                            { className: 'app__graph' },
                            React.createElement(Graph, { graphData: { patient: patient, drawTemp: drawTemp, drawAb: drawAb, adjustAbScope: adjustAbScope, viewport_start_timestamp: viewport_start_timestamp, viewport_end_timestamp: viewport_end_timestamp,
                                    draw_annotations: draw_annotations, unique_antibiotics_order: unique_antibiotics_order } })
                        ),
                        React.createElement(
                            'div',
                            { className: 'app__control-panel' },
                            isLoaded ? React.createElement(
                                'div',
                                null,
                                React.createElement(Temp_controller, { temp: patient.temperature,
                                    drawTemp: this.state.drawTemp,
                                    toggleTemp: this.toggleTemp }),
                                React.createElement(CBC_controller, { cbc_results: patient.cbc,
                                    drawCBC: this.state.drawCBC,
                                    toggleCBC: this.toggleCBC,
                                    toggleCBCComponent: this.toggleCBCComponent }),
                                React.createElement(
                                    DragDropContext,
                                    { onDragEnd: this.onDragEnd },
                                    React.createElement(Ab_controller, { antibiotics: patient.antibiotics,
                                        unique_ab_order: this.state.unique_antibiotics_order,
                                        drawAb: this.state.drawAb,
                                        adjustAbScope: this.state.adjustAbScope,
                                        toggleAbScope: this.toggleAbScope,
                                        toggleAb: this.toggleAb,
                                        toggleSingleAb: this.toggleSingleAb,
                                        setAbAbbrev: this.setAbAbbrev })
                                ),
                                React.createElement(Add_tests_controller, { additional_tests: patient.additional_tests,
                                    updateAdditionalTestResult: this.updateAdditionalTestResult,
                                    resetInitialTestPosition: this.resetInitialTestPosition,
                                    toggleSingleAddTest: this.toggleSingleAddTest,
                                    decreaseResultFontSize: this.decreaseResultFontSize,
                                    increaseResultFontSize: this.increaseResultFontSize,
                                    increaseTitleFontSize: this.increaseTitleFontSize,
                                    decreaseTitleFontSize: this.decreaseTitleFontSize,
                                    setTitleColor: this.setTitleColor,
                                    setResultTextColor: this.setResultTextColor })
                            ) : null
                        ),
                        React.createElement(
                            'div',
                            { className: 'data-from-graph' },
                            React.createElement('input', { id: 'viewport_x1', type: 'text', pattern: '[0-9]*', onChange: this.handleViewportPosition }),
                            React.createElement('input', { id: 'viewport_x2', type: 'text', pattern: '[0-9]*', onChange: this.handleViewportPosition }),
                            React.createElement('input', { id: 'annotation-id', type: 'text' }),
                            React.createElement('input', { id: 'annotation-x', type: 'text', pattern: '[0-9]*' }),
                            React.createElement('input', { id: 'annotation-y', type: 'text', pattern: '[0-9]*' }),
                            React.createElement('input', { id: 'annotation-dx', type: 'text', pattern: '[0-9]*' }),
                            React.createElement('input', { id: 'annotation-dy', type: 'text', pattern: '[0-9]*' }),
                            React.createElement('input', { id: 'www', type: 'text', pattern: '[0-9]*' }),
                            React.createElement('button', { id: 'annotation-button', onMouseUp: this.updateAnnotationCoords })
                        )
                    )
                );
            }
        }
    }]);

    return App;
}(React.Component);

export default App;
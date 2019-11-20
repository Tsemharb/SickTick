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
import Add_tests_controller from './controller_components/Add_tests_controller.js';
import path from './path.js';

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.toggleTemp = function () {
            return _this.setState({ drawTemp: !_this.state.drawTemp, update: true });
        };

        _this.toggleAb = function () {
            return _this.setState({ drawAb: !_this.state.drawAb, update: true });
        };

        _this.toggleSingleAb = function (e) {
            var data = _this.state.patient;
            for (var i = 0; i < data.antibiotics.length; i++) {
                if (data.antibiotics[i].name == e.target.id) {
                    data.antibiotics[i].draw = e.target.checked;
                }
            }
            _this.setState({ patient: data, update: true });
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

        _this.toggleSingleAddTest = function (e) {
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
                        if (value[i].id + "-checkbox" === e.target.id) {
                            data.additional_tests[key][i].draw = e.target.checked;
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

        _this.handleViewportPosition = function (e) {
            e.target.id === 'viewport_x1' ? _this.setState({ viewport_start: e.target.value, update: false }) : _this.setState({ viewport_end: e.target.value, update: false });
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
                        drawTemp: true,
                        drawAb: true,
                        draw_annotations: true,
                        patient: data
                    });
                });
            });
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return nextState.update;
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                isLoaded = _state.isLoaded,
                drawGraph = _state.drawGraph,
                drawTemp = _state.drawTemp,
                drawAb = _state.drawAb,
                patient = _state.patient,
                viewport_start = _state.viewport_start,
                viewport_end = _state.viewport_end,
                draw_annotations = _state.draw_annotations;

            if (!isLoaded) {
                return React.createElement(
                    'div',
                    null,
                    ' loading... '
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
                            React.createElement(Graph, { graphData: { patient: patient, drawTemp: drawTemp, drawAb: drawAb, viewport_start: viewport_start, viewport_end: viewport_end, draw_annotations: draw_annotations } })
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
                                React.createElement(Ab_controller, { antibiotics: patient.antibiotics,
                                    drawAb: this.state.drawAb,
                                    toggleAb: this.toggleAb,
                                    toggleSingleAb: this.toggleSingleAb }),
                                React.createElement(Add_tests_controller, { additional_tests: patient.additional_tests,
                                    updateAdditionalTestResult: this.updateAdditionalTestResult,
                                    toggleSingleAddTest: this.toggleSingleAddTest })
                            ) : null
                        ),
                        React.createElement(
                            'div',
                            { className: 'viewport_data' },
                            React.createElement('input', { id: 'viewport_x1', type: 'text', pattern: '[0-9]*', onChange: this.handleViewportPosition }),
                            React.createElement('input', { id: 'viewport_x2', type: 'text', pattern: '[0-9]*', onChange: this.handleViewportPosition })
                        )
                    )
                );
            }
        }
    }]);

    return App;
}(React.Component);

export default App;
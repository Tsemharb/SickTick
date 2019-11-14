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
            return _this.setState({ drawTemp: !_this.state.drawTemp, viewport: false });
        };

        _this.toggleAb = function () {
            return _this.setState({ drawAb: !_this.state.drawAb, viewport: false });
        };

        _this.toggleSingleAb = function (e) {
            var data = _this.state.patient;
            for (var i = 0; i < data.antibiotics.length; i++) {
                if (data.antibiotics[i].name == e.target.id) {
                    data.antibiotics[i].draw = e.target.checked;
                }
            }
            _this.setState({ patient: data, viewport: false });
        };

        _this.handleViewportPosition = function (e) {
            e.target.id === 'viewport_x1' ? _this.setState({ viewport_start: e.target.value, viewport: true }) : _this.setState({ viewport_end: e.target.value, viewport: true });
        };

        _this.state = {
            isLoaded: false,
            drawGraph: false,
            viewport: false,
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
                        drawTemp: true,
                        drawAb: true,
                        viewport: false,
                        patient: data
                    });
                });
            });
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            // console.log(nextState.viewport);
            return !nextState.viewport;
        }

        // onDraw = () => this.setState({ drawGraph: true, viewport: false });

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
                viewport_end = _state.viewport_end;

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
                            React.createElement(Graph, { graphData: { patient: patient, drawTemp: drawTemp, drawAb: drawAb, viewport_start: viewport_start, viewport_end: viewport_end } })
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
                                React.createElement(Add_tests_controller, { additional_tests: patient.additional_tests })
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
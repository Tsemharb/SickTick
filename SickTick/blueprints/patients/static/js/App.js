var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Clock from './Clock.js';
import Graph from './Graph.js';
import General_info from './General_info.js';
import Temp_controller from './Temp_controller.js';
import path from './path.js';

// function App() {

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.onDraw = function () {
            return _this.setState({ drawGraph: true });
        };

        var location = window.location.href;
        var patient_id = location.match(/\/([0-9]*)%20/)[1]; //get serial number as id
        _this.state = {
            isLoaded: false,
            drawGraph: false,
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
                        patient: data
                    });
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                isLoaded = _state.isLoaded,
                drawGraph = _state.drawGraph,
                patient = _state.patient;
            // let r = Object.values(patient.temperature);

            if (!isLoaded) {
                return React.createElement(
                    'div',
                    null,
                    ' loading '
                );
            } else {
                // console.log(drawGraph);
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
                            drawGraph ? React.createElement(Graph, { patient: patient }) : null
                        ),
                        React.createElement(
                            'div',
                            { className: 'app__control-panel' },
                            isLoaded ? React.createElement(Temp_controller, { temp: patient.temperature }) : null,
                            React.createElement(
                                'button',
                                { onClick: this.onDraw },
                                ' plot '
                            )
                        )
                    )
                );
            }
        }
    }]);

    return App;
}(React.Component);

export default App;
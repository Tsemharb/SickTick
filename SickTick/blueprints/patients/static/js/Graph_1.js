var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import draw_everything from './graph_components/draw_graph_1.js';

var Graph_1 = function (_React$Component) {
    _inherits(Graph_1, _React$Component);

    function Graph_1() {
        _classCallCheck(this, Graph_1);

        return _possibleConstructorReturn(this, (Graph_1.__proto__ || Object.getPrototypeOf(Graph_1)).apply(this, arguments));
    }

    _createClass(Graph_1, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            draw_everything(this.props);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            draw_everything(this.props);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { className: 'graph' });
        }
    }]);

    return Graph_1;
}(React.Component);

export default Graph_1;
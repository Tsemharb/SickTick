var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ab_controller = function (_React$Component) {
    _inherits(Ab_controller, _React$Component);

    function Ab_controller() {
        _classCallCheck(this, Ab_controller);

        return _possibleConstructorReturn(this, (Ab_controller.__proto__ || Object.getPrototypeOf(Ab_controller)).apply(this, arguments));
    }

    _createClass(Ab_controller, [{
        key: "render",
        value: function render() {
            var temp = Object.values(this.props.temp);
            return React.createElement(
                "div",
                null,
                React.createElement("input", { type: "checkbox", checked: this.props.drawAb ? "checked" : null,
                    onChange: this.props.toggleAb }),
                " show antibiotics"
            )
            //temp.map(t => <small>{t.temp}</small>);
            ;
        }
    }]);

    return Ab_controller;
}(React.Component);

export default Ab_controller;
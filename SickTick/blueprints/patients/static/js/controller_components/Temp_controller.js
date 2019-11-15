var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Temp_controller = function (_React$Component) {
    _inherits(Temp_controller, _React$Component);

    function Temp_controller() {
        _classCallCheck(this, Temp_controller);

        var _this = _possibleConstructorReturn(this, (Temp_controller.__proto__ || Object.getPrototypeOf(Temp_controller)).call(this));

        _this.onPanelToggle = function () {
            return _this.setState({ open: !_this.state.open });
        };

        _this.state = { open: false };
        return _this;
    }

    _createClass(Temp_controller, [{
        key: "render",
        value: function render() {
            var temp = Object.values(this.props.temp);
            return React.createElement(
                "div",
                { className: "panel" },
                React.createElement(
                    "div",
                    { className: "panel-header" },
                    React.createElement(
                        "h6",
                        null,
                        "Temperature"
                    ),
                    React.createElement(
                        "button",
                        { className: "toggle-button panel-header-btn", onClick: this.onPanelToggle },
                        this.state.open ? 'hide' : 'show'
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-content" + (!this.state.open ? " hidden" : "") },
                    React.createElement("input", { id: "showTemp", type: "checkbox", checked: this.props.drawTemp ? "checked" : null,
                        onChange: this.props.toggleTemp }),
                    " show temperature"
                )
            );
        }
    }]);

    return Temp_controller;
}(React.Component);

export default Temp_controller;
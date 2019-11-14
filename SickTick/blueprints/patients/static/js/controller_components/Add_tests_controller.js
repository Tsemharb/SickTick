var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Add_tests_controller = function (_React$Component) {
    _inherits(Add_tests_controller, _React$Component);

    function Add_tests_controller() {
        _classCallCheck(this, Add_tests_controller);

        var _this = _possibleConstructorReturn(this, (Add_tests_controller.__proto__ || Object.getPrototypeOf(Add_tests_controller)).call(this));

        _this.onPanelToggle = function () {
            return _this.setState({ open: !_this.state.open });
        };

        _this.state = { open: false };
        return _this;
    }

    _createClass(Add_tests_controller, [{
        key: "render",
        value: function render() {
            var tests = this.props.additional_tests;
            return React.createElement(
                "div",
                { className: "panel" },
                React.createElement(
                    "div",
                    { className: "panel-header" },
                    React.createElement(
                        "h6",
                        null,
                        "Additional Tests"
                    ),
                    React.createElement(
                        "button",
                        { className: "panel-header-btn", onClick: this.onPanelToggle },
                        this.state.open ? 'hide' : 'show'
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-content" + (!this.state.open ? " hidden" : "") },
                    React.createElement(
                        "div",
                        null,
                        tests.map(function (test) {
                            return React.createElement(
                                "p",
                                null,
                                test.result
                            );
                        })
                    )
                )
            );
        }
    }]);

    return Add_tests_controller;
}(React.Component);

export default Add_tests_controller;
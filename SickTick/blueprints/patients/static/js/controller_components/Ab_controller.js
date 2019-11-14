var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ab_controller = function (_React$Component) {
    _inherits(Ab_controller, _React$Component);

    function Ab_controller() {
        _classCallCheck(this, Ab_controller);

        var _this = _possibleConstructorReturn(this, (Ab_controller.__proto__ || Object.getPrototypeOf(Ab_controller)).call(this));

        _this.onPanelToggle = function () {
            return _this.setState({ open: !_this.state.open });
        };

        _this.state = { open: false };
        return _this;
    }

    _createClass(Ab_controller, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var antibiotics = this.props.antibiotics;
            var renderedAb = [];
            return React.createElement(
                "div",
                { className: "panel" },
                React.createElement(
                    "div",
                    { className: "panel-header" },
                    React.createElement(
                        "h6",
                        null,
                        "Antibiotics"
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
                    React.createElement("input", { type: "checkbox", checked: this.props.drawAb ? "checked" : null,
                        onChange: this.props.toggleAb }),
                    " show antibiotics",
                    this.props.drawAb ? React.createElement(
                        "div",
                        { className: "abList" },
                        antibiotics.map(function (ab) {
                            if (!renderedAb.includes(ab.name)) {
                                renderedAb.push(ab.name);
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement("input", { id: ab.name, type: "checkbox", checked: ab.draw ? "checked" : null,
                                        onChange: _this2.props.toggleSingleAb }),
                                    React.createElement(
                                        "span",
                                        null,
                                        ab.name
                                    )
                                );
                            }
                        })
                    ) : null
                )
            );
        }
    }]);

    return Ab_controller;
}(React.Component);

export default Ab_controller;
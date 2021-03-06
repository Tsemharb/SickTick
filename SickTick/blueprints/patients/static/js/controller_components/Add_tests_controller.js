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

        _this.toggleTest = function (e) {
            var toggle_state = _this.state.test_info_tab_open;
            toggle_state[e.target.id] = !toggle_state[e.target.id];
            _this.setState({ test_info_tab_open: toggle_state });
        };

        _this.toggleSettingsDisplay = function (e) {
            // console.log('panel-header')
            var toggle_state = _this.state.test_display_settings_open;
            toggle_state[e.target.id] = !toggle_state[e.target.id];
            _this.setState({ test_display_settings_open: toggle_state });
        };

        _this.handleTextareaChange = function (e) {
            var textareaLineHeight = 12;
            // const previousRows = e.target.rows;
            e.target.rows = 1;
            var currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);
            e.target.rows = currentRows;
            _this.props.updateAdditionalTestResult(e.target.id, e.target.value);
        };

        _this.togglePalette = function (e) {
            // console.log(this.state.showPalette);
            if (_this.state.showPalette === e.target.id) {
                _this.setState({ showPalette: null });
            } else _this.setState({ showPalette: e.target.id });
        };

        _this.state = { open: false };
        return _this;
    }

    // hide all additional test tab and display settings


    _createClass(Add_tests_controller, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var keys = Object.keys(this.props.additional_tests);
            var tests = this.props.additional_tests;
            var test_info_tab_open = {};
            var test_display_settings_open = {};
            keys.map(function (key) {
                return test_info_tab_open[key] = false;
            });
            keys.map(function (key) {
                tests[key].map(function (test) {
                    return test_display_settings_open[test.id] = false;
                });
            });
            this.setState({ test_info_tab_open: test_info_tab_open, test_display_settings_open: test_display_settings_open });
        }

        // set roughly estimated textarea size for each test result

    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var averageNumOfSymbolsInTextareaString = 44;
            var textareas = document.getElementsByClassName('test-result');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = textareas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var textarea = _step.value;

                    textarea.rows = Math.ceil(textarea.value.length / averageNumOfSymbolsInTextareaString);
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
        }

        // set matching textarea height

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var tests = this.props.additional_tests;
            var keys = Object.keys(this.props.additional_tests);
            // console.log(tests);
            return React.createElement(
                "div",
                { className: "panel additional-tests-panel" },
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
                        { className: "toggle-button panel-header-btn", onClick: this.onPanelToggle },
                        this.state.open ? 'hide' : 'show'
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-content" + (!this.state.open ? " hidden" : "") },
                    keys.map(function (key) {
                        return React.createElement(
                            "div",
                            { className: "test-group-wrapper" },
                            React.createElement(
                                "div",
                                { id: key, className: "test-group-header", onClick: _this2.toggleTest },
                                React.createElement(
                                    "p",
                                    { className: "test-group-title" },
                                    " ",
                                    key,
                                    " "
                                ),
                                React.createElement(
                                    "p",
                                    null,
                                    " ",
                                    !_this2.state.test_info_tab_open[key] ? "+" : "-",
                                    " "
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "test-group" },
                                tests[key].map(function (test) {
                                    return React.createElement(
                                        "div",
                                        { className: "test-info", style: !_this2.state.test_info_tab_open[key] ? { display: "none" } : null },
                                        React.createElement(
                                            "div",
                                            { className: "test-info-header" },
                                            React.createElement(
                                                "div",
                                                null,
                                                React.createElement("input", { id: test.id + "-checkbox", type: "checkbox", checked: test.draw ? "checked" : null,
                                                    onChange: _this2.props.toggleSingleAddTest }),
                                                React.createElement(
                                                    "span",
                                                    null,
                                                    test.date
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "textarea",
                                            { id: test.id, className: "test-result", onChange: _this2.handleTextareaChange },
                                            test.result
                                        ),
                                        React.createElement(
                                            "div",
                                            null,
                                            React.createElement(
                                                "div",
                                                { className: "test-settings-buttons" },
                                                React.createElement(
                                                    "button",
                                                    { id: test.id, onClick: _this2.toggleSettingsDisplay, style: !test.draw ? { visibility: "hidden" } : null },
                                                    !_this2.state.test_display_settings_open[test.id] ? 'display settings' : 'hide settings'
                                                ),
                                                React.createElement(
                                                    "button",
                                                    { id: test.id + "-reset", onClick: _this2.props.resetInitialTestPosition },
                                                    " reset initial position "
                                                )
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "test-settings", style: !_this2.state.test_display_settings_open[test.id] || !test.draw ? { display: "none" } : null },
                                                React.createElement(
                                                    "div",
                                                    { className: "settings-row" },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        "title font-size"
                                                    ),
                                                    React.createElement(
                                                        "button",
                                                        { id: test.id + "-decrease-title-font", onClick: _this2.props.decreaseTitleFontSize },
                                                        "-"
                                                    ),
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        test.title_font_size
                                                    ),
                                                    React.createElement(
                                                        "button",
                                                        { id: test.id + "-increase-title-font", onClick: _this2.props.increaseTitleFontSize },
                                                        "+"
                                                    )
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "settings-row" },
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "title font color"
                                                    ),
                                                    React.createElement("div", { id: test.id + "-title-color", className: "current-color", style: { background: test.title_color }, onClick: _this2.togglePalette }),
                                                    React.createElement(
                                                        "div",
                                                        { className: "color-palette", style: _this2.state.showPalette === test.id + "-title-color" ? { display: "flex" } : null },
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "red" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "blue" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "green" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "pink" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "wheat" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "coral" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "black" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "yellow" }, onClick: _this2.props.setTitleColor }),
                                                        React.createElement("div", { id: test.id + "-title-color", className: "color", style: { background: "whitesmoke" }, onClick: _this2.props.setTitleColor })
                                                    )
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "settings-row" },
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        "result font-size"
                                                    ),
                                                    React.createElement(
                                                        "button",
                                                        { id: test.id + "-decrease-result-font", onClick: _this2.props.decreaseResultFontSize },
                                                        "-"
                                                    ),
                                                    React.createElement(
                                                        "span",
                                                        null,
                                                        test.result_font_size
                                                    ),
                                                    React.createElement(
                                                        "button",
                                                        { id: test.id + "-increase-result-font", onClick: _this2.props.increaseResultFontSize },
                                                        "+"
                                                    )
                                                ),
                                                React.createElement(
                                                    "div",
                                                    { className: "settings-row" },
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        "result font color"
                                                    ),
                                                    React.createElement("div", { id: test.id + "-result-text-color", className: "current-color", style: { background: test.result_color }, onClick: _this2.togglePalette }),
                                                    React.createElement(
                                                        "div",
                                                        { className: "color-palette", style: _this2.state.showPalette === test.id + "-result-text-color" ? { display: "flex" } : null },
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "red" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "blue" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "green" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "pink" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "wheat" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "coral" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "black" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "yellow" }, onClick: _this2.props.setResultTextColor }),
                                                        React.createElement("div", { id: test.id + "-result-text-color", className: "color", style: { background: "whitesmoke" }, onClick: _this2.props.setResultTextColor })
                                                    )
                                                )
                                            )
                                        )
                                    );
                                })
                            )
                        );
                    })
                )
            );
        }
    }]);

    return Add_tests_controller;
}(React.Component);

export default Add_tests_controller;
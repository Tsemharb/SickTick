var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window$ReactBeautifu = window.ReactBeautifulDnd,
    Draggable = _window$ReactBeautifu.Draggable,
    Droppable = _window$ReactBeautifu.Droppable;

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
            var ab_order = this.props.unique_ab_order;
            // console.log(antibiotics);
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
                        { className: "toggle-button panel-header-btn", onClick: this.onPanelToggle },
                        this.state.open ? 'hide' : 'show'
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-content" + (!this.state.open ? " hidden" : "") },
                    React.createElement(
                        "div",
                        { className: "panel-settings" },
                        React.createElement(
                            "span",
                            null,
                            React.createElement("input", { type: "checkbox", checked: this.props.drawAb ? "checked" : null,
                                onChange: this.props.toggleAb }),
                            " show antibiotics"
                        ),
                        React.createElement(
                            "span",
                            null,
                            React.createElement("input", { type: "checkbox", checked: this.props.adjustAbScope ? "checked" : null,
                                onChange: this.props.toggleAbScope }),
                            " hide AB outside selected scope"
                        )
                    ),
                    this.props.drawAb ? React.createElement(
                        "div",
                        { className: "ab-list-wrapper" },
                        React.createElement(
                            "h6",
                            null,
                            " Antibiotics list"
                        ),
                        React.createElement(
                            Droppable,
                            { droppableId: 'antibiotics' },
                            function (provided) {
                                return React.createElement(
                                    "div",
                                    Object.assign({ className: "panel-parameters",
                                        ref: provided.innerRef
                                    }, provided.droppableProps),
                                    ab_order.map(function (next_ab, ind) {
                                        // console.log(ab_order);
                                        var ab = null;
                                        var _iteratorNormalCompletion = true;
                                        var _didIteratorError = false;
                                        var _iteratorError = undefined;

                                        try {
                                            for (var _iterator = Object.entries(antibiotics)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                var _ref = _step.value;

                                                var _ref2 = _slicedToArray(_ref, 2);

                                                var key = _ref2[0];
                                                var value = _ref2[1];

                                                if (value.name === next_ab) {
                                                    ab = value;
                                                    ab.index = ind;
                                                    break;
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

                                        ;
                                        return React.createElement(
                                            Draggable,
                                            { key: ab.name + ab.index, draggableId: ab.name, index: ab.index },
                                            function (provided) {
                                                return React.createElement(
                                                    "div",
                                                    Object.assign({ className: "ab-item",
                                                        ref: provided.innerRef
                                                    }, provided.draggableProps, provided.dragHandleProps),
                                                    React.createElement(
                                                        "div",
                                                        null,
                                                        React.createElement("input", { id: ab.name, type: "checkbox", checked: ab.draw && ab.dates.begin !== '0' ? "checked" : null,
                                                            onChange: _this2.props.toggleSingleAb }),
                                                        React.createElement(
                                                            "span",
                                                            { style: ab.dates.begin === '0' ? { background: 'red' } : null },
                                                            ab.dates.begin === '0' ? ab.name + ' INV DATE' : ab.name
                                                        )
                                                    ),
                                                    React.createElement("input", { type: "text", id: ab.name, value: ab.abbrev,
                                                        onChange: function onChange(evt) {
                                                            return _this2.props.setAbAbbrev(evt);
                                                        } })
                                                );
                                            }
                                        );
                                    }),
                                    provided.placeholder
                                );
                            }
                        )
                    ) : null
                )
            );
        }
    }]);

    return Ab_controller;
}(React.Component);

export default Ab_controller;
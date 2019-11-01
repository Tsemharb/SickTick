var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var General_info = function (_React$Component) {
  _inherits(General_info, _React$Component);

  function General_info() {
    _classCallCheck(this, General_info);

    return _possibleConstructorReturn(this, (General_info.__proto__ || Object.getPrototypeOf(General_info)).apply(this, arguments));
  }

  _createClass(General_info, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'general_info' },
        React.createElement(
          'h2',
          null,
          ' ',
          this.props.info.general_info.name,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.address,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.birthdate,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.admission_date,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.discharge_date,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.department,
          ' '
        ),
        React.createElement(
          'p',
          null,
          ' ',
          this.props.info.general_info.diagnosis,
          ' '
        )
      );
    }
  }]);

  return General_info;
}(React.Component);

export default General_info;
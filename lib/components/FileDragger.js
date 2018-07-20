'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _httpAxios = require('http-axios');

var _httpAxios2 = _interopRequireDefault(_httpAxios);

require('antd/dist/antd.css');

var _api = require('../config/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ACTION_FILE_DRAGGER = 'ACTION_FILE_DRAGGER';

var Dragger = _antd.Upload.Dragger;

var FileDragger = function (_Component) {
    _inherits(FileDragger, _Component);

    function FileDragger() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, FileDragger);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FileDragger.__proto__ || Object.getPrototypeOf(FileDragger)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            info: {}
        }, _this.handleChange = function (info) {
            // this.setState({info: info})
        }, _this.httpCustomRequest = function (info) {
            _this.setState({ info: info });
            _this.httpUploadImage();
        }, _this.onRealSuccess = function (res, action) {
            _this.props.onChange(res.hash);
            var info = _this.state.info;
            var status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                _antd.message.success(info.file.name + ' \u6587\u4EF6\u4E0A\u4F20\u6210\u529F.');
            } else if (status === 'error') {
                _antd.message.error(info.file.name + ' \u6587\u4EF6\u4E0A\u4F20\u5931\u8D25.');
            }
        }, _this.onFailure = function (code, data, action) {
            _antd.message.error('上传失败', code);
        }, _this.onError = function (status) {
            _antd.message.error('上传错误', status);
        }, _this.httpUploadImage = function () {
            var formdata = new FormData();
            if (_this.props.token) {
                formdata.append('token', _this.props.token);
                formdata.append('file', _this.state.info.file);
                _httpAxios2.default.POST(_api.API_QINIU_ROUTE, formdata, _this, ACTION_FILE_DRAGGER, { 'Content-Type': undefined });
            } else {
                _antd.message.error('缺失上传token');
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FileDragger, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {}
    }, {
        key: 'render',
        value: function render() {
            var props = {
                name: 'file',
                action: _api.API_QINIU_ROUTE,
                customRequest: this.httpCustomRequest,
                onChange: this.handleChange
            };
            return _react2.default.createElement(
                Dragger,
                props,
                _react2.default.createElement(
                    'p',
                    { className: 'ant-upload-drag-icon' },
                    _react2.default.createElement(_antd.Icon, { type: 'inbox' })
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'ant-upload-text' },
                    '\u5C06\u62D6\u62FD\u6587\u4EF6\u81F3\u6B64\u5904\u4E0A\u4F20'
                )
            );
        }
    }]);

    return FileDragger;
}(_react.Component);

exports.default = FileDragger;
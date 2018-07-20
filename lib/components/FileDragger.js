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
            fileList: [],
            value: '',
            multiple: false
        }, _this.setValue = function () {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var multiple = _this.state.multiple;

            var fileList = [];
            if (!multiple) {
                //单文件上传
                fileList = [{
                    uid: -1,
                    name: '原文件',
                    status: 'done',
                    url: value,
                    thumbUrl: value
                }];
            } else {
                //多文件上传暂未实现
                value.forEach(function (item, index) {
                    fileList.push({
                        uid: -1 - index,
                        name: '文件 ' + index,
                        status: 'done',
                        url: item,
                        thumbUrl: item
                    });
                });
            }
            _this.setState({ fileList: fileList });
        }, _this.handleChange = function (_ref2) {
            var fileList = _ref2.fileList,
                file = _ref2.file;

            if (!_this.state.multiple) {
                _this.setState({ fileList: [file] });
            } else {
                _this.setState({ fileList: fileList });
            }
        }, _this.httpCustomRequest = function (_ref3) {
            var fileList = _ref3.fileList,
                file = _ref3.file;

            _this.setState({ fileList: fileList, file: file });
            _this.httpUploadImage(file);
        }, _this.httpUploadImage = function (file) {
            var formdata = new FormData();
            if (_this.props.token) {
                formdata.append('token', _this.props.token);
                formdata.append('file', file);
                _httpAxios2.default.POST(_api.API_QINIU_ROUTE, formdata, _this, ACTION_FILE_DRAGGER, { 'Content-Type': undefined });
            } else {
                _antd.message.error('缺失上传token');
            }
        }, _this.onRealSuccess = function (res, action) {
            var _this$props$cdn = _this.props.cdn,
                cdn = _this$props$cdn === undefined ? '' : _this$props$cdn;

            if (!_this.state.multiple) {
                _this.props.onChange(cdn + res.hash);
                _this.setValue(cdn + res.hash);

                var fileList = _this.state.fileList;

                var file = fileList[0];
                file.status = 'done';
                _antd.message.success(file.name + ' \u6587\u4EF6\u4E0A\u4F20\u6210\u529F.');
            }
        }, _this.onFailure = function (code, data, action) {
            if (!_this.state.multiple) {
                var fileList = _this.state.fileList;

                var file = fileList[0];
                file.status = 'error';
                _antd.message.error(file.name + ' \u6587\u4EF6\u4E0A\u4F20\u5931\u8D25.');
            }
        }, _this.onError = function (status) {
            if (!_this.state.multiple) {
                var fileList = _this.state.fileList;

                var file = fileList[0];
                file.status = 'error';
                _antd.message.error(file.name + '\u6587\u4EF6\u4E0A\u4F20\u9519\u8BEF.');
            }
        }, _this.handleCopyClick = function (value) {
            var p = document.createElement('textarea');
            p.value = value;
            p.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                _antd.message.info(msg);
            } catch (err) {
                _antd.message.info('该浏览器不支持点击复制到剪贴板');
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FileDragger, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // const {multiple = false} = this.props
            // this.setState({multiple: multiple})
            this.setValue(this.props.value);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                value = _state.value,
                fileList = _state.fileList,
                multiple = _state.multiple;
            var _props$showValue = this.props.showValue,
                showValue = _props$showValue === undefined ? false : _props$showValue;

            var props = {
                multiple: multiple,
                fileList: fileList,
                action: _api.API_QINIU_ROUTE,
                customRequest: this.httpCustomRequest,
                onChange: this.handleChange
            };
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
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
                ),
                showValue ? _react2.default.createElement(
                    'p',
                    { className: 'ant-upload-hint' },
                    value,
                    _react2.default.createElement(_antd.Icon, { type: 'copy', onClick: function onClick() {
                            return _this2.handleCopyClick(value);
                        }, style: { margin: '0 2px' } })
                ) : null
            );
        }
    }]);

    return FileDragger;
}(_react.Component);

exports.default = FileDragger;
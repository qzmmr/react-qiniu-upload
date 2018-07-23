'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
            file: {},
            fileList: [],
            value: '',
            multiple: false
        }, _this.setFile = function (file) {
            var multiple = _this.state.multiple;

            if (!file) return;
            var fileList = [];
            if (!multiple) {
                //单文件上传
                if ((typeof file === 'undefined' ? 'undefined' : _typeof(file)) === 'object') {
                    fileList = [file];
                } else if (typeof file === 'string') {
                    fileList = [{
                        uid: -1,
                        name: file,
                        status: 'done',
                        url: file
                    }];
                } else {
                    fileList = [{
                        uid: -1,
                        name: '未知文件',
                        status: 'done',
                        url: file
                    }];
                }
                _this.setState({ file: fileList[0] });
            } else {
                //多文件上传暂未实现
                file.forEach(function (item, index) {

                    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                        fileList.push(item);
                    } else if (typeof file === 'string') {
                        fileList.push({
                            uid: -1 - index,
                            name: item,
                            status: 'done',
                            url: item
                        });
                    } else {
                        fileList = [{
                            uid: -1 - index,
                            name: '未知文件-' + index,
                            status: 'done',
                            url: item
                        }];
                    }
                });
            }
            _this.setState({ fileList: fileList });
        }, _this.handleChange = function (_ref2) {
            var fileList = _ref2.fileList,
                file = _ref2.file;

            if (!_this.state.multiple) {
                _this.setState({ fileList: [file], file: file });
            } else {
                _this.setState({ fileList: fileList, file: file });
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
                formdata.append('key', file.name);
                formdata.append('file', file);
                _httpAxios2.default.POST(_api.API_QINIU_ROUTE, formdata, _this, ACTION_FILE_DRAGGER, { 'Content-Type': undefined });
            } else {
                _antd.message.error('缺失上传token');
            }
        }, _this.onRealSuccess = function (res, action) {
            var _this$props$cdn = _this.props.cdn,
                cdn = _this$props$cdn === undefined ? '' : _this$props$cdn;

            if (!_this.state.multiple) {
                _this.props.onChange(cdn + res.key);
                var file = _this.state.file;

                _antd.message.success(file.name + ' \u6587\u4EF6\u4E0A\u4F20\u6210\u529F.');
                file.status = 'done';
                file.url = cdn + res.key;
                _this.setFile(file);
            } else {}
        }, _this.onFailure = function (code, data, action) {
            if (!_this.state.multiple) {
                var file = _this.state.file;

                file.status = 'error';
                _antd.message.error(file.name + ' \u6587\u4EF6\u4E0A\u4F20\u5931\u8D25.');
            }
        }, _this.onError = function (status) {
            if (!_this.state.multiple) {
                var file = _this.state.file;

                file.status = 'error';
                _antd.message.error(file.name + '\u6587\u4EF6\u4E0A\u4F20\u9519\u8BEF.');
            }
        }, _this.handleRemove = function (file) {
            _this.setState(function (_ref4) {
                var fileList = _ref4.fileList;

                var index = fileList.indexOf(file);
                var newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList
                };
            });
        }, _this.handleCopyClick = function (text) {
            var textarea = document.createElement("textarea");
            textarea.style = {
                position: 'fixed',
                top: 0,
                left: 0,
                border: 'none',
                outline: 'none',
                resize: 'none',
                background: 'transparent',
                color: 'transparent',
                zIndex: -100
            };
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            var msg = '该浏览器不支持点击复制到剪贴板';
            try {
                var successful = document.execCommand('copy');
                successful ? msg = '成功复制到剪贴板' : null;
                document.removeChild(textarea);
            } catch (err) {}
            _antd.message.info(msg);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FileDragger, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // const {multiple = false} = this.props
            // this.setState({multiple: multiple})
            this.setFile(this.props.value);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                file = _state.file,
                fileList = _state.fileList,
                multiple = _state.multiple;
            var _props$showValue = this.props.showValue,
                showValue = _props$showValue === undefined ? false : _props$showValue;

            var props = {
                multiple: multiple,
                listType: 'picture',
                fileList: fileList,
                action: _api.API_QINIU_ROUTE,
                onRemove: this.handleRemove,
                customRequest: this.httpCustomRequest,
                onChange: this.handleChange
            };
            return _react2.default.createElement(
                'div',
                { style: { width: '100%' } },
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
                    file.name,
                    _react2.default.createElement(_antd.Icon, { type: 'copy', onClick: function onClick() {
                            return _this2.handleCopyClick(file.url);
                        }, style: { margin: '0 2px' } })
                ) : null
            );
        }
    }]);

    return FileDragger;
}(_react.Component);

exports.default = FileDragger;
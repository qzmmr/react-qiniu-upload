'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _httpAxios = require('http-axios');

var _httpAxios2 = _interopRequireDefault(_httpAxios);

var _antd = require('antd');

require('antd/dist/antd.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var API_QINIU_ROUTE = '//up-z2.qbox.me/';

var ACTION_IMAGE_UPLOAD = 'ACTION_IMAGE_UPLOAD';
//组件属性默认配置列表
var default_token = ''; //必填
var default_multiple = false;
var default_listType = 'picture-card';
var default_isCustomName = false;
var default_isCustomResponse = false;
var default_responsePrefix = '';
var default_responseSuffix = '';

var PicturesWall = function (_Component) {
    _inherits(PicturesWall, _Component);

    function PicturesWall() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, PicturesWall);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PicturesWall.__proto__ || Object.getPrototypeOf(PicturesWall)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: []
        }, _this.handleCancel = function () {
            return _this.setState({ previewVisible: false });
        }, _this.handlePreview = function (file) {
            _this.setState({
                previewImage: file.url,
                previewVisible: true
            });
        }, _this.handleChange = function (_ref2) {
            var fileList = _ref2.fileList;

            _this.setState({ fileList: fileList });
        }, _this.httpCustomRequest = function (info) {
            _this.setState({ actions: info });
            _this.httpUploadImage(info.file);
        }, _this.onRealSuccess = function (data) {
            var _this$props = _this.props,
                _this$props$isCustomR = _this$props.isCustomResponse,
                isCustomResponse = _this$props$isCustomR === undefined ? default_isCustomResponse : _this$props$isCustomR,
                _this$props$responseP = _this$props.responsePrefix,
                responsePrefix = _this$props$responseP === undefined ? default_responsePrefix : _this$props$responseP,
                _this$props$responseS = _this$props.responseSuffix,
                responseSuffix = _this$props$responseS === undefined ? default_responseSuffix : _this$props$responseS;

            _this.state.fileList[0].status = 'done';
            var response = data.key;
            isCustomResponse ? response = responsePrefix + data.key + responseSuffix : null;
            _this.props.onChange(response);
            _antd.message.success('上传成功');
        }, _this.onFailure = function (code, data, action) {
            _antd.message.error('上传失败', code);
        }, _this.onError = function (status) {
            _antd.message.error('上传错误', status);
        }, _this.httpUploadImage = function (file) {
            var _this$props$isCustomN = _this.props.isCustomName,
                isCustomName = _this$props$isCustomN === undefined ? default_isCustomName : _this$props$isCustomN;

            var formdata = new FormData();
            if (_this.props.token) {
                formdata.append('token', _this.props.token);
                formdata.append('file', file);
                isCustomName ? formdata.append('key', file.name) : null;
                _httpAxios2.default.POST(API_QINIU_ROUTE, formdata, _this, ACTION_IMAGE_UPLOAD, { 'Content-Type': undefined });
            } else {
                _antd.message.error('缺失上传token');
            }
        }, _this.setSrc = function (url) {
            var fileList = [];
            var fileListItem = { uid: -1, name: url, status: 'done' };
            if (url) {
                fileListItem.url = url;
            }
            if (_this.multips > 1) {
                for (var item in url) {
                    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                        item.name ? fileListItem.name = item.name : null;
                        fileListItem.url = item.url;
                    } else {
                        fileListItem.url = item;
                    }
                    fileListItem.uid++;
                    fileList.push(fileListItem);
                }
            } else {
                if (fileListItem.url) {
                    fileList.push(fileListItem);
                }
            }
            _this.setState({ fileList: fileList });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(PicturesWall, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.multips = this.multips || 1;
            var _props = this.props,
                value = _props.value,
                _props$responsePrefix = _props.responsePrefix,
                responsePrefix = _props$responsePrefix === undefined ? default_responsePrefix : _props$responsePrefix,
                _props$responseSuffix = _props.responseSuffix,
                responseSuffix = _props$responseSuffix === undefined ? default_responseSuffix : _props$responseSuffix;

            value ? this.setSrc(responsePrefix + value + responseSuffix) : null;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _props2 = this.props,
                _props2$responsePrefi = _props2.responsePrefix,
                responsePrefix = _props2$responsePrefi === undefined ? default_responsePrefix : _props2$responsePrefi,
                _props2$responseSuffi = _props2.responseSuffix,
                responseSuffix = _props2$responseSuffi === undefined ? default_responseSuffix : _props2$responseSuffi;

            if (nextProps.value) {
                if (this.props.value === undefined) {
                    this.setSrc(responsePrefix + nextProps.value + responseSuffix);
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                previewVisible = _state.previewVisible,
                previewImage = _state.previewImage,
                fileList = _state.fileList;
            var _props$listType = this.props.listType,
                listType = _props$listType === undefined ? default_listType : _props$listType;

            var uploadButton = _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_antd.Icon, { type: 'plus' }),
                _react2.default.createElement(
                    'div',
                    { className: 'ant-upload-text' },
                    '\u4E0A\u4F20'
                )
            );
            var props = {
                action: API_QINIU_ROUTE,
                listType: listType,
                fileList: fileList,
                onPreview: this.handlePreview,
                onChange: this.handleChange,
                customRequest: this.httpCustomRequest
            };
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _antd.Upload,
                    props,
                    fileList.length >= this.multips ? null : uploadButton
                ),
                _react2.default.createElement(
                    _antd.Modal,
                    { visible: previewVisible, footer: null, onCancel: this.handleCancel },
                    _react2.default.createElement('img', { alt: '\u672A\u627E\u5230\u56FE\u7247', style: { width: '100%' }, src: previewImage })
                )
            );
        }
    }]);

    return PicturesWall;
}(_react.Component);

exports.default = PicturesWall;
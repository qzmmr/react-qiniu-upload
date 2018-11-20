import React, {Component} from 'react';
import http from 'http-axios'
import {Upload, Modal, Icon, message} from 'antd'
import 'antd/dist/antd.css';

const API_QINIU_ROUTE = '//up-z2.qbox.me/'

const ACTION_IMAGE_UPLOAD = 'ACTION_IMAGE_UPLOAD'
//组件属性默认配置列表
const default_token = ''    //必填
const default_multiple = false
const default_listType = 'picture-card'
const default_isCustomName = false
const default_isCustomResponse = false
const default_responsePrefix = ''
const default_responseSuffix = ''

class PicturesWall extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    }

    componentDidMount() {
        this.multips = this.multips || 1
        const {
            value,
            responsePrefix = default_responsePrefix,
            responseSuffix = default_responseSuffix
        } = this.props
        value ? this.setSrc(responsePrefix + value + responseSuffix) : null
    }

    componentWillReceiveProps(nextProps) {
        const {
            responsePrefix = default_responsePrefix,
            responseSuffix = default_responseSuffix
        } = this.props
        if (nextProps.value) {
            if (this.props.value === undefined) {
                this.setSrc(responsePrefix + nextProps.value + responseSuffix)
            }
        }
    }

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url,
            previewVisible: true,
        });
    }

    handleChange = ({fileList}) => {
        this.setState({fileList: fileList})
    }

    httpCustomRequest = (info) => {
        this.setState({actions: info})
        this.httpUploadImage(info.file)
    }

    onRealSuccess = data => {
        const {
            isCustomResponse = default_isCustomResponse,
            responsePrefix = default_responsePrefix,
            responseSuffix = default_responseSuffix
        } = this.props
        this.state.fileList[0].status = 'done'
        let response = data.key
        isCustomResponse ? (response = responsePrefix + data.key + responseSuffix) : null
        this.props.onChange(response)
        message.success('上传成功')
    }

    onFailure = (code, data, action) => {
        message.error('上传失败', code)
    }

    onError = (status) => {
        message.error('上传错误', status)
    }

    httpUploadImage = file => {
        const {isCustomName = default_isCustomName} = this.props
        const formdata = new FormData();
        if (this.props.token) {
            formdata.append('token', this.props.token);
            formdata.append('file', file);
            isCustomName ? formdata.append('key', file.name) : null
            http.POST(API_QINIU_ROUTE, formdata, this, ACTION_IMAGE_UPLOAD, {'Content-Type': undefined})
        }
        else {
            message.error('缺失上传token')
        }
    }

    setSrc = (url) => {
        let fileList = []
        let fileListItem = {uid: -1, name: url, status: 'done'}
        if (url) {
            fileListItem.url = url
        }
        if (this.multips > 1) {
            for (let item in url) {
                if (typeof item === 'object') {
                    item.name ? fileListItem.name = item.name : null
                    fileListItem.url = item.url
                }
                else {
                    fileListItem.url = item
                }
                fileListItem.uid++;
                fileList.push(fileListItem)
            }
        }
        else {
            if (fileListItem.url) {
                fileList.push(fileListItem)
            }
        }
        this.setState({fileList: fileList})

    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const {
            listType = default_listType
        } = this.props
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const props = {
            action: API_QINIU_ROUTE,
            listType: listType,
            fileList: fileList,
            onPreview: this.handlePreview,
            onChange: this.handleChange,
            customRequest: this.httpCustomRequest
        }
        return (
            <div>
                <Upload {...props}>
                    {fileList.length >= this.multips ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="未找到图片" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        )
    }
}

export default PicturesWall
import React, {Component} from 'react';
import http from 'http-axios'
import {Upload, Modal, Icon, message} from 'antd'
import 'antd/dist/antd.css';

const API_QINIU_ROUTE = '//up-z2.qbox.me/'

const ACTION_IMAGE_UPLOAD = 'ACTION_IMAGE_UPLOAD'

class QiniuUpload extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    }

    componentDidMount() {
        this.multips = this.multips || 1
        this.setSrc(this.props.value)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            if (this.props.value === undefined) {
                this.setSrc(nextProps.value)
            }
        }
    }

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({fileList}) => {
        this.setState({fileList: fileList})
    }

    httpCustomRequest = (info) => {
        this.setState({actions: info})
        this.httpUploadImage()
    }

    onRealSuccess = (res, action) => {
        this.state.fileList[0].status = 'done'
        this.props.onChange(res.hash)
        message.success('上传成功')
    }

    onFailure = (code, data, action) => {
        message.error('上传失败', code)
    }

    onError = (status) => {
        message.error('上传错误', status)
    }

    httpUploadImage = () => {
        const formdata = new FormData();
        if (this.props.token) {
            formdata.append('token', this.props.token);
            formdata.append('file', this.state.actions.file);
            http.POST(API_QINIU_ROUTE, formdata, this, ACTION_IMAGE_UPLOAD, {'Content-Type': undefined})
        }
        else {
            message.error('缺失上传token')
        }
    }

    setSrc = (url = '') => {
        const {cdn = ''} = this.props
        let fileList = []
        let fileListItem = {uid: -1, name: 'image.png', status: 'done'}
        fileListItem.url = cdn + url
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
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const props = {
            action: API_QINIU_ROUTE,
            listType: "picture-card",
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

export default QiniuUpload
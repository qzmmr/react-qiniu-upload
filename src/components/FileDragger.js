import React, {Component} from 'react';
import {Upload, Icon, message} from 'antd'
import http from 'http-axios'
import 'antd/dist/antd.css';
import {API_QINIU_ROUTE} from "../config/api";


const ACTION_FILE_DRAGGER = 'ACTION_FILE_DRAGGER'

const Dragger = Upload.Dragger

class FileDragger extends Component {
    state = {
        info: {},
        value: ''
    }

    componentDidMount() {
        this.setState({value: this.props.value})
    }

    handleChange = (info) => {
        // this.setState({info: info})
    }

    httpCustomRequest = (info) => {
        this.setState({info: info})
        this.httpUploadImage()
    }

    onRealSuccess = (res, action) => {
        const {cdn = ''} = this.props
        this.props.onChange(cdn + res.hash)
        this.setState({value: cdn + res.hash})

        let info = this.state.info
        info.file.status = 'done'
        message.success(`${info.file.name} 文件上传成功.`)
    }

    onFailure = (code, data, action) => {
        let info = this.state.info
        info.file.status = 'error'
        message.error(`${info.file.name} 文件上传失败.`)
    }

    onError = (status) => {
        let info = this.state.info
        info.file.status = 'error'
        message.error(`${info.file.name} 文件上传错误.`)
    }

    httpUploadImage = () => {
        const formdata = new FormData();
        if (this.props.token) {
            formdata.append('token', this.props.token);
            formdata.append('file', this.state.info.file);
            http.POST(API_QINIU_ROUTE, formdata, this, ACTION_FILE_DRAGGER, {'Content-Type': undefined})
        }
        else {
            message.error('缺失上传token')
        }
    }

    handleCopyClick = (value) => {
        let p = document.createElement('textarea')
        p.value = value
        p.select()
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            message.info(msg);
        } catch (err) {
            message.info('该浏览器不支持点击复制到剪贴板');
        }
    }

    render() {
        const {value} = this.state
        const {showValue = false} = this.props
        const props = {
            name: 'file',
            action: API_QINIU_ROUTE,
            customRequest: this.httpCustomRequest,
            onChange: this.handleChange,
        };
        return (
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">将拖拽文件至此处上传</p>
                {showValue ?
                    <p className="ant-upload-hint">
                        {value}
                        <Icon type="copy" onClick={() => this.handleCopyClick(value)} style={{margin: '0 2px'}}/>
                    </p>
                    : null}
            </Dragger>
        )
    }
}

export default FileDragger
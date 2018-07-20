import React, {Component} from 'react';
import {Upload, Icon, message} from 'antd'
import http from 'http-axios'
import 'antd/dist/antd.css';
import {API_QINIU_ROUTE} from "../config/api";


const ACTION_FILE_DRAGGER = 'ACTION_FILE_DRAGGER'

const Dragger = Upload.Dragger

class FileDragger extends Component {
    state = {
        fileList: [],
        value: '',
        multiple: false
    }

    componentDidMount() {
        // const {multiple = false} = this.props
        // this.setState({multiple: multiple})
        this.setValue(this.props.value)
    }

    setValue = (value = '') => {
        const {multiple} = this.state
        let fileList = []
        if (!multiple) {
            //单文件上传
            fileList = [{
                uid: -1,
                name: '原文件',
                status: 'done',
                url: value,
                thumbUrl: value
            }]
        }
        else {
            //多文件上传暂未实现
            value.forEach((item, index) => {
                fileList.push({
                    uid: -1 - index,
                    name: '文件 ' + index,
                    status: 'done',
                    url: item,
                    thumbUrl: item
                })
            })
        }
        this.setState({fileList: fileList})
    }

    handleChange = ({fileList, file}) => {
        if (!this.state.multiple) {
            this.setState({fileList: [file]})
        }
        else {
            this.setState({fileList: fileList})
        }
    }

    httpCustomRequest = ({fileList, file}) => {
        this.setState({fileList: fileList, file: file})
        this.httpUploadImage(file)
    }

    httpUploadImage = (file) => {
        const formdata = new FormData();
        if (this.props.token) {
            formdata.append('token', this.props.token);
            formdata.append('file', file);
            http.POST(API_QINIU_ROUTE, formdata, this, ACTION_FILE_DRAGGER, {'Content-Type': undefined})
        }
        else {
            message.error('缺失上传token')
        }
    }

    onRealSuccess = (res, action) => {
        const {cdn = ''} = this.props
        if (!this.state.multiple) {
            this.props.onChange(cdn + res.hash)
            this.setValue(cdn + res.hash)

            let {fileList} = this.state
            let file = fileList[0]
            file.status = 'done'
            message.success(`${file.name} 文件上传成功.`)
        }
    }

    onFailure = (code, data, action) => {
        if (!this.state.multiple) {
            let {fileList} = this.state
            let file = fileList[0]
            file.status = 'error'
            message.error(`${file.name} 文件上传失败.`)
        }
    }

    onError = (status) => {
        if (!this.state.multiple) {
            let {fileList} = this.state
            let file = fileList[0]
            file.status = 'error'
            message.error(`${file.name}文件上传错误.`)
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
        const {value, fileList, multiple} = this.state
        const {showValue = false} = this.props
        const props = {
            multiple: multiple,
            fileList: fileList,
            action: API_QINIU_ROUTE,
            customRequest: this.httpCustomRequest,
            onChange: this.handleChange,
        };
        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">将拖拽文件至此处上传</p>
                </Dragger>
                {showValue ?
                    <p className="ant-upload-hint">
                        {value}
                        <Icon type="copy" onClick={() => this.handleCopyClick(value)} style={{margin: '0 2px'}}/>
                    </p>
                    : null}
            </div>

        )
    }
}

export default FileDragger
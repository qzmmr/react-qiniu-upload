import React, {Component} from 'react';
import {Upload, Icon, message} from 'antd'
import http from 'http-axios'
import 'antd/dist/antd.css';
import {API_QINIU_ROUTE} from "../config/api";

const Dragger = Upload.Dragger

const ACTION_FILE_DRAGGER = 'ACTION_FILE_DRAGGER'

//组件属性默认配置列表
const default_token = ''    //必填
const default_clipboard = false
const default_multiple = false
const default_listType = 'text'
const default_isCustomName = false
const default_isCustomResponse = false
const default_responsePrefix = ''
const default_responseSuffix = ''

class FileDragger extends Component {
    state = {
        file: {},
        fileList: [],
        multiple: default_multiple
    }

    componentDidMount() {
        // const {multiple = false} = this.props
        // this.setState({multiple: multiple})
        const {
            responsePrefix = default_responsePrefix,
            responseSuffix = default_responseSuffix,
            value
        } = this.props
        this.setFile(responsePrefix + value + responseSuffix)
    }

    setFile = file => {
        const {multiple} = this.state
        if (!file) return
        let fileList = []
        if (!multiple) {
            //单文件上传
            if (typeof file === 'object') {
                fileList = [file]
            }
            else if (typeof file === 'string') {
                fileList = [{
                    uid: -1,
                    name: file,
                    status: 'done',
                    url: file
                }]
            }
            else {
                fileList = [{
                    uid: -1,
                    name: '未知文件',
                    status: 'done',
                    url: file
                }]
            }
            this.setState({file: fileList[0]})
        }
        else {
            //多文件上传暂未实现
            file.forEach((item, index) => {

                if (typeof item === 'object') {
                    fileList.push(item)
                }
                else if (typeof file === 'string') {
                    fileList.push({
                        uid: -1 - index,
                        name: item,
                        status: 'done',
                        url: item
                    })
                }
                else {
                    fileList = [{
                        uid: -1 - index,
                        name: '未知文件-' + index,
                        status: 'done',
                        url: item
                    }]
                }
            })
        }
        this.setState({fileList: fileList})
    }

    handleChange = ({fileList, file}) => {
        if (!this.state.multiple) {
            this.setState({fileList: [file], file: file})
        }
        else {
            this.setState({fileList: fileList, file: file})
        }
    }

    httpCustomRequest = ({fileList, file}) => {
        this.setState({fileList: fileList, file: file})
        this.httpUploadImage(file)
    }

    httpUploadImage = file => {
        const {isCustomName = default_isCustomName} = this.props
        const formdata = new FormData();
        if (this.props.token) {
            formdata.append('token', this.props.token);
            formdata.append('file', file);
            isCustomName ? formdata.append('key', file.name) : null
            http.POST(API_QINIU_ROUTE, formdata, this, ACTION_FILE_DRAGGER, {'Content-Type': undefined})
        }
        else {
            message.error('缺失上传token')
        }
    }

    onRealSuccess = data => {
        const {
            isCustomResponse = default_isCustomResponse,
            responsePrefix = default_responsePrefix,
            responseSuffix = default_responseSuffix
        } = this.props
        let response = data.key
        if (!this.state.multiple) {
            isCustomResponse ? (response = responsePrefix + data.key + responseSuffix) : null
            this.props.onChange(response)
            let {file} = this.state
            message.success(`${file.name} 文件上传成功.`)
            file.status = 'done'
            file.url = responsePrefix + data.key + responseSuffix
            this.setFile(file)
        }
        else {

        }
    }

    onFailure = code => {
        if (!this.state.multiple) {
            let {file} = this.state
            file.status = 'error'
            message.error(`${file.name} 文件上传失败.`)
        }
    }

    onError = status => {
        if (!this.state.multiple) {
            let {file} = this.state
            file.status = 'error'
            message.error(`${file.name}文件上传错误.`)
        }
    }

    handleRemove = file => {
        this.setState(({fileList}) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            }
        })
    }

    handleCopyClick = text => {
        const textarea = document.createElement("textarea")
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
        }
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        let msg = '该浏览器不支持点击复制到剪贴板';
        try {
            const successful = document.execCommand('copy');
            successful ? (msg = '成功复制到剪贴板') : null
            document.removeChild(textarea)
        } catch (err) {

        }
        message.info(msg);
    }

    render() {
        const {file, fileList, multiple} = this.state
        const {clipboard = default_clipboard, listType = default_listType} = this.props
        const props = {
            multiple: multiple,
            listType: listType,
            fileList: fileList,
            action: API_QINIU_ROUTE,
            onRemove: this.handleRemove,
            customRequest: this.httpCustomRequest,
            onChange: this.handleChange,
        };
        return (
            <div style={{width: '100%'}}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">将拖拽文件至此处上传</p>
                </Dragger>
                {clipboard ?
                    <p className="ant-upload-hint">
                        <Icon type="copy" onClick={() => this.handleCopyClick(file.url)} style={{margin: '0 2px'}}/>复制到剪贴板
                    </p>
                    : null
                }
            </div>

        )
    }
}

export default FileDragger
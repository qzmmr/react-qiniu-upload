import React, {Component} from 'react';
import http from 'https-axios'
import QiniuUpload from "../src/components/QiniuUpload";

const ACTION_QINIU_TOKEN = 'ACTION_QINIU_TOKEN'

class Demo extends Component {
    state = {
        value: '',
        token: ''
    }
    onChange = (value) => {
        this.setState({value: value})
    }

    componentDidMount() {
        this.init()
    }

    init() {
        const defaultHeader = {
            'content-type': 'application/json; charset=utf-8',
            'accept': 'application/json'
        }
        http.POST('you url', {
            data: {},
            sign: '',
            timestamp: ''
        }, this, ACTION_QINIU_TOKEN, defaultHeader)
    }

    onRealSuccess = (res, action) => {
        switch (action) {
            case ACTION_QINIU_TOKEN: {
                if (res.code === 200) {
                    this.setState({token: res['data'].token})
                }
                else {
                    this.onFailure(res.code, res.data, action)
                }
                break
            }
        }
    }

    onFailure = (code, data, action) => {

    }

    onError = () => {

    }

    render() {
        return (
            <div className="App" style={{background: '#000', padding: 10}}>
                <QiniuUpload
                    token={this.state.token}
                    value={this.state.value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Demo;

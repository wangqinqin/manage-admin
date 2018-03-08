import React, {Component} from 'react';
import { Spin, Alert } from 'antd';

export default class Loading extends Component {
    render() {
        return (
            <div style={{backgroundColor:'#fff',height:'100%',textAlign:'center',paddingTop:200}}>
                <Spin tip="Loading..." size="large" />
            </div>
        )
    }
}
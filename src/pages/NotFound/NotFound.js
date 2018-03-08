import React, {Component} from 'react';

export default class NotFound extends Component {

    render() {
        return (
            <div style={{textAlign:'center',paddingTop:200}}>
                <img src={require('./noAdmin.png')}/>
            </div>
        )
    }
}
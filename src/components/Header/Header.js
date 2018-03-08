import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, message } from 'antd';

import './header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: ''
        }
    }
    componentWillMount(){

    }

    componentDidMount(){
    }

    changeList(userName){
        this.setState({userName});
    }
    render() {
        return (


            <div className="header-container">
                <div style={{float:'left',verticalAlign:'middle',marginLeft:30,fontSize:16,color:'#fff'}}>商品运营管理平台</div>
                <div style={{float:'right',marginRight:45}}>
                    <span className="header-user">HI！  {this.state.userName}</span>
                    <NavLink to="/Personal"><Icon type="user" className='icon-btn header-icon' style={{fontSize:20}}/></NavLink>
                    {/*<Icon type="poweroff" className='icon-btn header-icon'  onClick={()=>{window.location.href = '/loginOut'}} />*/}
                </div>
            </div>
        )
    }
}
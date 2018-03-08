import React, {Component} from 'react';
import Nav from 'components/Nav/Nav';
import Header from 'components/Header/Header';
import getRouter from 'router/router';
import { withRouter } from 'react-router-dom';
import './App.css';
import { message } from 'antd';
import { doRequest } from '../../util/util';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus:[]
        };

    };

    componentWillMount(){

    }

    componentDidMount(){
        this.getPersonalInfo();
    }

    getPersonalInfo(){
        doRequest({
            isMock:true,
            url:'/account/getUserInfo',
            success:(data)=> {
                if(data.code == '00' && data.data){
                    this.headerlRef && this.headerlRef.changeList(data.data.userName);
                    this.navRef && this.navRef.changeList(data.data.menus);
                    this.setState({menus:data.data.menus})
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }
    render() {
        return (
            <div className="whole-container">
                <Header
                    ref={ref => this.headerlRef = ref}
                />
                <div className="page-container">
                    <Nav
                        ref={ref => this.navRef = ref}
                    />
                    {getRouter(this.state.menus)}
                </div>
            </div>
        )
    }
}

export default withRouter(App);
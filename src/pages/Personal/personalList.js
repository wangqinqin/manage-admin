import React, {Component} from 'react';
import { Icon, message  } from 'antd';
import { doRequest } from '../../util/util';

export default class PersonalList extends Component {
    constructor(props){
        super(props);
        this.state = {
            personInfoList:{},
        };
    }

    componentWillMount(){}

    componentDidMount(){
        this.getPersonalInfo();
    }

    getPersonalInfo(){
        let personInfoList;
        doRequest({
            isMock:true,
            url:'/account/getUserInfo',
            success:(data)=> {
                if(data.code == '00' && data.data){
                    personInfoList = data.data;
                    this.setState({personInfoList})
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    changeMobile = () => {
        this.props.changeMobile();
    };

    changePassword = () => {
        this.props.changePassword();
    };


    render() {
        return (
            <div>
                <div className="personal-part">
                    <div className="select-title">用户名</div>
                    <span>{this.state.personInfoList.userName || '无信息'}</span>
                </div>
                <div className="personal-part">
                    <div className="select-title">手机号</div>
                    <span className="could-edit">{this.state.personInfoList.mobile || '无信息'}</span>
                    <Icon type="edit"
                          onClick={this.changeMobile}
                    />
                </div>
                <div className="personal-part">
                    <div className="select-title">登录密码</div>
                    <span className="could-edit">********</span>
                    <Icon type="edit"
                          onClick={this.changePassword}
                    />

                </div>
                <div className="personal-part">
                    <div className="select-title">姓名</div>
                    <span>{this.state.personInfoList.realName || '无信息'}</span>
                </div>
                <div className="personal-part">
                    <div className="select-title">部门</div>
                    <span>{this.state.personInfoList.department || '无信息'}</span>
                </div>
                <div className="personal-part">
                    <div className="select-title">职位</div>
                    <span>{this.state.personInfoList.position || '无信息'}</span>
                </div>
            </div>
        )
    }
}
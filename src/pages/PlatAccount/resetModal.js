import React, {Component} from 'react';
import { doRequest, isEqual, isPsd, isNull } from '../../util/util';
import {  Input, message , Modal } from 'antd';
import md5 from 'blueimp-md5';

export default class AccModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            visiblePassword:false,
            passwordNew:'',
            passwordNewAgain:'',
            bombUserId:'',
        }
    }

    componentWillMount(){}

    componentDidMount(){}


    changePassword = (id) => {
        this.setState({
            visiblePassword: true,
            bombUserId:id,
            passwordNew:'',
            passwordNewAgain:'',
        });
    };
    handlePasswordOk = () => {
        !isNull(this.state.passwordNew) && message.error("请输入新密码");
        isNull(this.state.passwordNew) && !isNull(this.state.passwordNewAgain) && message.error("请再次输入新密码");
        isNull(this.state.passwordNew) && !isPsd(this.state.passwordNew) && message.error("密码由6-16位字母或数字任意组合");
        isNull(this.state.passwordNew) && isNull(this.state.passwordNewAgain) && !isEqual(this.state.passwordNew,this.state.passwordNewAgain) && message.error("两次输入不一致");
        if(!isNull(this.state.passwordNew)|| !isNull(this.state.passwordNewAgain) ||
            !isPsd(this.state.passwordNew) || !isEqual(this.state.passwordNew,this.state.passwordNewAgain)){return;}
        this.setState({confirmLoading: true});
        doRequest({
            isMock:true,
            url:'/account/resetPassword',
            type:'post',
            data:{
                selfFlag:0,
                userId:this.state.bombUserId,
                passwordNew:md5(this.state.passwordNew),
            },
            success:(data)=> {
                if(data.code == '00'){
                    message.success('更改成功');
                    setTimeout(() => {
                        this.setState({
                            visiblePassword: false,
                            confirmLoading: false,
                        });
                    }, 500);
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                    this.setState({
                        confirmLoading: false,
                    });
                }else{
                    message.error("出错啦");
                    this.setState({
                        confirmLoading: false,
                    });
                }
            }
        });


    };
    handlePasswordCancel = () => {
        this.setState({
            visiblePassword: false,
        });
    };

    render() {
        const { confirmLoading, visiblePassword } = this.state;
        return (
            <Modal title="重置密码"
                   visible={visiblePassword}
                   width={340}
                   onOk={this.handlePasswordOk}
                   confirmLoading={confirmLoading}
                   onCancel={this.handlePasswordCancel}
            >
                <div>
                    <div className="bomb-title bomb-title-lg must">新密码</div>
                    <Input
                        placeholder="输入新密码"
                        type="password"
                        style={{ width: 220 }}
                        value={this.state.passwordNew}
                        onChange={e => this.setState({passwordNew:e.target.value})}
                    />
                </div>
                <div style={{marginTop: 10}}>
                    <div className="bomb-title bomb-title-lg must">再次输入</div>
                    <Input
                        placeholder="再次输入新密码"
                        type="password"
                        style={{ width: 220 }}
                        value={this.state.passwordNewAgain}
                        onChange={e => this.setState({passwordNewAgain:e.target.value})}
                    />
                </div>
            </Modal>

        )
    }
}
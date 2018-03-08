import React, {Component} from 'react';
import { doRequest, isEqual, isPsd, isNull } from '../../utils/utils';
import { Modal, Input, message  } from 'antd';
import md5 from 'blueimp-md5';

export default class ResetModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            visiblePassword: false,
            confirmLoading: false,

            passwordOld:'',
            passwordNew:'',
            passwordNewAgain:'',
        }
    }

    componentWillMount(){}

    componentDidMount(){}


    changePassword = () => {
        this.setState({
            visiblePassword: true,
            passwordOld:'',
            passwordNew:'',
            passwordNewAgain:'',
        });
    };
    handlePasswordOk = () => {
        !isNull(this.state.passwordOld) &&  message.error("请输入当前密码");
        !isNull(this.state.passwordNew) &&  message.error("请输入新密码");

        isNull(this.state.passwordOld) && !isPsd(this.state.passwordNew) &&  message.error("新密码由6-16位字母或数字任意组合");
        isNull(this.state.passwordNew) && !isNull(this.state.passwordNewAgain) &&  message.error("请再次输入新密码");

        isNull(this.state.passwordNew) && isNull(this.state.passwordNewAgain) && !isEqual(this.state.passwordNew,this.state.passwordNewAgain) &&  message.error("两次输入密码不一致");
        if(!isNull(this.state.passwordOld) || !isNull(this.state.passwordNew) || !isNull(this.state.passwordNewAgain)
            || !isPsd(this.state.passwordNew) || !isEqual(this.state.passwordNew,this.state.passwordNewAgain)){
            return;
        }
        this.setState({confirmLoading: true});
        doRequest({
            isMock:true,
            url:'/account/resetPassword',
            type:'post',
            data:{
                selfFlag:1,
                passwordOld:md5(this.state.passwordOld),
                passwordNew:md5(this.state.passwordNew),
            },
            success:(data)=> {
                if(data.code == '00'){
                    message.success('操作成功,请重新登录');
                    setTimeout(() => {
                        this.setState({
                            visiblePassword: false,
                            confirmLoading: false,
                        });
                    }, 500);
                    // window.location.href = '/loginOut';
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
        const { visiblePassword, confirmLoading } = this.state;
        return (
            <Modal title="修改密码"
                   visible={visiblePassword}
                   width={340}
                   onOk={this.handlePasswordOk}
                   confirmLoading={confirmLoading}
                   onCancel={this.handlePasswordCancel}
            >
                <div>
                    <div className="bomb-title bomb-title-lg must">当前密码</div>
                    <Input
                        placeholder="输入当前密码"
                        type="password"
                        style={{ width: 220 }}
                        value={this.state.passwordOld}
                        onChange={e => this.setState({passwordOld:e.target.value})}
                    />
                </div>
                <div  style={{marginTop: 10}}>
                    <div className="bomb-title bomb-title-lg must">新密码</div>
                    <Input
                        placeholder="输入新密码"
                        type="password"
                        style={{ width: 220 }}
                        value={this.state.passwordNew}
                        onChange={e => this.setState({passwordNew:e.target.value})}
                    />
                </div>
                <div  style={{marginTop: 10}}>
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
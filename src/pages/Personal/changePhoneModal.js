import React, {Component} from 'react';
import { doRequest, isPhone, isNull } from '../../utils/utils';
import { Modal, Input, message  } from 'antd';

export default class ChangePhoneModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            visibleMobile: false,
            confirmLoading: false,
            sendMsg:'获取验证码',
            canClick:true,
            mobile:'',
            code:'',
        };
        this.clock = '';
        this.nums = 60;
    }

    componentWillMount(){}

    componentDidMount(){}


    sendCode() {
        this.setState({sendMsg: this.nums+'s重新获取',canClick:false});
        this.clock = setInterval(()=>{this.doLoop()}, 1000);
    };
    doLoop() {
        this.nums--;
        if(this.nums > 0){
            this.setState({sendMsg: this.nums+'s重新获取'});
        }else{
            clearInterval(this.clock);
            this.setState({sendMsg:'重新获取',canClick:true});
            this.nums = 60;
        }
    };
    sendSmsCode(){
        !isNull(this.state.mobile) && message.error("请输入手机号");
        isNull(this.state.mobile) && !isPhone(this.state.mobile) &&  message.error("请输入正确的手机号");
        if(!isNull(this.state.mobile) || !isPhone(this.state.mobile)){
            return;
        }
        this.setState({sendMsg:'正在发送中...',canClick:false});
        doRequest({
            isMock:true,
            url:'/account/sendSmsCode',
            type:'post',
            data:{
                mobile:this.state.mobile,
            },
            success:(data)=> {
                if(data.code == '00') {
                    this.sendCode();
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                    this.setState({sendMsg:'获取验证码',canClick:true});
                }else{
                    message.error("出错啦");
                    this.setState({sendMsg:'获取验证码',canClick:true});
                }
            }
        })
    };

    changeMobile = () => {
        clearInterval(this.clock);
        this.nums = 60;
        this.setState({sendMsg:'获取验证码',canClick:true});
        this.setState({
            visibleMobile: true,
            sendMsg:'获取验证码',
            mobile:'',
            code:'',
        });
    };
    handleMobileOk = () => {
        !isNull(this.state.mobile) && message.error("请输入手机号");
        isNull(this.state.mobile) && !isPhone(this.state.mobile) && message.error("请输入正确的手机号");
        isNull(this.state.mobile) && isPhone(this.state.mobile) && !isNull(this.state.code) &&  message.error("请输入验证码");
        if(!isNull(this.state.mobile) || !isPhone(this.state.mobile) || !isNull(this.state.code)){
           return;
        }
        this.setState({confirmLoading: true});

        doRequest({
            isMock:true,
            url:'/account/modifyMobile',
            type:'post',
            data:{
                mobile:this.state.mobile,
                code:this.state.code,
            },
            success:(data)=> {
                if(data.code == '00') {
                    message.success('更改成功');
                    setTimeout(() => {
                        this.setState({
                            visibleMobile: false,
                            confirmLoading: false,
                        });
                    }, 500);
                    this.props.changePersonalList();
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                    this.setState({confirmLoading: false});
                }else{
                    message.error("出错啦");
                    this.setState({confirmLoading: false});
                }
            }
        });


    };
    handleMobileCancel = () => {
        this.setState({visibleMobile: false});
    };

    render() {
        const { visibleMobile, confirmLoading } = this.state;

        return (
            <Modal title="修改手机号"
                   visible={visibleMobile}
                   width={340}
                   onOk={this.handleMobileOk}
                   confirmLoading={confirmLoading}
                   onCancel={this.handleMobileCancel}
            >
                <div>
                    <div className="bomb-title bomb-title-lg must">新手机号</div>
                    <Input
                        placeholder="输入新手机号"
                        style={{ width: 220 }}
                        value={this.state.mobile}
                        onChange={e => this.setState({mobile:e.target.value})}
                    />
                    <a      className={"send-msg-btn " +(!this.state.canClick &&'disabled')}
                            onClick={()=>this.sendSmsCode()}
                            disabled={!this.state.canClick}
                            style={{position:'absolute',right:30}}>{this.state.sendMsg}</a>
                </div>
                <div  style={{marginTop: 10}}>
                    <div className="bomb-title bomb-title-lg must">验证码</div>
                    <Input
                        placeholder="输入验证码"
                        style={{ width: 220 }}
                        value={this.state.code}
                        onChange={e => this.setState({code:e.target.value})}
                    />
                </div>
            </Modal>

        )
    }
}
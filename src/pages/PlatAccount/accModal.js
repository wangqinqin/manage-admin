import React, {Component} from 'react';
import { doRequest, is30Long, is50Long, isNull, isPhone, isPsd, isUserName } from '../../utils/utils';
import {  Input, message , Modal, Radio, Checkbox, Row, Col  } from 'antd';
import md5 from 'blueimp-md5';

export default class AccModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalTitle:'',
            modalShow:false,
            bombCheckMenu:[],
            bombId:'',
            bombRealName:'',
            bombUserName:'',
            bombMobile:'',
            bombPassword:'',
            bombDepartment:'',
            bombPosition:'',
            bombStatus:1,
            addFlag:0,
            MenuAllList:[],
            confirmLoading:false
        }
    }

    componentWillMount(){}

    componentDidMount(){
        this.getAllMenu();
    }

    /*编辑弹框*/
    editPlatAccount = (type,list) => {
        if(type == 'edit'){
            this.setState({
                bombCheckMenu:list.menuList,
                bombId:list.id,
                bombRealName:list.realName,
                bombUserName:list.userName,
                bombMobile:list.mobile,
                bombPassword:'',
                bombDepartment:list.department,
                bombPosition:list.position,
                bombStatus:list.status,
                addFlag:0,
                modalShow: true
            });
        }else{
            this.setState({
                bombCheckMenu:[],
                bombId:'',
                bombRealName:'',
                bombUserName:'',
                bombMobile:'',
                bombPassword:'',
                bombDepartment:'',
                bombPosition:'',
                bombStatus:1,
                addFlag:1,
                modalShow: true,
            })
        }
    };


    handleEditOk = () => {
        if(this.state.addFlag == 1){
            !isNull(this.state.bombRealName) && message.error("请填写姓名") ;
            !is30Long(this.state.bombRealName) && message.error("姓名长度限制在30个字符内");
            !is50Long(this.state.bombDepartment) && message.error("部门长度限制在50个字符内");
            !is50Long(this.state.bombPosition) && message.error("职位长度限制在50个字符内");

            !isNull(this.state.bombUserName) && message.error("请填写用户名");
            !is30Long(this.state.bombUserName) && message.error("用户名长度限制在30个字符内");
            isNull(this.state.bombUserName) && is30Long(this.state.bombUserName) && !isUserName(this.state.bombUserName) && message.error("用户名为数字、字母及下划线_的任意组合，不允许纯数字");
            !isNull(this.state.bombMobile) && message.error("请填写手机号");
            isNull(this.state.bombMobile) && !isPhone(this.state.bombMobile) && message.error("请正确填写手机号");
            !isNull(this.state.bombPassword) && message.error("请填写密码");
            isNull(this.state.bombPassword) && !isPsd(this.state.bombPassword) && message.error("密码由6-16位字母或数字任意组合");
            if(!isNull(this.state.bombRealName)|| !is30Long(this.state.bombRealName) ||
                !is50Long(this.state.bombDepartment) || !is50Long(this.state.bombPosition)){return;}
            if(!isNull(this.state.bombUserName) || !is30Long(this.state.bombUserName)||
                !isUserName(this.state.bombUserName) || !isNull(this.state.bombMobile) ||
                !isPhone(this.state.bombMobile) || !isNull(this.state.bombPassword) ||
                !isPsd(this.state.bombPassword) || !isNull(this.state.bombUserName)){return;}
        }else{
            !isNull(this.state.bombRealName) && message.error("请填写姓名") ;
            !is30Long(this.state.bombRealName) && message.error("姓名长度限制在30个字符内");
            !is50Long(this.state.bombDepartment) && message.error("职位长度限制在50个字符内");
            !is50Long(this.state.bombPosition) && message.error("职位长度限制在50个字符内");
            if(!isNull(this.state.bombRealName)|| !is30Long(this.state.bombRealName) ||
                !is50Long(this.state.bombDepartment) || !is50Long(this.state.bombPosition)){return;}
        }
        this.setState({confirmLoading: true});
        doRequest({
            isMock:true,
            url:'/account/addOrModAdminUser',
            type:'post',
            data:{
                addFlag:this.state.addFlag,
                userMenuList:JSON.stringify(this.state.bombCheckMenu),
                id:this.state.bombId,
                realName:this.state.bombRealName,
                userName:this.state.bombUserName,
                mobile:this.state.bombMobile,
                password:md5(this.state.bombPassword),
                department:this.state.bombDepartment,
                position:this.state.bombPosition,
                status:this.state.bombStatus,
            },
            success:(data)=> {
                if(data.code == '00') {
                    message.success('操作成功');
                    setTimeout(() => {
                        this.setState({
                            modalShow: false,
                            confirmLoading: false,
                        });
                    }, 500);
                    if(this.state.addFlag){
                        this.props.changeTableList({pageNum:1});
                    }else{
                        this.props.changeTableList();
                    }
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

    handleEditCancel = () => {
        this.setState({
            modalShow: false
        });
    };

    getAllMenu = () => {
        doRequest({
            isMock:true,
            url:'/account/getAdminMenuList',
            type:'post',
            success:(data)=> {
                if(data.code == '00' && data.data) {
                    const MenuAllList = data.data;
                    let d = MenuAllList.map((v,i)=>{
                        return <Col key={i} span={8} style={{paddingBottom:10}}><Checkbox value={v.id}>{v.menuName}</Checkbox></Col>
                    });
                    this.setState({MenuAllList:d})
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    };

    render() {
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;
        return (
            <Modal title={this.state.addFlag? '添加平台账号':'编辑平台账号'}
                   visible={this.state.modalShow}
                   width={700}
                   onOk={this.handleEditOk}
                   confirmLoading={this.state.confirmLoading}
                   onCancel={this.handleEditCancel}
            >
                <div className="bomb-line-div">
                    <div className="bomb-title bomb-title-lg must">姓名</div>
                    <Input
                        placeholder="输入真实姓名"
                        value={this.state.bombRealName}
                        style={{ width: 220 }}
                        onChange={e => this.setState({bombRealName:e.target.value})}
                    />
                </div>
                <div   className="bomb-line-div">
                    <div className="bomb-title bomb-title-lg must">用户名</div>
                    <Input
                        placeholder="输入用户名"
                        value={this.state.bombUserName}
                        disabled={!!!this.state.addFlag}
                        style={{ width: 220 }}
                        onChange={e => this.setState({bombUserName:e.target.value})}
                    />
                </div>
                <div className="bomb-line-div">
                    <div className="bomb-title bomb-title-lg must">手机号</div>
                    <Input
                        placeholder="输入手机号"
                        value={this.state.bombMobile}
                        disabled={!!!this.state.addFlag}
                        style={{ width: 220 }}
                        onChange={e => this.setState({bombMobile:e.target.value})}
                    />
                </div>

                {!!this.state.addFlag ?
                    <div  className="bomb-line-div">
                        <div className="bomb-title bomb-title-lg must">密码</div>
                        <Input
                            placeholder="输入登录密码"
                            style={{ width: 220 }}
                            value={this.state.bombPassword}
                            onChange={e => this.setState({bombPassword:e.target.value})}
                        />
                    </div>:
                    <div></div>
                }
                <div className="bomb-line-div">
                    <div className="bomb-title bomb-title-lg">部门</div>
                    <Input
                        placeholder="输入所属部门"
                        value={this.state.bombDepartment}
                        style={{ width: 220 }}
                        onChange={e => this.setState({bombDepartment:e.target.value})}
                    />
                </div>
                <div  className="bomb-line-div">
                    <div className="bomb-title bomb-title-lg">职位</div>
                    <Input
                        placeholder="输入担任职位"
                        value={this.state.bombPosition}
                        style={{ width: 220 }}
                        onChange={e => this.setState({bombPosition:e.target.value})}
                    />
                </div>
                <div className="bomb-block-div">
                    <div className="bomb-title bomb-title-lg must">状态</div>
                    <RadioGroup onChange={e=>this.setState({bombStatus:e.target.value})} value={this.state.bombStatus} defaultValue={1}>
                        <RadioButton value={1}>启用</RadioButton>
                        <RadioButton value={0}>停用</RadioButton>
                    </RadioGroup>
                </div>
                <div className="bomb-block-div">
                    <div className="bomb-title bomb-title-lg" style={{verticalAlign: 'top'}}>授权</div>
                    <Checkbox.Group
                        onChange={checkedValues => this.setState({bombCheckMenu:checkedValues})}
                        value = {this.state.bombCheckMenu}>
                        <Row>
                            {this.state.MenuAllList}
                        </Row>
                    </Checkbox.Group>
                </div>
            </Modal>

        )
    }
}
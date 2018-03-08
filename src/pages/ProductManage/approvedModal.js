import React, {Component} from 'react';
import { doRequest, Emiter, isNull } from '../../utils/utils';
import {  Input, message , Modal, Radio } from 'antd';

export default class ApprovedModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalShow:false,
            confirmLoading:false,
            loading: false,
            id:'',
            remark:'',
            remarkOK:'',//同意
            result:'',
            status:'',
        };

    }

    componentWillMount(){}



    componentDidMount(){}


    handleEditOk = () => {
        if(this.state.result && this.state.result === '0'){
            !isNull(this.state.remark) && message.error('驳回商品时，需要填写备注');
            if(!isNull(this.state.remark)) return;
        }
        if(this.state.status === 1){
            !isNull(this.state.remark) && message.error('下架商品时，需要填写备注');
            if(!isNull(this.state.remark)) return;
        }
        if(this.state.status === 5){
            !isNull(this.state.remarkOK) && message.error('同意下架商品时，需要填写备注');
            if(!isNull(this.state.remarkOK)) return;
        }
        this.setState({confirmLoading: true});
        doRequest({
            isMock:true,
            url:'/product/changeStatus',
            type:'post',
            data:{
                productId:this.state.id,
                status:this.state.status,
                result:this.state.result,
                remark:this.state.result === '1' ?this.state.remarkOK : this.state.remark,
            },
            success:(data)=> {
                if(data.code === '00'){
                    message.success(data.codeMsg);
                    this.setState({confirmLoading: false,modalShow: false});
                    this.props.changeTableList();
                    Emiter.emit('changeChart');
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                    this.setState({confirmLoading: false});
                }else{
                    message.error("出错啦");
                    this.setState({confirmLoading: false});
                }
            }
        });
    };

    handleEditCancel = () => {
        this.setState({modalShow: false});
    };
    approved(id,status,remark){

        this.setState({modalShow: true,remark:'',id,status:status});
        switch (status){
            case 1:this.setState({result:'',remarkOK:''});break;
            // case 2:this.setState({result:'',remark:remark});break;
            // case 3:this.setState({result:'',remark:''});break;
            case 4:this.setState({result:'1',remarkOK:remark});break;
            case 5:this.setState({result:'1',remarkOK:remark});break;
            case 6:this.setState({result:'1',remarkOK:remark});break;
        }

    }

    render() {
        const RadioGroup = Radio.Group;
        const { TextArea } = Input;
        return (

            <Modal title="操作"
                   visible={this.state.modalShow}
                   width={340}
                   onOk={this.handleEditOk}
                   confirmLoading={this.state.confirmLoading}
                   onCancel={this.handleEditCancel}
            >
                    {this.state.result &&
                        <div style={{marginTop: 10}}>
                            <div className="bomb-title bomb-title-lg must">审批结果</div>
                            <RadioGroup name="radiogroup"
                                value={this.state.result} onChange={e=>this.setState({result:e.target.value})}>
                                <Radio value="1">同意</Radio>
                                <Radio value="0">不同意</Radio>
                            </RadioGroup>
                        </div>
                    }
                    {this.state.status === 1 &&
                        <div style={{marginTop: 10}}>
                            <div className="bomb-title bomb-title-lg must">操作</div>
                            <RadioGroup name="radiogroup" defaultValue={2}>
                                <Radio value={2}>下架</Radio>
                            </RadioGroup>
                        </div>
                    }

                <div style={{marginTop: 10}}>
                    <div className={"bomb-title bomb-title-lg "+((this.state.status === 1 || this.state.status === 5 || this.state.result === "0") && 'must')}>备注</div>
                    { this.state.result === '1' &&
                        <TextArea rows={4}
                                  style={{ width: 220}}
                                  value={this.state.remarkOK}
                                  onChange={e => this.setState({remarkOK:e.target.value})}
                        />
                    }
                    { this.state.result !== '1'  &&
                        <TextArea rows={4}
                                  style={{width: 220}}
                                  value={this.state.remark}
                                  onChange={e => this.setState({remark: e.target.value})}
                        />
                    }
                </div>

            </Modal>

        )
    }
}
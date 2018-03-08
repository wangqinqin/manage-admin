import React, {Component} from 'react';
import { Button, Select, Input, DatePicker, message   } from 'antd';
import { doRequest } from '../../utils/utils';

export default class QuerySelect extends Component {
    constructor(props){
        super(props);
        this.state = {
            key:this.props.key1 || '',
            guaranteeId:[],
            status:'',
            beginDate:'',
            endDate:'',
            category:[],
            pageNum:1
        };
    }

    componentWillMount(){
        doRequest({
            url:'/product/getDictGuarantee',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    this.setState({guaranteecheck:data.data});
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    componentDidMount(){}

    /*查询按钮触发 获取列表*/
    queryTableOK = ()=>{
        this.props.selectChange(this.state)
    };
    guaranteeIdChange =(value)=> {
        this.setState({guaranteeId:JSON.stringify(value)})
    };
    categoryChange =(value)=> {
        this.setState({category:JSON.stringify(value)})
    };
    getDictProductCategory(categoryCheck){
        if(categoryCheck) {
            this.setState({categoryCheck});
        }
    }
    render() {
        const Option = Select.Option;
        const {  RangePicker } = DatePicker;


        return (
            <div style={{lineHeight:1}}>

                <div className="select-one-condition">
                    <div className="select-title">商品分类</div>
                    <Select
                        mode="multiple"
                        style={{ width: 220 }}
                        placeholder="全部"
                        onChange={this.categoryChange}
                    >
                        {this.state.categoryCheck && this.state.categoryCheck.map((v,i)=>{
                            return(<Option key={v.id}>{v.name}</Option>)
                        })}
                    </Select>
                </div>
                <div className="select-one-condition">
                    <div className="select-title">状态</div>
                    <Select labelInValue defaultValue={{ key: '' }} style={{ width: 80 }} onChange={(res) => this.setState({status:res.key})}>
                        <Option value="disabled" disabled>请选择</Option>
                        <Option value="">全部</Option>
                        <Option value="4">待审核</Option>
                        <Option value="1">已上架</Option>
                        <Option value="2">已下架</Option>
                        <Option value="3">已驳回</Option>
                    </Select>
                </div>
                <div className="select-one-condition" style={{marginTop: -10}}>
                    <div className="select-one-condition lg">
                        <div className="select-title">审批时间</div>
                        <RangePicker  style={{ width:180 }}
                                      onChange={(data,dataString) => {this.setState({beginDate:dataString[0]}), this.setState({endDate:dataString[1]})}} />

                    </div>
                    <div  className="select-one-condition lg">
                        <div className="select-title">快速搜索</div>
                        <Input
                            placeholder="输入商品名称/店铺名称"
                            style={{ width: 220 }}
                            value={this.state.key}
                            onChange={e => this.setState({key:e.target.value})}
                        />
                    </div>
                    <Button type="primary" icon="search" onClick={this.queryTableOK} />
                </div>
            </div>
        )
    }
}
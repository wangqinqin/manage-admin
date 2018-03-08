import React, {Component} from 'react';
import { Button, Select, Input, DatePicker  } from 'antd';


export default class QuerySelect extends Component {
    constructor(props){
        super(props);
        this.state = {
            key:'',
            beginDate:'',
            endDate:'',
            status:'',
            pageNum:1
        };
    }

    componentWillMount(){}

    componentDidMount(){}

    /*查询按钮触发 获取列表*/
    queryTableOK = ()=>{
        this.props.selectChange(this.state)
    };

    render() {
        const Option = Select.Option;
        const {  RangePicker } = DatePicker;
        return (
            <div style={{lineHeight:1}}>
                <div className="select-one-condition">
                    <div className="select-title">状态</div>
                    <Select labelInValue defaultValue={{ key: '' }} style={{ width: 80 }} onChange={(res) => this.setState({status:res.key})}>
                        <Option value="disabled" disabled>请选择</Option>
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="0">停用</Option>
                    </Select>
                </div>

                <div className="select-one-condition lg">
                    <div className="select-title">创建时间</div>
                    <RangePicker  style={{ width:180 }}
                                  onChange={(data,dataString) => {this.setState({beginDate:dataString[0]}),this.setState({endDate:dataString[1]})}} />

                </div>
                <div  className="select-one-condition lg">
                    <div className="select-title">快速搜索</div>
                    <Input
                        placeholder="姓名/手机号/部门/职位"
                        style={{ width: 220 }}
                        onChange={e => this.setState({key:e.target.value})}
                    />
                </div>
                <Button type="primary" icon="search" onClick={this.queryTableOK} />
            </div>
        )
    }
}
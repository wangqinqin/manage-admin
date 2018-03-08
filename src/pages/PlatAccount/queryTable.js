import React, {Component} from 'react';
import {  Table, message, Button   } from 'antd';
import {doRequest, format} from '../../utils/utils';

export default class QueryTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            key:'',
            startDate:'',
            EndDate:'',
            status:'',

            data: [],
            pagination: {current:1},
            loading: false,
        };
        this.ajaxData = {};
        this.platAccountList = [{
            title: '姓名',
            dataIndex: 'realName',
            width: '10%',
        }, {
            title: '用户名',
            dataIndex: 'userName',
            width: '10%',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            width: '15%',
        }, {
            title: '部门',
            dataIndex: 'department',
            width: '15%',
        },{
            title: '职位',
            dataIndex: 'position',
            width: '14%',
        },{
            title: '状态',
            dataIndex: 'status',
            render:status => status == 1 ?'启用':'停用',
            width: '5%',
        },{
            title: '创建时间',
            sorter: (a, b) => a.createTime - b.createTime,
            dataIndex: 'createTime',
            render:createTime => format(createTime, 'yyyy-MM-dd'),
            width: '15%',
        },{
            title: '操作',
            dataIndex: '',
            render: (text, results) => {
                const editable = results.status == 1?true:false;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                (<span className="a-span">
                            <a onClick={() => this.editPlatAccount('edit',results)}>编辑 </a> |
                            <a onClick={() => this.changePassword(results.id)}>  重置密码</a>
                        </span>) :
                                (<span className="a-span">
                            <a onClick={() => this.editPlatAccount('edit',results)}>编辑</a>
                        </span>)
                        }
                    </div>
                );
            },
            width: '15%',
        }];
    }

    componentWillMount(){}

    componentDidMount(){
        this.getTableList();
    }

    /*获取列表数据ajax*/
    getTableList = (params = {}) =>{
        const pagination = { ...this.state.pagination };
        params.pageNum = params.pageNum || pagination.current;
        this.setState({ loading: true,...params});
        const paramsNew = { ...this.ajaxData,...params };
        this.ajaxData = {...this.state,...params};
        doRequest({
            isMock:true,
            url:'/account/getAdminUserList',
            type:'post',
            data:{
                pageSize:10,
                ...paramsNew,
            },
            success:(data)=> {
                if(data.code == '00' && data.data){
                    let results = data.data;
                    /*------------mock分页--------------*/
                    if(params.pageNum == 2){
                        results.list.slice(11,20);
                    }else if(params.pageNum == 3){
                        results.list.slice(21);
                    }
                    /*----------------------------------*/
                    // pagination.current = results.pageNum;
                    pagination.total = results.total;
                    pagination.pageSize = 10;
                    this.setState({
                        loading: false,
                        data: results.list,
                        pagination
                    });
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    };
    /*分页改变查询 获取列表*/
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({pagination: pager},()=> {
            this.getTableList({
                key:this.state.key,
                status:this.state.status,
                beginDate:this.state.beginDate,
                endDate:this.state.endDate,
                sortType:sorter.order == 'ascend'?'1':'0'
            })
        });

    };

    /*编辑弹框*/
    editPlatAccount = (type,list) => {
        this.props.editPlatAccount(type,list);
    };

    changePassword = (id) => {
        this.props.changePassword(id);
    };


    render() {
        return (
            <div>
                <Button type="primary"  className="add-table-btn" onClick={()=>this.editPlatAccount('add')}>添加账号</Button>
                <Table columns={this.platAccountList}
                       rowKey={record => record.id}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                />
            </div>
        )
    }
}
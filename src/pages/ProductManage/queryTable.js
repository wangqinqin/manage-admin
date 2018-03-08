import  React,  {Component}  from  'react';
import  {    Table,  message,  Popconfirm    }  from  'antd';
import  {doRequest,  format,  Emiter  }  from  '../../util/util';


export  default  class  QueryTable  extends  Component  {
    constructor(props){
        super(props);
        this.state  =  {
            key:this.props.key2 || '',
            beginDate:'',
            endDate:'',
            status:'',
            timeSort:'',
            guaranteeId:[],
            category:"",

            data:  [],
            pagination: {current:1},
            loading:  false,

            dictGuarantee:{},
            dictRepay:{},
            dictCategory:{},
            sortedInfo: null,
        };
        this.ajaxData = {};
        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        this.platAccountList  =  [{
            title:  '商品名称',
            dataIndex:  'productName',
            width:  '10%',
        }  ,{
            title:  '商品分类',
            dataIndex:  'category',
            render:category  =>  {
                return  category.map((v,i)=>{
                    return  this.state.dictCategory[v]  ||  '';
                }).join(',');
            },
            width:  '20%',
        }, {
            title:  '所属店铺',
            dataIndex:  'bankName',
            width:  '10%',
        },  {
            title:  '状态',
            dataIndex:  'status',
            render:status  =>  {
                switch(status){
                    case  1:  return  '已上架';break;
                    case  2:  return  '已下架';break;
                    case  3:  return  '已驳回';break;
                    case  4:  return  '待审核';break;
                    case  5:  return  '待审核';break;
                    case  6:  return  '待审核';break;
                }
            },
            width:  '6%',
        },{
            title:  <div>累计成交<br/><span className="small-font">(笔/万元)</span></div>,
            dataIndex:  '',
            render:  (text,  results)  =>  {
                return  (
                    <div>
                        {results.totalCount  ?
                            (<span>
                                    <span>{results.totalCount  ||  '-'}</span>  /
                                    <span>  {results.totalMoney  ||  '-'}</span>
                            </span>):
                            (<span>-</span>)
                        }
                    </div>
                )
            },
            width:  '10%',
        },{
            title:  '审批时间',
            sorter:  (a,  b)  =>  a.approveTime  -  b.approveTime,
            sortOrder: sortedInfo.columnKey === 'approveTime' && sortedInfo.order,
            dataIndex:  'approveTime',
            render:approveTime => format(approveTime, 'yyyy-MM-dd'),
            width: '10%',
        },{
            title: '操作历史',
            dataIndex: '',
            render: (text, results) => {
                return (
                    <a className="a-div" onClick={() => this.props.showHistory(results.id)}>查看</a>
                );
            },
            width: '8%',
        },{
            title: '操作',
            dataIndex: '',
            render: (text, results) => {
                return (
                    <div className="editable-row-operations">
                        {
                            results.status === 1 ?
                                (<span className="a-span">
                                <a onClick={() => this.props.approved(results.id,results.status,'')}>下架</a>
                            </span>) :
                                (<span className="a-span">
                                <a onClick={() => this.props.editDetail(results)}>编辑 </a> |
                                    {results.status === 2 || results.status === 3 ?
                                        <Popconfirm placement="topRight" title="商品上架后，用户可在线购买及查看，确认上架？"
                                                    onConfirm={()=>this.operate(results.id,results.status,'')}
                                                    okText="确认" cancelText="取消">
                                            <a> 上架</a>
                                        </Popconfirm>:
                                        <a onClick={() => this.props.approved(results.id,results.status,results.submitDesc)}> 审批</a>
                                    }
                            </span>)
                        }
                    </div>
                );
            },
            width: '15%',
        }];
    }


    operate = (productId, status, remark) =>{
        doRequest({
            isMock:true,
            url:'/product/changeStatus',
            type:'post',
            data:{
                productId:productId,
                status:status,
                result:this.state.result,
                remark:remark,
            },
            success:(data)=> {
                if(data.code === '00'){
                    message.success(data.codeMsg);
                    Emiter.emit('changeChart');
                    this.getTableList();
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    };
    componentWillMount(){

    }


    componentDidMount(){
        this.getDictGuarantee();
        this.getDictRepay();
        this.getTableList({key:this.state.key});
    }

    getDictGuarantee(){
        doRequest({
            url:'/product/getDictGuarantee',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    data.data.sort(function (a,b) {
                        return a.id - b.id
                    });
                    let dic={};
                    data.data.map(function (v) {
                        return dic[v.id] = v.guaranteeName
                    });
                    this.setState({
                        dictGuarantee:dic
                    })
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    getDictProductCategory(dictCategory){
        this.setState({dictCategory});
    }
    getDictRepay(){
        doRequest({
            url:'/product/getDictRepay',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    data.data.sort(function (a,b) {
                        return a.id - b.id
                    });
                    let dic ={};
                    data.data.map(function (v) {
                        return dic[v.id] = v.repayName
                    });
                    this.setState({
                        dictRepay:dic
                    })
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
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
            url:'/product/searchProductList',
            type:'post',
            data:{
                pageSize:10,
                ...paramsNew,
            },
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let results = data.data;
                    /*------------mock分页--------------*/
                    if(params.pageNum == 2){
                        results.list.slice(11);
                    }
                    /*----------------------------------*/
                    // pagination.current = results.pageNum;
                    pagination.pageSize = 10;
                    pagination.total = results.total;

                    this.setState({
                        loading: false,
                        data: results.list,
                        pagination
                    });
                }else if(data.code === '01'){
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
        this.setState({sortedInfo: sorter,pagination: pager},()=>  {
            this.getTableList({
                timeSort:sorter.columnKey==='approveTime' ? (sorter.order === 'ascend'?'1':'0'):'',
                ratioSort:sorter.columnKey==='ratio' ? (sorter.order === 'ascend'?'1':'0'):'',
                key:this.state.key,
                beginDate:this.state.beginDate,
                endDate:this.state.endDate,
                status:this.state.status,
                guaranteeId:this.state.guaranteeId,
                category:this.state.category
            })
        });
    };

    /*编辑弹框*/
    editOrgan = (type,list) => {
        this.props.editOrgan(type, list);
    };

    changePassword = (id) => {
        this.props.changePassword(id);
    };


    render() {
        return (
            <div>
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
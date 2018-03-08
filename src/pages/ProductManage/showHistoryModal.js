import React, {Component} from 'react';
import { Modal, Table, message } from 'antd';
import { doRequest } from '../../util/util';

export default class ShowHistoryModal extends Component {
    constructor(props){
        super(props);
        this.state={
            modalShow:false,
            showHistoryList:[]
        };
        this.showHistoryList = [{
            title: '审批状态',
            dataIndex: 'statusAfter',
            render:status => {
                switch(status){
                    case 1: return '已上架';break;
                    case 2: return '已下架';break;
                    case 3: return '已驳回';break;
                    case 4: return '待审核';break;
                    case 5: return '待审核';break;
                    case 6: return '待审核';break;
                }
            },
            width: '15%',
        }, {
            title: '提审时间',
            dataIndex: 'submitTime',
            width: '15%',
        },{
            title: '审批时间',
            dataIndex: 'approvalTime',
            width: '15%',
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: '55%',
        }]
    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    showHistory(id){
        doRequest({
            isMock:true,
            url:'/product/getProOperatingHistory',
            type:'post',
            data:{
                productId:id,
            },
            success:(data)=> {
                if(data.code === '00' && data.data){
                    this.setState({showHistoryList:data.data});
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
        this.setState({modalShow:true});
    }
    handleEditCancel = () => {
        this.setState({modalShow: false});
    };
    render() {
        return (
            <Modal title='操作历史'
                   visible={this.state.modalShow}
                   width={700}
                   onCancel={this.handleEditCancel}
                   footer={null}
            >
                <Table columns={this.showHistoryList}
                       rowKey={record => record.name}
                       dataSource={this.state.showHistoryList}
                       pagination={false}
                       bordered={true}
                       style={{maxHeight:500,overflow:'auto'}}
                       className="bomb-table back-light-table"
                />
            </Modal>

        )
    }
}
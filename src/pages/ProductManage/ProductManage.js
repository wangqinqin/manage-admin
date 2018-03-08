import React, {Component} from 'react';
import Page from 'components/Page/page';
import PageContentTitle from 'components/PageContentTitle/PageContentTitle'
import QueryTable from './queryTable';
import QuerySelect from './querySelect';
import ShowHistoryModal from './showHistoryModal';
import ApprovedModal from "./approvedModal";
import EditModal from "./editModal";
import { doRequest } from '../../utils/utils';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

class ProductManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            key:this.props.location.state
        };
        this.querySelectRef = null;
        this.organTableRef = null;
        this.showHistoryModalRef = null;
        this.approvedModalRef = null;
        this.editModalRef = null;
        document.title ='商品管理';
    }

    componentWillMount(){}

    componentDidMount(){
        this.getDictProductCategory();
    }

    approved = (id,status,remark) => {
        this.approvedModalRef && this.approvedModalRef.approved(id,status,remark);
    };

    selectChange = (data) =>{
        this.organTableRef && this.organTableRef.getTableList({...data});
    };
    showHistory = (id) =>{
        this.showHistoryModalRef && this.showHistoryModalRef.showHistory(id);
    };
    editDetail = (list) =>{
        this.editModalRef && this.editModalRef.editDetail(list);
    };
    getDictProductCategory(){
        doRequest({
            isMock:true,
            url:'/product/getDictProductCategory',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data) {
                    let categoryOptions = data.data;
                    data.data.sort(function (a,b) {
                        return a.id - b.id
                    });
                    let dic = {};
                    data.data.map(function (v) {
                        return dic[v.id] = v.name
                    });
                    this.querySelectRef && this.querySelectRef.getDictProductCategory(categoryOptions);
                    this.editModalRef && this.editModalRef.getDictProductCategory(categoryOptions);
                    this.organTableRef && this.organTableRef.getDictProductCategory(dic);
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                    this.setState({
                        confirmLoading: false,
                    });
                }
            }
        });
    }
    renderContent() {
        return (
            <div>
                <PageContentTitle pageContentTitle="商品列表"/>
                <QuerySelect
                    key1={this.state.key}
                    selectChange={(data)=> this.selectChange(data)}
                    ref={ref => this.querySelectRef = ref}
                />
                <QueryTable
                    key2={this.state.key}
                    showHistory={(id) => this.showHistory(id)}
                    approved={(id,status,remark)=> this.approved(id,status,remark)}
                    editDetail={(list) => this.editDetail(list)}
                    ref={ref => this.organTableRef = ref}
                />
                <ShowHistoryModal
                    ref={ref => this.showHistoryModalRef = ref}
                />
                <ApprovedModal
                    changeTableList={() => this.selectChange()}
                    ref={ref => this.approvedModalRef = ref}
                />
                <EditModal
                    changeTableList={() => this.selectChange()}
                    ref={ref => this.editModalRef = ref}
                />
            </div>
        )
    }


    render() {
        return (
            <Page
                statisticsUrl = {"/product/countProductNum"}
                content = {() => this.renderContent()}
                hasHeader = {false}
                statisticsTitle="商品数量"
                hasStatistics = {true}
            />
        )
    }
}
export default withRouter(ProductManage);
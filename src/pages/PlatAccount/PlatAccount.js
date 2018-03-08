import React, {Component} from 'react';
import Page from 'components/Page/page';
import AccModal from './accModal';
import ResetModal from './resetModal';
import QueryTable from './queryTable';
import QuerySelect from './querySelect';
import PageContentTitle from 'components/PageContentTitle/PageContentTitle';

export default class PlatAccount extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.queryTableRef = null;
        this.accModalRef = null;
        this.resetModalRef = null;
        document.title ='平台账号';
    }

    componentWillMount(){}

    componentDidMount(){}


    editPlatAccount = (type,list) => {
        this.accModalRef && this.accModalRef.editPlatAccount(type,list);
    };

    changePassword = (id) => {
        this.resetModalRef && this.resetModalRef.changePassword(id);
    };

    selectChange = (data) =>{
        this.queryTableRef && this.queryTableRef.getTableList({...data});
    };

    renderContent() {
        return (
            <div>
                <PageContentTitle pageContentTitle="平台账号"/>
                <QuerySelect
                    selectChange={(data)=> this.selectChange(data)}
                />
                <QueryTable
                    editPlatAccount={(type,list)=> this.editPlatAccount(type,list)}
                    changePassword={(data)=> this.changePassword(data)}
                    ref={ref => this.queryTableRef = ref}
                />
                <AccModal
                    ref={ref => this.accModalRef = ref}
                    changeTableList={(data)=> this.selectChange(data)}
                />
                <ResetModal
                    ref={ref => this.resetModalRef = ref}/>
            </div>
        )
    }


    render() {
        return (
            <Page
                content = {() => this.renderContent()}
                hasStatistics = {false}
                hasSelect = {true}
            />
        )
    }
}
import React, {Component} from 'react';
import Page from 'components/Page/page';
import './Personal.css'
import PageContentTitle from 'components/PageContentTitle/PageContentTitle';
import PersonalList from './personalList';
import ResetModal from "./resetModal";
import ChangePhoneModal from "./changePhoneModal";

export default class ProductManage extends Component {
    constructor(props){
        super(props);
        this.state = {};
        document.title ='个人中心';
    }

    componentWillMount(){}

    componentDidMount(){}

    changeMobile = () => {
        this.changePhoneModalRef && this.changePhoneModalRef.changeMobile();
    };

    changePassword = () => {
        this.resetModalRef && this.resetModalRef.changePassword();
    };

    changePersonalList = () =>{
        this.personalListRef && this.personalListRef.getPersonalInfo();
    };

    renderContent() {
        return (
            <div>
                <PageContentTitle  pageContentTitle="基本信息" />
                <PersonalList
                    changeMobile={(type,list)=> this.changeMobile()}
                    changePassword={(data)=> this.changePassword(data)}
                    ref={ref => this.personalListRef = ref}
                />
                <ChangePhoneModal
                    ref={ref => this.changePhoneModalRef = ref}
                    changePersonalList={(data)=> this.changePersonalList(data)}
                />
                <ResetModal
                    ref={ref => this.resetModalRef = ref}
                />

            </div>
        )
    }



    render() {
        return (
            <Page
                content = {() => this.renderContent()}
                hasStatistics = {false}
                hasSelect = {false}
            />
        )
    }
}
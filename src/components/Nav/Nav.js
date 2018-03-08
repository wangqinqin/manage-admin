import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import { Menu, Icon, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const iconImg = {
    prod:require('../App/images/productManage.png'),
    orgM:require('../App/images/organManage.png'),
    fina:require('../App/images/financingNeeds.png'),
    orgA:require('../App/images/organAccount.png'),
    plat:require('../App/images/platAccount.png'),
    regC:require('../App/images/registeredCompany.png'),
};

export default class Nav extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            menuList:[],
            personalClick:false
        };
    }
    componentWillMount(){}

    componentDidMount(){
    }
    changeList(menuList){
        menuList = menuList.map((v)=>{
            return v.id;
        });
        this.setState({menuList});
    }


    render() {
        return (
            <div style={{ width: 180,float:'left',position:'fixed',marginLeft:-180,zIndex:10000,height:'100%'}}>
                <Menu
                    style={{ height:'100%'}}
                    defaultSelectedKeys={[window.location.pathname]}
                    defaultOpenKeys={(window.location.pathname == '/organList' || window.location.pathname == '/outletList' )?['sub1']:[]}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                    selectedKeys = {[window.location.pathname]}
                >
                    {this.state.menuList.indexOf(1) > -1 &&
                    <Menu.Item key="/platAccount" style={{}}>
                        <img className="ldt-nav-icon" src={iconImg.plat} />
                        <NavLink className="nav-a" to="/platAccount">平台账号</NavLink>
                    </Menu.Item>
                    }
                    {this.state.menuList.indexOf(2) > -1 &&
                    <SubMenu key="sub1" title={<span><img className="ldt-nav-icon" src={iconImg.orgM} style={{marginRight: 10}}/><span>机构管理</span></span>}>
                    <Menu.Item key="/organList"><NavLink className="nav-a" to="/organList"><div>机构列表</div></NavLink></Menu.Item>
                    <Menu.Item key="/outletList"><NavLink className="nav-a" to="/outletList"><div>支行列表</div></NavLink></Menu.Item>
                    </SubMenu>
                    }
                    {/*{this.state.menuList.indexOf(2) > -1 &&
                    <Menu.Item key="/organList">
                        <Icon type="desktop" style={{fontSize:14}}/>
                        <NavLink className="nav-a" to="/organList">机构列表</NavLink>
                    </Menu.Item>
                    }*/}
                    {this.state.menuList.indexOf(4) > -1 &&
                    <Menu.Item key="/organAccount">
                        <img className="ldt-nav-icon" src={iconImg.orgA} />
                        <NavLink className="nav-a" to="/organAccount">机构账号</NavLink>
                    </Menu.Item>
                    }
                    {this.state.menuList.indexOf(3) > -1 &&
                    <Menu.Item key="/productManage">
                        <img className="ldt-nav-icon" src={iconImg.prod} />
                        <NavLink className="nav-a" to="/productManage">商品管理</NavLink>
                    </Menu.Item>
                    }
                    {this.state.menuList.indexOf(5) > -1 &&
                    <Menu.Item key="/financingNeeds">
                        <img className="ldt-nav-icon" src={iconImg.fina} />
                        <NavLink className="nav-a" to="/financingNeeds">融资需求</NavLink>
                    </Menu.Item>
                    }
                    {this.state.menuList.indexOf(6) > -1 &&
                    <Menu.Item key="/registeredCompany">
                        <img className="ldt-nav-icon" src={iconImg.regC} />
                        <NavLink className="nav-a" to="/registeredCompany">注册企业</NavLink>
                    </Menu.Item>
                    }
                </Menu>
            </div>
        );
    }
}
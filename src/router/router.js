import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Bundle from './Bundle';
import Loading from 'components/Loading/Loading';
import Personal from 'bundle-loader?lazy&name=Personal!pages/Personal/Personal';
import PlatAccount from 'bundle-loader?lazy&name=PlatAccount!pages/PlatAccount/PlatAccount';
import ProductManage from 'bundle-loader?lazy&name=ProductManage!pages/ProductManage/ProductManage';
import NotFound from 'bundle-loader?lazy&name=notFound!pages/NotFound/NotFound';

const createComponent = (component) => () => (
    <Bundle load={component}>
        {
            (Component) => Component ? <Component/> : <Loading/>
        }
    </Bundle>
);

export default (menus) => {
    let menuList = menus.map((v)=>{
        return v.id;
    });
    return (
    <div className="content-container">
        <Switch>
            <Route exact path="/" component={createComponent(Personal)}/>
            {menuList.indexOf(1) > -1 &&
            <Route path="/platAccount" component={createComponent(PlatAccount)}/>
            }
            {menuList.indexOf(3) > -1 &&
            <Route path="/productManage" component={createComponent(ProductManage)}/>
            }
            <Route path="/personal" component={createComponent(Personal)}/>

            <Route component={createComponent(NotFound)}/>
        </Switch>
    </div>
)};

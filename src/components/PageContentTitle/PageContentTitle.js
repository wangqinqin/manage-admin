import React, {Component} from 'react';
import './PageContentTitle.css';

export default class PageContentTitle extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentWillMount(){

    }

    componentDidMount(){

    }
    render() {
        return (
            <div className="page-content-title">
                {this.props.pageContentTitle}
            </div>
        )
    }
}

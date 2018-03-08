import React, {Component} from 'react';

import './page.css';
import Charts from './chart'
export default class Page extends Component {
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
            <div className={"ys-page-content "  +((this.props.hasStatistics)?'has-top':'')}>
                {this.props.hasStatistics &&
                    <Charts statisticsTitle={this.props.statisticsTitle} statisticsUrl={this.props.statisticsUrl} />
                }
                <div className="border-shine" style={{minHeight:'100%'}}>
                    <div className="table-content">
                        {this.props.content()}
                    </div>
                </div>
            </div>
        )
    }
}

import React, {Component} from 'react';
import { doRequest, Emiter } from '../../util/util';
import PageContentTitle from '../PageContentTitle/PageContentTitle';
import { message } from 'antd';
import EchartsTest from '../PieChart/PieChart';

export default class Charts extends Component {
    constructor(props){
        super(props);
        this.state = {
            statistics:[],
            width:'33.3%',
        }
    }

    componentWillMount(){
        Emiter.addListener('changeChart',this.changeChart);
    }

    changeChart = ()=> {
        this.setState({statistics:[]});
        this.getShowNum();
    };

    componentWillUnmount(){
        Emiter.removeListener('changeChart',this.changeChart);
    }

    componentDidMount(){
        this.getShowNum();
    }

    getShowNum(){
        doRequest({

            isMock:true,
            url:this.props.statisticsUrl,
            type:'post',
            success:(data)=> {

                if(data.code == '00' && data.data){
                    let statistics= data.data;
                    this.setState({width:100/(data.data.length)+'%'});
                    this.setState({statistics});
                }else if(data.code == '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    render() {
        return (
            <div className="border-shine top-statistics">
                <PageContentTitle pageContentTitle={this.props.statisticsTitle}/>
                {
                    this.state.statistics.map((v,i)=>{
                        return (
                            <div className="statistics-one-part" style={{width:this.state.width}} key={i}>
                                <EchartsTest
                                    title={v.name}
                                    number={v.num}
                                    index={i}
                                    total={this.state.statistics[0].num}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

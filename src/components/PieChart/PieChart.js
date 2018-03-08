import React, { Component } from 'react';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
const backColor=['#627e92','#35B2F9','#fbc200','#f88659','#f36358'];

class EchartsTest extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.id = Math.random().toString(36).substr(2);
    }
    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById(this.id));
        let dhx_total_value = this.props.total;
        // 绘制图表
        function getData(value,colorStyle) {
            return [{
                value: value,
                itemStyle: {
                    normal: {
                        color:colorStyle
                    }
                },
                label: {
                    normal: {
                        position:'center',
                        show: false,

                    }
                }
            }, {
                value: dhx_total_value - value,
                itemStyle: {
                    normal: {
                        color: '#efefef'
                    }
                },
                label: {
                    normal: {
                        formatter: value+'',
                        position:'center',
                        show: true,
                        textStyle: {
                            fontSize: '18',
                            fontWeight: 'bold',
                            color: '#444'
                        }
                    }
                }
            }];
        }
        myChart.setOption({
            backgroundColor: 'transparent',
            title: {
                top:'center',
                left:'60%',
                text: this.props.title,
                // + '： ' +((this.props.number/this.props.total)*100).toFixed(2) +'%',
                textStyle:{
                    fontSize: 15,
                    fontWeight: 'normal',
                    color: ['#666']
                }
            },
            series: [{
                name: this.props.title,
                type: 'pie',
                clockWise: false, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                silent:true,
                radius: [38, 45],
                center: ['35%', '50%'],
                data: getData(this.props.number,backColor[this.props.index])
            }]
        });

    }
    render() {

        return (
            <div id={this.id} style={{ width: 200, height: 90 ,position:'absolute',top:0,left:'50%',marginLeft:-90}}></div>
        );
    }
}

export default EchartsTest;
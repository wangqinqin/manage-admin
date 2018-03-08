/**
 * Created by Administrator on 2017/11/15.
 */
import React, {Component} from 'react';
import $ from 'jquery';
import './datePicker.css';

const weekLabel = ['日','一','二','三','四','五','六'];
export default class DatePicker extends Component {
    constructor(props){
        super(props);
        this.initDate = new Date(this.props.initDate || Date.now());
        this.state = {
            nowTime:formDate(this.initDate,'yyyy-MM-dd'),
            date:this.props.initDate?formDate(this.props.initDate,'yyyy-MM-dd'):'',
            dates:getTime(this.initDate),
            days: getDayArray(formDate(this.initDate,'yyyy-MM')),
            tableType:'day'
        };
        this.id = 'picker'+Math.ceil(1000000000*Math.random());
    }

    componentDidMount(){

    }

    openPicker(){
        if($('#'+this.id).hasClass('open')) {
            $('.open').removeClass('open');
        }else{
            $('#'+this.id).addClass('open');
        }
        this.tableChange('day');

    }

    dayClick(day){
        let {year,month} = this.state.dates;
        if(day.type == 'last'){
            month--;
            if(month == 0){
                month = 12;
                year--;
            }
        }else if(day.type == 'next'){
            month++;
            if(month == 13){
                month =1;
                year++;
            }
        }
        let date = formDate(new Date(year+'-'+month+'-'+day.day),'yyyy-MM-dd');
        $('.open').removeClass('open');
        this.setState({date,dates:getTime(date),days:getDayArray(formDate(date,'yyyy-MM'))});
        typeof this.props.dateChange  == 'function' && this.props.dateChange(date)
    }

    goToday(){
        $('.open').removeClass('open');
        typeof this.props.dateChange  == 'function' && this.props.dateChange(formDate(Date.now(),'yyyy-MM'));
        this.setState({date:formDate(Date.now(),'yyyy-MM-dd'),dates:getTime(Date.now()),days:getDayArray(formDate(Date.now(),'yyyy-MM'))});
    }

    goPrev(type){
        if(type == 'month'){
            let n = new Date(this.state.dates.year+'-'+this.state.dates.month);
            n.setMonth(this.state.dates.month-2);
            if(this.state.dates.month == 1){
                n.setYear(this.state.dates.year-1)
            }
            let dates = getTime(n);
            let days = getDayArray(formDate(n,'yyyy-MM'));
            this.setState({dates,days});
        }else if(type == 'year'){
            let dates = this.state.dates;
            dates.year = dates.year-1;
            this.setState({dates});
        } else if(type == 'centry'){
            let dates = this.state.dates;
            dates.year = dates.year-10;
            this.setState({dates});
        }
    }
    goNext(type){
        if(type == 'month'){
            let n = new Date(this.state.dates.year+'-'+this.state.dates.month);
            n.setMonth(this.state.dates.month);
            let dates = getTime(n);
            let days = getDayArray(formDate(n,'yyyy-MM'));
            this.setState({dates,days});
        }else if(type == 'year'){
            let dates = this.state.dates;
            dates.year = dates.year+1;
            this.setState({dates});
        } else if(type == 'centry'){
            let dates = this.state.dates;
            dates.year = dates.year+10;
            this.setState({dates});
        }
    }

    tableChange(tableType){
        this.setState({tableType})
    }

    changeMonth(m){
        let dates = this.state.dates;
        dates.month = m;
        let days = getDayArray(formDate(dates.year+'-'+dates.month,'yyyy-MM'));
        this.setState({dates,tableType:'day',days});
    }

    changeYear(y){
        let dates = this.state.dates;
        dates.year = y;
        this.setState({dates,tableType:'month'});
    }

    render(){
        return(
            <div id={this.id} className={"date-picker-outer "}>
                <input readOnly className="date-picker-input" style={this.props.style} placeholder={this.props.placeholder} onFocus={() => this.openPicker()} value={this.state.date} />
                <i className="fa fa-calendar data-picker-icon" onClick={() => this.openPicker()}/>
                <div className="data-picker-container">
                    <div className={"data-picker-days "+(this.state.tableType == 'day'?'table-show':'')}>
                        <table className="data-picker-table">
                            <thead>
                            <tr>
                                <th className="prev" onClick={()=>this.goPrev('month')}><i className="fa fa-arrow-left" /></th>
                                <th colSpan="5" className="switch" onClick={()=>this.tableChange('month')}>{this.state.dates.year+'年 '+this.state.dates.month+'月'}</th>
                                <th className="next" onClick={()=>this.goNext('month')}><i className="fa fa-arrow-right" /></th>
                            </tr>
                            <tr>
                                {
                                    weekLabel.map(function (v,i) {
                                        return <th key={i} className="dow">{v}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.days.map((v,i)=>{
                                    return (
                                        <tr key={i}>
                                            {v.map((v2,i2) => {
                                                return <td key={i2} onClick={()=>{this.dayClick(v2)}} className={'day '+v2.type+((v2.type.indexOf('now')>-1 && this.state.date && this.state.date.split('-')[2] == v2.day && this.state.date.split('-')[1] == this.state.dates.month && this.state.date.split('-')[0] == this.state.dates.year)?' active':'')}>{v2.day}</td>
                                            })}
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                            <tfoot>
                            <tr><th onClick={()=>this.goToday()} colSpan="7" className="today-btn">今天</th></tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className={"data-picker-days "+(this.state.tableType == 'month'?'table-show':'')}>
                        <table className="data-picker-table">
                            <thead>
                            <tr>
                                <th className="prev" onClick={()=>this.goPrev('year')}><i className="fa fa-arrow-left" /></th>
                                <th colSpan="5" className="switch" onClick={()=>this.tableChange('year')}>{this.state.dates.year+'年'}</th>
                                <th className="next" onClick={()=>this.goNext('year')}><i className="fa fa-arrow-right" /></th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="7">{
                                        new Array(12).join(',').split(',').map((v,i)=> {
                                            return <span key={i} onClick={()=>this.changeMonth(i+1)} className={"month "+((this.state.date && this.state.dates.year == this.state.date.split('-')[0] && this.state.dates.month == i+1)?'active':'')}>{i+1+'月'}</span>
                                        })
                                    }</td>
                                </tr>
                            </tbody>
                            <tfoot>
                            <tr><th onClick={()=>this.goToday()} colSpan="7" className="today-btn">今天</th></tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className={"data-picker-days "+(this.state.tableType == 'year'?'table-show':'')}>
                        <table className="data-picker-table">
                            <thead>
                            <tr>
                                <th className="prev" onClick={()=>this.goPrev('centry')}><i className="fa fa-arrow-left" /></th>
                                <th colSpan="5" className="switch">{Math.floor(this.state.dates.year/10)*10+'-'+(Math.floor(this.state.dates.year/10)*10+9)}</th>
                                <th className="next" onClick={()=>this.goNext('centry')}><i className="fa fa-arrow-right" /></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan="7">{
                                    new Array(12).join(',').split(',').map((v,i)=> {
                                        let y = Math.floor(this.state.dates.year/10)*10+i-1;
                                        return <span key={i} onClick={()=>this.changeYear(y)} className={"year month "+((this.state.date && this.state.dates.year == y)?'active':'')}>{y}</span>
                                    })
                                }</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr><th onClick={()=>this.goToday()} colSpan="7" className="today-btn">今天</th></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

}

function getTime(date) {
    return {
        year:new Date(date).getFullYear(),
        month:new Date(date).getMonth()+1,
        day:new Date(date).getDate(),
        week:new Date(date).getDay(),
    }
}
function getDayArray(date) {
    let w = new Date(new Date(date).getFullYear()+'-'+(new Date(date).getMonth()+1)).getDay() || 7;
    let lastMonthDay = getMonthDay(date,-1);
    let nowMonthDay = getMonthDay(date,0);
    let g_array = [],f_array=[[]];
    for(let i = 0;i<w;i++){
        g_array.push({
            type:'last',
            day:lastMonthDay-w+i+1
        })
    }
    for(let i = 0;i<nowMonthDay;i++){
        g_array.push({
            type:'now',
            day:i+1
        })
    }
    for(let i = 0;i<42-w-nowMonthDay;i++){
        g_array.push({
            type:'next',
            day:i+1
        })
    }
    if(date.split('-')[0] == new Date().getFullYear() && date.split('-')[1] == new Date().getMonth()+1){
        g_array[w+new Date().getDate()-1].type += ' today'
    }
    for(let i = 0 ;i<g_array.length;i++){
        if(!f_array[f_array.length-1]){
            f_array[f_array.length-1] = [g_array[i]]
        }else if(f_array[f_array.length-1].length == 7){
            f_array.push([g_array[i]])
        }else {
            f_array[f_array.length-1].push(g_array[i])
        }
    }

    return f_array
}

function getMonthDay(date,length) {
    let t = new Date(date);
    t.setMonth(date.split('-')[1]-0+length);
    t.setDate(0);
    return t.getDate();
}
function formDate(time, format) {
    let date = new Date(time);
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
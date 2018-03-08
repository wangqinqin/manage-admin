import React, {Component} from 'react';
import $ from 'jquery';
import './dropdown.css';

export default class Dropdown extends Component{
    constructor(props){
        super(props);
        this.state = {
            current:{}
        };
        this.id = 'dropdown'+Math.ceil(1000000000*Math.random());
        this.isOpen = false;
    }

    componentDidMount(){

    }

    openDropdown(){
       if($('#'+this.id).hasClass('open')){
            $('.open').removeClass('open');
        }else{
           $('#'+this.id).addClass('open');
       }
    }

    itemClick(index){
        let current = this.props.list[index];
        $('#'+this.id).removeClass('open');
        this.setState({current});
        this.props.onSelectDrop(current);
    }

    render(){
        return(
            <div id={this.id} style={this.props.style} className="ys-dropdown">
                <button onClick={()=>this.openDropdown()} className="dropdown-menu-btn">
                    <span>{this.state.current[this.props.itemKey] || this.props.placeholder || '请选择'}</span><i className="fa fa-chevron-down" />
                </button>
                <ul className="dropdown-list">
                    {
                        this.props.list.map((v,i)=>{
                            return <li key={i} onClick={()=>this.itemClick(i)}><a>{v[this.props.itemKey]}</a></li>
                        })
                    }
                </ul>
            </div>
        )
    }
}

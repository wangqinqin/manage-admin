import React, {Component} from 'react';



export default class TextInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            status:''
        }
    }

    componentWillMount(){

    }

    componentDidMount(){

    }
    statusChange(v){
        this.setState({status:v.value});
        this.props.onSelect(v);
    }

    render() {
        return (
            <div>
                {
                    this.props.list.map((v,i)=>{
                    return(
                        <div className={"select-status-part " + (this.state.status == v.value ?'active':'')} key={i}
                                onClick={() => this.statusChange(v)}>
                            {v.name}
                        </div>
                    )
                })}
            </div>
        )
    }
}
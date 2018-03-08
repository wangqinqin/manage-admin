import React, {Component} from 'react';
export default class TabChange extends Component {
    constructor(props){
        super(props);
        this.state = {
            whichChoose:1,
        }
    }

    componentWillMount(){

    }

    componentDidMount(){
    }

    tabChange(num){
        this.setState({whichChoose:num});
        this.props.onChangeTab(num);
    }
    reset(){
        this.setState({whichChoose:1})
    }

    render() {
        return (
            <div className={"change-tab " + (this.props.centerName?'sm':'')}>
                <div onClick={() => this.tabChange(1)} className={this.state.whichChoose == 1 ?'active':''}>{this.props.leftName}</div>
                {this.props.centerName &&
                    <div onClick={() => this.tabChange(2)} className={this.state.whichChoose == 2 ?'active':''}>{this.props.centerName}</div>
                }
                <div onClick={() => this.tabChange(3)} className={this.state.whichChoose == 3 ?'active':''}>{this.props.rightName}</div>
            </div>
        )
    }
}

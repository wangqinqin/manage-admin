import  React,  {Component}  from  'react';
import  { doRequest,  isNull,    is50Long,  isMaxFixed2Num,  isBigger,  isZSNum,  is500Long,  is1000Long}  from  '../../utils/utils';
import  { Input,  message  ,  Modal,  Select,  Upload,  Icon,  Checkbox,  Row,  Col,  Radio  }  from  'antd';
import './editModal.css'

function  getBase64(img,  callback)  {
    const  reader  =  new  FileReader();
    reader.addEventListener('load',  ()  =>  callback(reader.result));
    reader.readAsDataURL(img);
}
function  beforeUpload(file)  {
    const  isJPG  =  file.type  ===  'image/jpeg'  ||  file.type  ===  'image/png'  ;
    if  (!isJPG)  {
        message.error('You  can  only  upload  JPG  file!');
    }
    const  isLt2M  =  file.size  /  1024  /  1024  <  2;
    if  (!isLt2M)  {
        message.error('Image  must  smaller  than  2MB!');
    }
    return  isJPG  &&  isLt2M;
}

const  URL_PRE  =  process.env.NODE_ENV  ==  'production'?(window.location.origin  ||  (window.location.protocol+'//'+window.location.host)):'/api';

export  default  class  OrganModal  extends  Component  {
    constructor(props){
        super(props);
        this.state  =  {
            modalShow:false,
            addFlag:0,
            confirmLoading:false,
            loading:  false,

            changeTab:'basic',
            id:'',
            bankId:'',
            productName:'',
            category:[],
            guaranteeId:[],
            repayType:[],
            areaId:[],
            productUseId:[],
            productLoanTargetId:[],
            loanMin:'',
            loanMax:'',
            loanRangeDesc:'',
            interestType:'',
            loanRangeType:'1',
            interestMin:'',
            interestMax:'',
            termMin:'',
            termMax:'',
            timeMin:'',
            timeMax:'',
            // logoPath:'',
            productBrief:'',
            productFeatures:'',
            productLabel:'',
            applyCondition:'',
            requiredInfo:'',
            remark:'',
        };
    }

    componentWillMount(){

    }

    componentDidMount(){
        this.getDictGuarantee();
        this.getDictRepay();
        this.getBankList();
        this.getDictArea();
        this.getDictLoanUse();
        this.getDictLoanTarget();
        this.getDictProductCategory();
    }

    /*编辑弹框*/
    editDetail  =  (list)  =>  {
        this.setState({
            id:list.id,
            bankId:list.bankId,
            productName:list.productName,
            category:list.category,
            areaId:list.areaId,
            guaranteeId:list.guaranteeId,
            repayType:list.repayType,
            productUseId:list.productUseId,
            productLoanTargetId:list.productLoanTargetId,
            loanMin:list.loanMin,
            loanMax:list.loanMax,
            loanRangeDesc:list.loanRangeDesc,
            interestType:list.interestType,
            loanRangeType:list.loanRangeType,
            interestMin:list.interestMin,
            interestMax:list.interestMax,
            termMin:list.termMin,
            termMax:list.termMax,
            timeMin:list.timeMin,
            timeMax:list.timeMax,
            // logoPath:list .logoPath,
            productBrief:list.productBrief,
            productFeatures:list.productFeatures,
            productLabel:list.productLabel,
            applyCondition:list.applyCondition,
            requiredInfo:list.requiredInfo,
            remark:list.remark,

            // imgUrl:'',
            modalShow: true,
            changeTab:'basic'
        });
    };


    handleEditOk = () => {

        !isNull(this.state.bankId) && message.error("请选择所属店铺");
        !isNull(this.state.productName) && message.error("请填写商品名称");
        !is50Long(this.state.productName) && message.error("商品名称长度限制在50个字符内");
        !this.state.category.length && message.error("请选择商品分类");
        this.state.category.length>3 && message.error("商品分类最多选三种");
        !this.state.areaId.length && message.error("请选择销售地");


        !isNull(this.state.termMin) && message.error("请填写价格区间");
        !isNull(this.state.termMax) && message.error("请填写价格区间");
        isNull(this.state.termMin) && !isZSNum(this.state.termMin) && message.error("价格区间:请填写10000以内的正整数");
        isNull(this.state.termMax) && !isZSNum(this.state.termMax) && message.error("价格区间:请填写10000以内的正整数");
        isNull(this.state.termMin) && isZSNum(this.state.termMin) && !(this.state.termMin <= 10000) && message.error("价格区间:请填写10000以内的正整数");
        isNull(this.state.termMax) && isZSNum(this.state.termMax) && !(this.state.termMax <= 10000) && message.error("价格区间:请填写10000以内的正整数");
        isNull(this.state.termMin) && isNull(this.state.termMax) && !isBigger(this.state.termMin,this.state.termMax) && message.error("请正确填写价格区间");



        !isNull(this.state.productBrief) && message.error("请填写商品简介");
        !isNull(this.state.productFeatures) && message.error("请填写商品特色");
        isNull(this.state.productBrief) && !is500Long(this.state.productBrief) && message.error("商品简介长度限制在500个字符内");
        isNull(this.state.productFeatures) && !is500Long(this.state.productFeatures) && message.error("商品特色长度限制在500个字符内");
        !isNull(this.state.productLabel) && message.error("请填写商品标签");
        isNull(this.state.productLabel) && !is500Long(this.state.productLabel) && message.error("商品标签长度限制在500个字符内");
        !isNull(this.state.applyCondition) && message.error("请填写商品优势");
        isNull(this.state.applyCondition) &&  !is1000Long(this.state.applyCondition) && message.error("商品优势长度限制在1000个字符内");
        !is1000Long(this.state.remark) && message.error("补充说明长度限制在1000个字符内");

        if( !isNull(this.state.bankId) ||  !this.state.category.length || this.state.category.length>3
            || !isNull(this.state.productName) || !is50Long(this.state.productName) || !this.state.areaId.length ||
            !isNull(this.state.termMin) || !isNull(this.state.termMax) || !isZSNum(this.state.termMin) || !(this.state.termMin <= 360) ||
            !isZSNum(this.state.termMax) || !(this.state.termMax <= 360) || !isBigger(this.state.termMin,this.state.termMax) ||
            !isNull(this.state.productBrief) || !is500Long(this.state.productBrief) ||
            !isNull(this.state.productFeatures) || !is500Long(this.state.productFeatures) ||
            !is500Long(this.state.productBrief) ||  !is500Long(this.state.productFeatures) ||
            !isNull(this.state.productLabel) || !is500Long(this.state.productLabel) ||
            !isNull(this.state.applyCondition) || !is1000Long(this.state.applyCondition) ||
            !is1000Long(this.state.remark)
        ){return;}


        this.setState({confirmLoading: true});
        doRequest({
            isMock:true,
            url:'/product/modProductInfo',
            type:'post',
            data:{
                id:this.state.id,
                bankId:this.state.bankId,
                productName:this.state.productName,
                category:JSON.stringify(this.state.category),
                areaId:JSON.stringify(this.state.areaId),
                termMin:this.state.termMin,
                termMax:this.state.termMax,
                loanRangeType:this.state.loanRangeType,
                interestType:this.state.interestType,
                productBrief:this.state.productBrief,
                productFeatures:this.state.productFeatures,
                productLabel:this.state.productLabel,
                applyCondition:this.state.applyCondition,
                remark:this.state.remark,
            },
            success:(data)=> {
                if(data.code === '00') {
                    message.success('操作成功');
                    setTimeout(() => {
                        this.setState({
                            modalShow: false,
                            confirmLoading: false,
                        });
                    }, 500);
                    if(this.state.addFlag){
                        this.props.changeTableList({pageNum:1});
                    }else{
                        this.props.changeTableList();
                    }
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                    this.setState({
                        confirmLoading: false,
                    });
                }else{
                    message.error("出错啦");
                    this.setState({
                        confirmLoading: false,
                    });
                }
            }
        });

    };

    handleEditCancel = () => {
        this.setState({
            modalShow: false
        });
    };

    // handlePicChange = (info) => {
    //     this.setState({
    //         imgUrl:'',
    //         logoPath:''
    //     });
    //     if (info.file.status === 'uploading') {
    //         this.setState({ loading: true });
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         // Get this url from response in real world.
    //
    //         if(this.state.logoPath == '' && info.file.response.data){
    //             getBase64(info.file.originFileObj, imgUrl => this.setState({
    //                 imgUrl,
    //                 loading: false,
    //             }));
    //         }
    //
    //         let logoPath = info.file.response.data ? info.file.response.data.url:'';
    //         this.setState({
    //             logoPath,
    //             loading: false,
    //         });
    //     }
    // };

    getDictGuarantee(){
        doRequest({
            url:'/product/getDictGuarantee',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let d = data.data.map((v,i)=>{
                        return <Col key={i} style={{paddingBottom:5}}><Checkbox value={v.id}>{v.guaranteeName}</Checkbox></Col>
                    });
                    this.setState({GuaranteeList:d})
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }
    getDictRepay(){
        doRequest({
            url:'/product/getDictRepay',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let d = data.data.map((v,i)=>{
                        return <Col key={i} style={{paddingBottom:5}}><Checkbox value={v.id}>{v.repayName}</Checkbox></Col>
                    });
                    this.setState({RepayList:d})
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }
    getDictArea(){
        doRequest({
            isMock:true,
            url:'/product/getDictArea',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let d = data.data.map((v,i)=>{
                        return <Col key={i} style={{paddingBottom:5}}><Checkbox value={v.id}>{v.county}</Checkbox></Col>
                    });
                    this.setState({countyList:d})
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }
    getDictLoanUse(){
        doRequest({
            url:'/product/getDictLoanUse',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let d = data.data.map((v,i)=>{
                        return <Col key={i}  style={{paddingBottom:5}}><Checkbox value={v.id}>{v.loanUseName}</Checkbox></Col>
                    });
                    this.setState({loanUseList:d})
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    getDictLoanTarget(){
        doRequest({
            url:'/product/getDictLoanTarget',
            type:'post',
            success:(data)=> {
                if(data.code === '00' && data.data){
                    let d = data.data.map((v,i)=>{
                        return <Col key={i}  style={{paddingBottom:5}}><Checkbox value={v.id}>{v.name}</Checkbox></Col>
                    });
                    this.setState({loanUserList:d})
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                }
            }
        });
    }

    getBankList(){
        doRequest({
            isMock:true,
            url:'/bank/findUseBankInfoByType',
            type:'post',
            data:{
                bankType:JSON.stringify([1,2])
            },
            success:(data)=> {
                if(data.code === '00' && data.data) {
                    let bankNameOptions = data.data;
                    this.setState({bankNameOptions});
                }else if(data.code === '01'){
                    message.error(data.codeMsg);
                }else{
                    message.error("出错啦");
                    this.setState({
                        confirmLoading: false,
                    });
                }
            }
        });
    }
    getDictProductCategory(categoryOptions){
        if(categoryOptions){
            let d = categoryOptions.map((v,i)=>{
                return <Col key={i}  style={{paddingBottom:5}}><Checkbox value={v.id}>{v.name}</Checkbox></Col>
            });
            this.setState({categoryList:d});
        }
    }
    render() {
        const Option = Select.Option;
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;
        const { TextArea } = Input;
        // const uploadButton = (
        //     <div>
        //         <Icon type={this.state.loading ? 'loading' : 'plus'} />
        //         <div className="ant-upload-text">Upload</div>
        //     </div>
        // );
        // const {logoPath,imgUrl} = this.state;
        return (
            <Modal title={this.state.addFlag? '添加商品':'编辑商品'}
                   visible={this.state.modalShow}
                   width={700}
                   onOk={this.handleEditOk}
                   confirmLoading={this.state.confirmLoading}
                   onCancel={this.handleEditCancel}
            >
                <div style={{textAlign:'center'}}>
                    <RadioGroup onChange={e=>this.setState({changeTab:e.target.value})} value={this.state.changeTab}>
                        <RadioButton value="basic">基本信息</RadioButton>
                        <RadioButton value="intro">商品介绍</RadioButton>
                        <RadioButton value="know">商品须知</RadioButton>
                    </RadioGroup>
                </div>
                <div className={this.state.changeTab !== 'basic' && "none"}>
                    <div  className="bomb-line-div">
                        <div className="bomb-title bomb-title-lg must">商品名称</div>
                        <Input
                            placeholder="输入商品名称"
                            disabled={true}
                            value={this.state.productName}
                            style={{ width: 220 }}
                            onChange={e => this.setState({productName:e.target.value})}
                        />
                    </div>
                    <div className="bomb-line-div">
                        <div className="bomb-title bomb-title-lg must">所属店铺</div>
                        <Select labelInValue
                                value={{ key: (this.state.bankId || '') +''}}
                                style={{ width: 220 }}
                                onChange={e=>this.setState({bankId: e.key})}
                                disabled={true}
                        >
                            <Option value="" disabled>请选择</Option>
                            {this.state.bankNameOptions && this.state.bankNameOptions.map((v,i) => {
                                return <Option key={i} value={v.id+''}>{v.bankName}</Option>
                            })}
                        </Select>
                    </div>
                    <div className="bomb-line-div">
                        <div className="bomb-title bomb-title-lg must">商品分类</div>
                        <Checkbox.Group
                            onChange={checkedValues => {this.setState({category:checkedValues})}}
                            value = {this.state.category}>
                            <Row>
                                {this.state.categoryList}
                            </Row>
                        </Checkbox.Group>
                    </div>
                    <div className="bomb-block-div">
                        <div className="bomb-title bomb-title-lg must" style={{verticalAlign: 'top'}}>销售地</div>
                        <Checkbox.Group
                            onChange={checkedValues => this.setState({areaId:checkedValues})}
                            value = {this.state.areaId}>
                            <Row>
                                {this.state.countyList}
                            </Row>
                        </Checkbox.Group>
                    </div>

                    <div  className="bomb-line-div">
                        <div style={{marginTop:10}}>
                            <div className="bomb-title bomb-title-lg must">价格区间</div>
                            <Input
                                placeholder=""
                                value={this.state.termMin}
                                style={{ width: 80 }}
                                onChange={e => this.setState({termMin:e.target.value})}
                            />&nbsp;-&nbsp;
                            <Input
                                placeholder=""
                                value={this.state.termMax}
                                style={{ width: 80 }}
                                onChange={e => this.setState({termMax:e.target.value})}
                            />
                            <span className="small-font">&nbsp;元</span>
                        </div>

                    </div>
                </div>
                <div className={this.state.changeTab !== 'intro' && "none"}>
                    <div  className="bomb-line-div" >
                        <div className="bomb-title bomb-title-lg must">商品简介</div>
                        <TextArea rows={6} autosize={false}
                                  placeholder="输入商品简介（每条信息点输入完，需回车换行）"
                                  style={{ width: 540}}
                                  value={this.state.productBrief}
                                  onChange={e => this.setState({productBrief:e.target.value})}
                        />
                    </div>
                    <div  className="bomb-line-div" >
                        <div className="bomb-title bomb-title-lg must">商品特色</div>
                        <TextArea rows={6} autosize={false}
                                  placeholder="输入商品特色（每条信息点输入完，需回车换行）"
                                  style={{ width: 540}}
                                  value={this.state.productFeatures}
                                  onChange={e => this.setState({productFeatures:e.target.value})}
                        />
                    </div>
                </div>

                <div className={this.state.changeTab !== 'know' && "none"}>
                    <div  className="bomb-line-div" >
                        <div className="bomb-title bomb-title-lg must">商品标签</div>
                        <TextArea rows={2} autosize={false}
                                  placeholder="输入商品标签（每条信息点输入完，需回车换行）"
                                  style={{ width: 540}}
                                  value={this.state.productLabel}
                                  onChange={e => this.setState({productLabel:e.target.value})}
                        />
                    </div>
                    <div  className="bomb-line-div" >
                        <div className="bomb-title bomb-title-lg must">商品优势</div>
                        <TextArea rows={4} autosize={false}
                                  placeholder="输入申请条件（每条信息点输入完，需回车换行）"
                                  style={{ width: 540}}
                                  value={this.state.applyCondition}
                                  onChange={e => this.setState({applyCondition:e.target.value})}
                        />
                    </div>
                    <div  className="bomb-line-div" >
                        <div className="bomb-title bomb-title-lg">补充说明</div>
                        <TextArea rows={4} autosize={false}
                                  placeholder="输入补充说明（每条信息点输入完，需回车换行）"
                                  style={{ width: 540}}
                                  value={this.state.remark}
                                  onChange={e => this.setState({remark:e.target.value})}
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}
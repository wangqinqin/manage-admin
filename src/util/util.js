import $ from 'jquery';
import MorkData from './data';
import EventEmitter from 'events';
class CountEmitter extends EventEmitter{}
export const Emiter = new CountEmitter();

//请求封装函数，参数同$.ajax，没有返回值
export function doRequest(options) {
    if(options.isMock){
        setTimeout(()=>{
            options.success(MorkData[options.url]);
        },200)
        // return;
    }
    // let urlPre = process.env.NODE_ENV === 'production'?(window.location.origin || (window.location.protocol+'//'+window.location.host)):'/api';
    //
    //
    // options.url = urlPre + options.url;
    // options.data = {...options.data,timeStrap:Date.now()};
    // options.success2 = options.success;
    // options.success = function (data) {
    //     if(process.env.NODE_ENV === 'production' && typeof data === 'string'){
    //         window.location.reload();
    //     }else {
    //         options.success2(data);
    //     }
    // };
    // return $.ajax({
    //     ...options
    // })
}
export function changeMockData(options) {
    MorkData[options.url][options.key] = options.value;
}

/**
 * format(new Date(1469536851000), 'yyyy-MM-dd');
 * "2016-07-26"
 */


export function format(time, format) {
    if(!time){
        return '-';
    }
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

/**
 *是否为空
 *
 */
export function isNull(val) {
    return val === '' ? false : true;
}

/**
 *是否相等
 *
 */
export function isEqual(val1,val2) {
    return val1 === val2;
}
/**
 *30字符限制
 *
 */
export function is30Long(val) {
    return /^.{0,30}$/.test(val);
}
/**
 *50字符限制
 *
 */
export function is50Long(val) {
    return /^.{0,50}$/.test(val);
}
/**
 *100字符限制
 *
 */
export function is100Long(val) {
    // return /^.{0,100}$/.test(val);
    return true;
}
/**
 *200字符限制
 *
 */
export function is200Long(val) {
    // return /^.{0,200}$/.test(val);
    return true;
}

/**
 *500字符限制
 *
 */
export function is500Long(val) {
    // return /^.{0,500}$/.test(val);
    return true;
}

/**
 *500字符限制
 *
 */
export function is1000Long(val) {
    // return /^.{0,1000}$/.test(val);
    return true;
}
/**
 *密码：6-16
 *
 */
export function isPsd(val) {
    return /^[0-9a-zA-Z]{6,16}$/.test(val);
}
/**
 *用户名
 *
 */
export function isUserName(val) {
    return /[0-9]*[a-zA-Z_]+/.test(val);
}
/**
 *手机号
 *
 */
export function isPhone(val) {
    return /^1[345678]\d{9}$/.test(val);
}

/**
 *正数，最多两位小数
 *
 */
export function isMaxFixed2Num(val) {
    return /^\d+([.]\d{0,2})?$/.test(val);
}
/**
 *比较大小
 *
 */
export function isBigger(val1,val2) {
    return val1-0 < val2-0;
}
/**
 *正整数
 *
 */
export function isZSNum(val) {
    return /^[0-9]+$/.test(val);
}


import Vue from 'vue'
import axios from 'axios/index'
import {electron,ipcRenderer} from "electron";
const packageInfo=require('../../package.json');
const path = require('path');

axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
    return response;
}, function (err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)' ; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    }else{
        err.message = '连接服务器失败，请检查网络连接或联系管理员'
    }
    return Promise.reject(err);
});
String.prototype.Before=function(substr){
    return this.substring(this.lastIndexOf(substr) + 1, this.length);
};
String.prototype.Exist=function(substr){
    if(typeof this !== "string"){ return; }
    if(substr==='|*|'){return true}
    for(let i=0;i<substr.split(',').length;i++){
        if(this.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
    }
    return false;
};

//引入electron接口
Vue.path = Vue.prototype.$path = path;//path接口
Vue.electron=Vue.prototype.$electron=electron;//electron
Vue.ipc = Vue.prototype.$ipc = ipcRenderer;//ipc接口
Vue.Notify = Vue.prototype.$notify =(msg,name)=>{
    new Notification(packageInfo.name||name,{
        body: msg
    })
};//通知接口

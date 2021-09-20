import Vue from 'vue';
const path = require('path');
/*开始自动化引入公用组件*/
const requireComponent = require.context('../components/public', true, /\.vue$/);
requireComponent.keys().forEach((fileName) => {
	// 获取组件配置
	const componentConfig = requireComponent(fileName);
	// 剥去文件名开头的 `./` 和`.vue`结尾的扩展名
	const componentName = path.basename(fileName).replace(/\.vue$/, '');
	// 全局注册组件
	Vue.component(componentName.replace(/\//, '-'), componentConfig.default || componentConfig);
});
//cookie模块
Vue.prototype.$cookie = require('./cookie');
//ipc模块
if (!!process.versions) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	//引入electron接口
	Vue.prototype.$electron = electron; //electron
	Vue.prototype.$ipc = ipcRenderer; //ipc接口
}
//系统通知
Vue.prototype.$notify = function (msg: string, title: string) {
	const notification = {
		title: title,
		body: msg,
		icon: require('../assets/logo.png'),
	};
	return new window.Notification(notification.title, notification);
};

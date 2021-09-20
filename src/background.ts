import packageInfo from '../package.json';
import { app, protocol, ipcMain, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { WindowControl } from './utils/main/windowControl';
import CheckUpdate from './utils/main/CheckUpdate';
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);
const windowControl = new WindowControl();
const checkUpdate = new CheckUpdate();
let win: BrowserWindow | null = null;
/*初始化ipc*/
function bindIpc() {
	/*系统操作事件*/
	ipcMain.on('system', (event, type, data) => {
		switch (type) {
			case 'check-for-update' /*检查更新*/:
				checkUpdate.check(event, data);
				break;
			case 'update' /*安装更新*/:
				checkUpdate.update();
				break;
			case 'exit':
				app.quit();
				break;
		}
	});
}
/*创建窗口*/
function createWindow() {
	win = windowControl.create({
		frame: true,
		name: 'home',
		url: '',
	});
}
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		//这里是单例模式，当已经存在窗口仍然打开的处理
		if (win) {
			win.show();
		}
	});
	app.on('ready', function () {
		bindIpc(); //初始化ipc
		createProtocol('app');
		app.setAppUserModelId(packageInfo.appId);
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		createWindow();
	});
}
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

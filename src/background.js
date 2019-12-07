'use strict';
import packageInfo from '../package';
import { app, protocol, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import windowControl from './tools/main/windowControl';
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);
let win = null;

/*初始化ipc*/
function bindIpc() {
	/*系统操作事件*/
	ipcMain.on('system', (event, type, data) => {
		switch (type) {
			case 'check-for-update' /*检查更新*/:
				autoUpdater.setFeedURL(data);
				autoUpdater.checkForUpdates();
				break;
			case 'update' /*安装更新*/:
				autoUpdater.quitAndInstall();
				break;
			case 'exit':
				app.quit();
				break;
		}
	});
}
/*创建窗口*/
function createWindow(data) {
	if (win) {
		return windowControl.active(win, data);
	}
	win = windowControl.create({
		frame: true,
		url: 'home'
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
	app.on('ready', function() {
		bindIpc(); //初始化ipc
		createProtocol('app');
		app.setAppUserModelId(packageInfo.appId);
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		createWindow(true);
	});
}
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (win === null) {
		createWindow(true);
	}
});

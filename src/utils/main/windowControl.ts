import { BrowserWindow, Menu } from 'electron';
const { projectName } = require('../../../package.json');
const isDevelopment = process.env.NODE_ENV !== 'production';
import { EventEmitter } from 'events';
interface WindowControlType {
	getWindow: Function;
	create: Function;
	active: Function;
	closeAll: Function;
}
const port = 9020;
class WindowControl extends EventEmitter {
	constructor() {
		super();
	}
	isMacOs = process.platform === 'darwin';
	winList: any = {};
	create(options: any) {
		const name: string = options.name;
		const data: any = options.data;
		if (!name) {
			return;
		}
		//存在就激活窗口
		if (this.getWindow(name)) {
			this.active(name, data);
			return;
		}
		Menu.setApplicationMenu(null);
		const defaultOptions = {
			width: 800,
			height: 600,
			title: projectName,
			frame: this.isMacOs,
			useContentSize: false,
			transparent: false,
			minimizable: true,
			maximizable: true,
			resizable: true,
			alwaysOnTop: false,
			show: false,
			titleBarStyle: 'hiddenInset',
			webPreferences: {
				devTools: isDevelopment,
				nodeIntegration: true,
				webSecurity: false,
				scrollBounce: true,
				contextIsolation: false,
				enableRemoteModule: true,
				plugins: true,
				webviewTag: true,
			},
		};
		options = Object.assign(defaultOptions, options);
		this.winList[name] = new BrowserWindow(options);
		this.winList[name] = this.winList[name];
		if (options.backgroundColor) {
			this.winList[name].setBackgroundColor(options.backgroundColor);
		}
		//自定义回调
		this.winList[name].callback = (data: any) => {
			this.winList[name].webContents.send('win-data', data);
			typeof options.callback === 'function' ? options.callback() : '';
		};
		//加载url
		this.winList[name].loadURL(this.createUrl(options.url)).then(() => {
			this.winList[name].setTitle(options.title);
			this.winList[name].callback(data);
		});
		isDevelopment && this.winList[name].webContents.openDevTools();
		//处理显示
		this.winList[name].on('ready-to-show', (event: Event) => {
			this.winList[name].show();
			this.winList[name].focus();
			typeof options.ready === 'function' ? options.ready(event) : '';
		});
		//处理关闭
		this.winList[name].on('closed', (event: Event) => {
			delete this.winList[name];
			typeof options.onclose === 'function' ? options.onclose(event) : '';
		});
		return this.winList[name];
	}
	getWindow(windowName: string) {
		return this.winList[windowName];
	}
	active(windowName: string, data: any) {
		const currentWin = this.getWindow(windowName);
		if (currentWin) {
			currentWin.show();
			currentWin.focus();
			data && currentWin.callback(data);
		}
	}
	createUrl(router: string) {
		if (router.includes('file://') || router.includes('http')) {
			return router;
		}
		if (isDevelopment) {
			return `http://localhost:${port}/#/` + router;
		}
		return 'app://./index.html#/' + router;
	}
	closeAll(filterNotClose: Array<string> = []) {
		for (const name in this.winList) {
			const win = this.winList[name];
			if (!filterNotClose.includes(name)) {
				win.close();
			}
		}
	}
	cloudWindow(options: any, callback: Function, onClose: Function) {
		return this.create({
			...options,
			onclose: () => {
				onClose && onClose();
			},
			callback: () => {
				callback && callback();
			},
		});
	}
}

export { WindowControl, WindowControlType };

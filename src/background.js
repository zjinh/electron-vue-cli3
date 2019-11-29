'use strict';
import {app, protocol, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen, session} from 'electron'
import {autoUpdater} from 'electron-updater'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
const packageInfo=require('../package.json');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

let win=null;

/*窗口控制函数*/
let windowControl = {
    create(options) {
        Menu.setApplicationMenu(null);
        let defaultOptions = {
            width: 800,
            height: 600,
            title: packageInfo.name,
            frame: false,
            useContentSize: false,
            transparent: false,
            minimizable: true,
            maximizable: true,
            resizable: true,
            alwaysOnTop: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: !(process.env.NODE_ENV === 'development')
            }
        };
        options = Object.assign(defaultOptions, options);
        let win = new BrowserWindow(options);
        options.backgroundColor && (win.backgroundColor = options.backgroundColor);
        win.name = options.url;
        win.loadURL(this.checkRouter(options.url));
        win.callback = (data) => {
            win.webContents.send('win-data', data);
            (typeof options.callback === 'function') ? options.callback() : "";
        };
        win.on('closed', (event) => {
            win = null;
            (typeof options.onclose === 'function') ? options.onclose(event) : "";
        });
        win.on('ready-to-show', (event) => {
            win.show();
            win.focus();
            (typeof options.ready === 'function') ? options.ready(event) : "";
        });
        win.webContents.on('did-finish-load', () => {
            win.setTitle(options.title);
            win.callback(options.data || '无数据');
            isDevelopment && win.webContents.openDevTools()
        });
        return win;
    },
    checkRouter(router) {
        if(isDevelopment){
            return 'http://localhost:9020/#/' + router
        }
        createProtocol('app');
        return 'app://./index.html#/' + router;
    },
    active(win, data) {
        if (win) {
            win.show();
            win.focus();
            data && win.callback(data);
        }
    }
};

/*初始化ipc*/
function bindIpc() {
    /*系统操作事件*/
    ipcMain.on('system', (event, type, data) => {
        switch (type) {
            case 'check-for-update':/*检查更新*/
                autoUpdater.setFeedURL(data);
                autoUpdater.checkForUpdates();
                break;
            case 'update':/*安装更新*/
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
    if(win){
        return windowControl.active(win,data)
    }
    win = windowControl.create({
        frame:true,
        url:"home"
    });
}
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        //这里是单例模式，当已经存在窗口仍然打开的处理
        if(win){
            win.show();
        }
    });
    app.on('ready', function () {
        bindIpc();//初始化ipc
        app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
        createWindow(true)
    });
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow(true)
    }
});

import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron'
import { platform } from 'node:os'
import packageInfo from '../../package.json'
import type { NotificationInput } from '../shared/electron-api'
import { Updater } from './updater'

export function registerIpc(updater: Updater, getWindow: () => BrowserWindow | null): void {
  ipcMain.handle('system:get-info', () => ({
    appVersion: packageInfo.version,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    platform: platform()
  }))
  ipcMain.handle('window:open-external', async (_event, value: unknown) => {
    try {
      const url = new URL(String(value))
      if (!['http:', 'https:'].includes(url.protocol)) return { ok: false, message: '只允许打开 HTTP 或 HTTPS 链接' }
      await shell.openExternal(url.toString())
      return { ok: true }
    } catch {
      return { ok: false, message: '链接无效' }
    }
  })
  ipcMain.handle('notification:show', (_event, input: NotificationInput) => {
    if (!input?.title || !input?.body) return { ok: false, message: '通知内容不能为空' }
    new Notification({ title: input.title, body: input.body }).show()
    return { ok: true }
  })
  ipcMain.handle('updater:check', (_event, feedUrl: string) => updater.check(feedUrl))
  ipcMain.handle('updater:install', () => updater.install())
  ipcMain.handle('app:quit', () => {
    app.quit()
  })
  updater.initialize(getWindow)
}

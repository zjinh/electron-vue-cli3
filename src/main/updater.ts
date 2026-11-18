import updaterPackage, { type UpdateInfo } from 'electron-updater'
import type { BrowserWindow } from 'electron'
import type { UpdateEvent } from '../shared/electron-api'

const { autoUpdater } = updaterPackage

export class Updater {
  private initialized = false
  private downloaded = false
  private listeners: Array<[string, (...args: any[]) => void]> = []

  initialize(getWindow: () => BrowserWindow | null): void {
    if (this.initialized) return
    this.initialized = true
    const send = (event: UpdateEvent) => getWindow()?.webContents.send('updater:event', event)
    const bind = (name: string, listener: (...args: any[]) => void) => {
      autoUpdater.on(name as any, listener as any)
      this.listeners.push([name, listener])
    }
    bind('checking-for-update', () => send({ type: 'checking' }))
    bind('update-available', (info: UpdateInfo) => send({ type: 'available', version: info.version }))
    bind('update-not-available', () => send({ type: 'not-available' }))
    bind('download-progress', (progress) =>
      send({
        type: 'progress',
        progress: { percent: progress.percent, bytesPerSecond: progress.bytesPerSecond, transferred: progress.transferred, total: progress.total }
      })
    )
    bind('update-downloaded', (info: UpdateInfo) => {
      this.downloaded = true
      send({ type: 'downloaded', version: info.version })
    })
    bind('error', (error: Error) => send({ type: 'error', message: error.message }))
  }

  async check(feedUrl: string): Promise<{ ok: boolean; message?: string }> {
    if (!feedUrl.trim()) return { ok: false, message: '更新地址不能为空' }
    try {
      autoUpdater.setFeedURL({ provider: 'generic', url: feedUrl })
      await autoUpdater.checkForUpdates()
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : '检查更新失败' }
    }
  }

  install(): { ok: boolean; message?: string } {
    if (!this.downloaded) return { ok: false, message: '当前没有可安装的更新' }
    autoUpdater.quitAndInstall()
    return { ok: true }
  }

  dispose(): void {
    for (const [name, listener] of this.listeners) autoUpdater.removeListener(name as any, listener as any)
    this.listeners = []
    this.initialized = false
  }
}

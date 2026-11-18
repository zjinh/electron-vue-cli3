import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'

const isDevelopment = !app.isPackaged

export class WindowManager {
  private mainWindow: BrowserWindow | null = null

  createMainWindow(): BrowserWindow {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) return this.mainWindow
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      title: 'test',
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    })
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
      this.mainWindow?.focus()
    })
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
    void this.loadRenderer(this.mainWindow)
    return this.mainWindow
  }

  async loadRenderer(window: BrowserWindow): Promise<void> {
    if (isDevelopment && process.env.ELECTRON_RENDERER_URL) await window.loadURL(process.env.ELECTRON_RENDERER_URL)
    else await window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  focusMainWindow(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return
    if (this.mainWindow.isMinimized()) this.mainWindow.restore()
    this.mainWindow.show()
    this.mainWindow.focus()
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }
}

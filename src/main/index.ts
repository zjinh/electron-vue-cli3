import { app } from 'electron'
import { WindowManager } from './window-manager'
import { registerIpc } from './ipc'
import { Updater } from './updater'

const lock = app.requestSingleInstanceLock()
if (!lock) {
  app.quit()
} else {
  const windows = new WindowManager()
  const updater = new Updater()
  app.on('second-instance', () => windows.focusMainWindow())
  app.whenReady().then(() => {
    registerIpc(updater, () => windows.getMainWindow())
    windows.createMainWindow()
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
  app.on('activate', () => {
    if (!windows.getMainWindow()) windows.createMainWindow()
    else windows.focusMainWindow()
  })
  app.on('will-quit', () => updater.dispose())
}

import type { IpcRenderer } from 'electron'
import type { ElectronAPI, NotificationInput, UpdateEvent } from '../shared/electron-api'

export function createElectronAPI(ipcRenderer: Pick<IpcRenderer, 'invoke' | 'on' | 'removeListener'>): ElectronAPI {
  const onEvent = (listener: (event: UpdateEvent) => void) => {
    const callback = (_ipcEvent: unknown, payload: UpdateEvent) => listener(payload)
    ipcRenderer.on('updater:event', callback)
    return () => ipcRenderer.removeListener('updater:event', callback)
  }
  return Object.freeze({
    getSystemInfo: () => ipcRenderer.invoke('system:get-info'),
    openExternal: (url: string) => ipcRenderer.invoke('window:open-external', url),
    notify: (input: NotificationInput) => ipcRenderer.invoke('notification:show', input),
    quit: () => ipcRenderer.invoke('app:quit'),
    updater: Object.freeze({
      check: (feedUrl: string) => ipcRenderer.invoke('updater:check', feedUrl),
      install: () => ipcRenderer.invoke('updater:install'),
      onEvent
    })
  })
}

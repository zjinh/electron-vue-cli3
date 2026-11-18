import { contextBridge, ipcRenderer } from 'electron'
import { createElectronAPI } from './api'

contextBridge.exposeInMainWorld('electronAPI', createElectronAPI(ipcRenderer))

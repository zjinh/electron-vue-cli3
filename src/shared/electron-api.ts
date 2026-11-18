export interface SystemInfo {
  appVersion: string
  electronVersion: string
  nodeVersion: string
  platform: NodeJS.Platform
}
export interface NotificationInput {
  title: string
  body: string
}
export interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}
export type UpdateEvent =
  | { type: 'checking' }
  | { type: 'available'; version?: string }
  | { type: 'not-available' }
  | { type: 'progress'; progress: UpdateProgress }
  | { type: 'downloaded'; version?: string }
  | { type: 'error'; message: string }
export interface OperationResult {
  ok: boolean
  message?: string
}
export interface ElectronAPI {
  getSystemInfo(): Promise<SystemInfo>
  openExternal(url: string): Promise<OperationResult>
  notify(input: NotificationInput): Promise<OperationResult>
  quit(): Promise<void>
  updater: {
    check(feedUrl: string): Promise<OperationResult>
    install(): Promise<OperationResult>
    onEvent(listener: (event: UpdateEvent) => void): () => void
  }
}

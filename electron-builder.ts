import type { Configuration } from 'app-builder-lib'

const config: Configuration = {
  appId: 'com.zjinh.app.test',
  productName: 'test',
  directories: { output: 'build' },
  files: ['out/**/*', 'package.json'],
  asar: true,
  win: {
    icon: 'public/icon/icon.ico',
    artifactName: '\${productName}_setup_\${version}.\${ext}',
    target: ['nsis']
  },
  nsis: {
    oneClick: false,
    menuCategory: 'electron-cli3',
    shortcutName: 'cli3-测试',
    allowToChangeInstallationDirectory: true,
    perMachine: true,
    runAfterFinish: true
  },
  mac: { icon: 'public/icon/icon.icns' },
  dmg: {
    contents: [
      { x: 410, y: 150, type: 'link', path: '/Applications' },
      { x: 130, y: 150, type: 'file' }
    ]
  },
  linux: { icon: 'public/icon/icon.ico' }
}

export default config

import { app, BrowserWindow } from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, splashScreen
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const splashURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/splash`
  : `file://${__dirname}/index.html#splash`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1600, height: 850,
    titleBarStyle: 'hidden',
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  splashScreen = new BrowserWindow({
    resizable: false, width: 700, maximizable: false, height: 350, transparent: true, frame: false, alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })
  
  mainWindow.loadURL(winURL)
  splashScreen.loadURL(splashURL)

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashScreen.destroy();
      if (splashScreen.isDestroyed) mainWindow.show();
    }, 4000)
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

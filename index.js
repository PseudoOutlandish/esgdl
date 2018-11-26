const setupEvents = require('./setupevents')
if (setupEvents.handleSquirrelEvent()) {
	// squirrel event handled and app will exit in 1000ms, so don't do anything else
	return;
}

require('update-electron-app')()

const {app, BrowserWindow, dialog, Menu, MenuItem, shell, ipcMain, crashReporter, protocol} = require('electron')
const path = require('path')
const url = require('url')

console.log('Runtime.')



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, title: 'ESG Downloader is loading...', alwaysOnTop: false, frame: true, minWidth: 400, minHeight: 400})



  /*const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
    }
  })

  if (isSecondInstance) {
    console.log("An instance of this app is already running... The other instance will now handle your request.")
    app.quit()
  }*/

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'ui/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  //win.setIcon(path.join(__dirname, 'app.ico'))

  // Open the DevTools.
  //win.webContents.openDevTools()

  
  win.on('closed', () => {
    win = null
  })
  win.on('app-command', (e, cmd) => {
    if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
      win.webContents.goBack()
    }
  })

  win.on('unresponsive', function () {
    const options = {
      type: 'info',
      title: 'Renderer Process Hanging',
      message: 'This process is hanging.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function (index) {
      if (index === 0) win.reload()
      else win.close()
    })
  })

  win.center()
  console.log('Created window.')

  if(!app.isDefaultProtocolClient("esgdl")) {
    app.setAsDefaultProtocolClient("esgdl")
  }
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function menu_exit(menuItem, browserWindow, event) {
	if(menuItem == menu_exit) {
		app.quit()
	}
}

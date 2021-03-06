// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const {PythonShell} = require('python-shell');
const kill = require('tree-kill')
let shell;
let mainWindow;

function sendToPython() {

  let options = {
    mode: 'text'
  };
  
  shell = new PythonShell('./backend/server.py', options);
}
sendToPython();
ipcMain.handle('an-action', async (event, arg) => {
    // do stuff
    console.log(arg)
    // await awaitableProcess();
    return "foo";
})

function createWindow () {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity:false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('pub/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
/**
 * Sending messages to Renderer
 * `window` is an object which is an instance of `BrowserWindow`
 * `data` can be a boolean, number, string, object, or array
 */

/**
 * Receiving messages from Renderer
 */
ipcMain.handle( 'custom-endpoint', async ( event, data ) => {
    console.log( data )
} )

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
	
	mainWindow.webContents.openDevTools()
  mainWindow.webContents.send( 'custom-endpoint', {data:shell.childProcess} );
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
    	createWindow()
    	
    }

    
	
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
  let childs = shell.childProcess
  console.log(childs.pid)
  // childs.kill('SIGINT')	
  kill(childs.pid)	
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

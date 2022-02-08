const { contextBridge, ipcRenderer} = require('electron')
const { PythonShell } = require('python-shell');
function sendToPython() {
  var { PythonShell } = require('python-shell');

  let options = {
    mode: 'text'
  };
  
  PythonShell.run('./py/server.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('response: ', results);

  });
}
contextBridge.exposeInMainWorld(
    'electron',
    {
        sendMessage: () => ipcRenderer.send('countdown-start')
    }
)

contextBridge.exposeInMainWorld( 'api', {
    send: ( channel, data ) => ipcRenderer.invoke( channel, data ),
    handle: ( channel, callable, event, data ) => ipcRenderer.on( channel, callable( event, data ) )
} )

sendToPython();
const {app, BrowserWindow} = require('electron');
const path = require('path');
const {spawn} = require('child_process');

let mainWindow;
let server;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on("closed", ()=>{
        mainWindow = null;
        if(server) server.kill(); //explodes the express thing when electron go kaboom

        //Determine what is oxidized and what is reduced in each reaction. Identifying the oxidizing agent and reducing agent also
        //1. 2Sr + O2    -> 2SrO
        //2. 2Li + S     -> Li2S
        //3. 2Cs + Br2   -> 2CsBr
        //4. 3Mg + N2    -> Mg3N2
        //5. 4Fe + 3O2   -> 2Fe2O3
        //6. Cl2 + 2NaBr -> 2NaCl + Br2
    })
}

app.whenReady().then(() => {
    //star t exprless servr
    server = spawn("node", ["server.js"], {
        stdio: "inherit",
        shell: true
    });

    setTimeout(createWindow, 1000);
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit(); //because uhhHH the app doesn't close until you cmd q the damened thing on macmosos
});
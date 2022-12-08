const path = require('path')
const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const fs = require('fs');

function getScreenSize() {
    let mousePosition = electron.screen.getCursorScreenPoint();
    let activeDisplay = electron.screen.getDisplayNearestPoint(mousePosition);
    return activeDisplay.size;
}

function calculateWindowSize() {
    let screenSize = getScreenSize();
    let aspectRatio = screenSize.width/screenSize.height;
    return [800, Math.round(800/aspectRatio)];
}

function createWindow () {
    let win = new BrowserWindow({
        backgroundColor: "#000000",
        frame: false,
        resizable: true,
        icon: path.join(__dirname, 'assets/icon.png'),
        webPreferences: {
            nodeIntegration: true
        }
    })
    let fullscreen = '0';
    try {
        let configFilePath = path.join(
            app.getPath('userData'), 'Local Storage', 'leveldb', '000003.log');
        let configFileContent = fs.readFileSync(configFilePath, 'utf8');
        let fullscreenValueIndex = configFileContent.lastIndexOf('fullscreen') + 12;
        fullscreen = configFileContent[fullscreenValueIndex];
    } catch (error) {
        console.log(error);
    }

    if (fullscreen == '1') {
        screenSize = getScreenSize();
        win.setBounds(
            {x:0, y:0, width: screenSize.width, height: screenSize.height}
        );
    } else {
        winSize = calculateWindowSize();
        win.setSize(winSize[0], winSize[1]);
    }
    win.on('close', () => app.quit());
    try {
        win.loadFile('index.html');
    } catch (error) {
        win.loadURL(`file://${__dirname}/index.html`);
    }
    //win.webContents.openDevTools();
}
try {
    app.whenReady().then(createWindow);
} catch (error) {
    try {
        app.on('ready', createWindow);
    } catch (error) {
        console.log(error);
    }
}

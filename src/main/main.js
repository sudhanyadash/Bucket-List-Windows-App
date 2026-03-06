const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const { registerIpcHandlers } = require('./ipcHandlers');

function getIsDev() {
    return !app.isPackaged;
}

function getDataDir() {
    if (getIsDev()) {
        return path.join(__dirname, '..', '..', 'data');
    }
    // In production, when packaged as portable, use the directory where the .exe is running from
    const exeDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
    return path.join(exeDir, 'data');
}

function ensureDataDir(dataDir) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const mediaDir = path.join(dataDir, 'media');
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
    }
}

let mainWindow;

function createWindow() {
    const isDev = getIsDev();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        backgroundColor: '#212529',
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        titleBarStyle: 'default',
        title: "Lony's Bucket List",
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist-renderer', 'index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    const dataDir = getDataDir();
    ensureDataDir(dataDir);

    // Register custom protocol to serve media files
    protocol.registerFileProtocol('media', (request, callback) => {
        const relativePath = decodeURIComponent(request.url.replace('media://', ''));
        const absolutePath = path.join(dataDir, relativePath);
        callback({ path: absolutePath });
    });

    registerIpcHandlers(dataDir);
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

import path from 'path';
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';

// Apis de comunicación para la UI
import ipcComputer from './IPCs/Computer.js';
import ipcDeskTable from './IPCs/DeskTable.js';
import ipcActivityLog from './IPCs/ActivityLog.js';
import ipcAuth from './IPCs/Auth.js';
import ipcBackup from './IPCs/Backup.js';
import ipcEmployee from './IPCs/Employee.js';
import ipcDeskAccessory from './IPCs/DeskAccessory.js';
import ipcComponent from './IPCs/Component.js';
import ipcPeripheral from './IPCs/Peripheral.js';
import ipcItemTrace from './IPCs/ItemTrace.js';
import ipcCannibalization from './IPCs/Cannibalization.js';
import ipcCannibalizationLog from './IPCs/CannibalizationLog.js';
import ipcTraceabilityReport from './IPCs/TraceabilityReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function createMainWindow() {
    const isDev = !app.isPackaged;
    const iconPath = isDev
        ? path.join(__dirname, '../public/sysLog.png')
        : path.join(__dirname, '../dist-electron/renderer/sysLog.png');

    // Crear la ventana del navegador
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
        },
    });

    // Ocultar el menú de la ventana
    // win.setMenu(null);
    // Maximizar la ventana
    win.maximize();

    const url = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist-electron/renderer/index.html')}`;

    win.loadURL(url);

    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(async () => {
    await initDatabase();
    // API de los módulos
    ipcComputer();
    ipcDeskTable();
    ipcActivityLog();
    ipcAuth();
    ipcBackup();
    ipcEmployee();
    ipcDeskAccessory();
    ipcComponent();
    ipcPeripheral();
    ipcItemTrace();
    ipcCannibalization();
    ipcCannibalizationLog();
    ipcTraceabilityReport();

    // Ventana de la aplicación
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

import { ipcMain, dialog } from 'electron';
import { backupDatabase, restoreDatabase } from '../services/backupServices.js';

export default () => {
    ipcMain.handle('db:backupDatabase', async () => {
        const result = await dialog.showSaveDialog({
            title: 'Guardar respaldo de base de datos',
            defaultPath: `backup-sys_ven911-${new Date().toISOString().slice(0, 10)}.sql`,
            filters: [{ name: 'SQL Backup', extensions: ['sql'] }],
        });

        if (result.canceled || !result.filePath) {
            return { cancelled: true };
        }

        try {
            return await backupDatabase(result.filePath);
        } catch (error) {
            throw new Error(error.message || 'Error al crear respaldo');
        }
    });

    ipcMain.handle('db:restoreDatabase', async () => {
        const result = await dialog.showOpenDialog({
            title: 'Seleccionar archivo de respaldo',
            filters: [{ name: 'SQL Backup', extensions: ['sql'] }],
            properties: ['openFile'],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return { cancelled: true };
        }

        try {
            return await restoreDatabase(result.filePaths[0]);
        } catch (error) {
            throw new Error(error.message || 'Error al restaurar respaldo');
        }
    });
};
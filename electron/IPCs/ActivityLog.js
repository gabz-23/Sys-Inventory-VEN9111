import { ipcMain } from 'electron';
import { getRecentActivities } from '../services/activityLogServices.js';

export default () => {
    ipcMain.handle('db:getRecentActivities', async () => {
        return await getRecentActivities();
    });
};

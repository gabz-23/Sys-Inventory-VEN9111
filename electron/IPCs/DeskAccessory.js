import { ipcMain } from 'electron';
import {
    getAllDeskAccessories,
    createDeskAccessory,
    updateDeskAccessory,
    deleteDeskAccessory,
    duplicateDeskAccessories,
    deleteManyDeskAccessories,
} from '../services/deskAccessoryServices.js';

export default () => {
    ipcMain.handle('db:getAllDeskAccessories', async () => await getAllDeskAccessories());
    ipcMain.handle('db:createDeskAccessory', async (_, data) => await createDeskAccessory(data));
    ipcMain.handle('db:updateDeskAccessory', async (_, { id, data }) => await updateDeskAccessory(id, data));
    ipcMain.handle('db:deleteDeskAccessory', async (_, id) => await deleteDeskAccessory(id));
    ipcMain.handle('db:duplicateDeskAccessories', async (_, ids) => {
        try { return await duplicateDeskAccessories(ids); }
        catch (error) { throw new Error(error.message || 'Error al duplicar accesorios de escritorio'); }
    });
    ipcMain.handle('db:deleteManyDeskAccessories', async (_, ids) => {
        try { return await deleteManyDeskAccessories(ids); }
        catch (error) { throw new Error(error.message || 'Error al eliminar accesorios de escritorio'); }
    });
};

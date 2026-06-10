import { ipcMain } from 'electron';
import {
    getAllDeskTables,
    createDeskTable,
    updateDeskTable,
    deleteDeskTable,
    duplicateDeskTables,
    deleteManyDeskTables,
} from '../services/deskTableServices.js';

export default () => {
    ipcMain.handle('db:getAllDeskTables', async () => {
        return await getAllDeskTables();
    });

    ipcMain.handle('db:createDeskTable', async (_, data) => {
        return await createDeskTable(data);
    });

    ipcMain.handle('db:updateDeskTable', async (_, { id, data }) => {
        return await updateDeskTable(id, data);
    });

    ipcMain.handle('db:deleteDeskTable', async (_, id) => {
        return await deleteDeskTable(id);
    });

    ipcMain.handle('db:duplicateDeskTables', async (_, ids) => {
        try {
            return await duplicateDeskTables(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al duplicar escritorios');
        }
    });

    ipcMain.handle('db:deleteManyDeskTables', async (_, ids) => {
        try {
            return await deleteManyDeskTables(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar escritorios');
        }
    });
};

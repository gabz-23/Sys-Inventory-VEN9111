import { ipcMain } from 'electron';
import {
    getAllItemTraces,
    createItemTrace,
    updateItemTrace,
    deleteItemTrace,
    deleteManyItemTraces,
} from '../services/itemTraceServices.js';

export default () => {
    ipcMain.handle('db:getAllItemTraces', async () => await getAllItemTraces());
    ipcMain.handle('db:createItemTrace', async (_, data) => await createItemTrace(data));
    ipcMain.handle('db:updateItemTrace', async (_, { id, data }) => await updateItemTrace(id, data));
    ipcMain.handle('db:deleteItemTrace', async (_, id) => await deleteItemTrace(id));
    ipcMain.handle('db:deleteManyItemTraces', async (_, ids) => {
        try { return await deleteManyItemTraces(ids); }
        catch (error) { throw new Error(error.message || 'Error al eliminar trazabilidades'); }
    });
};

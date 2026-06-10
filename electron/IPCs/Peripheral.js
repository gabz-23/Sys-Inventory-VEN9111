import { ipcMain } from 'electron';
import {
    getAllPeripherals,
    createPeripheral,
    updatePeripheral,
    deletePeripheral,
    duplicatePeripherals,
    deleteManyPeripherals,
} from '../services/peripheralServices.js';

export default () => {
    ipcMain.handle('db:getAllPeripherals', async () => await getAllPeripherals());
    ipcMain.handle('db:createPeripheral', async (_, data) => await createPeripheral(data));
    ipcMain.handle('db:updatePeripheral', async (_, { id, data }) => await updatePeripheral(id, data));
    ipcMain.handle('db:deletePeripheral', async (_, id) => await deletePeripheral(id));
    ipcMain.handle('db:duplicatePeripherals', async (_, ids) => {
        try { return await duplicatePeripherals(ids); }
        catch (error) { throw new Error(error.message || 'Error al duplicar periféricos'); }
    });
    ipcMain.handle('db:deleteManyPeripherals', async (_, ids) => {
        try { return await deleteManyPeripherals(ids); }
        catch (error) { throw new Error(error.message || 'Error al eliminar periféricos'); }
    });
};

import { ipcMain } from 'electron';
import {
    getAllComponents,
    createComponent,
    updateComponent,
    deleteComponent,
    duplicateComponents,
    deleteManyComponents,
} from '../services/componentServices.js';

export default () => {
    ipcMain.handle('db:getAllComponents', async () => await getAllComponents());
    ipcMain.handle('db:createComponent', async (_, data) => await createComponent(data));
    ipcMain.handle('db:updateComponent', async (_, { id, data }) => await updateComponent(id, data));
    ipcMain.handle('db:deleteComponent', async (_, id) => await deleteComponent(id));
    ipcMain.handle('db:duplicateComponents', async (_, ids) => {
        try { return await duplicateComponents(ids); }
        catch (error) { throw new Error(error.message || 'Error al duplicar componentes'); }
    });
    ipcMain.handle('db:deleteManyComponents', async (_, ids) => {
        try { return await deleteManyComponents(ids); }
        catch (error) { throw new Error(error.message || 'Error al eliminar componentes'); }
    });
};

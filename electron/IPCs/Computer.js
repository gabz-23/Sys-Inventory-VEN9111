import { ipcMain } from 'electron';
import {
    createComputer,
    deleteComputer,
    getAllComputers,
    updateComputer,
    duplicateComputers,
    deleteManyComputers,
} from '../services/computerServices.js';

export default () => {
    ipcMain.handle('db:getAllComputers', async () => {
        return await getAllComputers();
    });

    ipcMain.handle('db:createComputer', async (_, data) => {
        return await createComputer(data);
    });

    ipcMain.handle('db:updateComputer', async (_, { id, data }) => {
        return await updateComputer(id, data);
    });

    ipcMain.handle('db:deleteComputer', async (_, id) => {
        return await deleteComputer(id);
    });

    ipcMain.handle('db:duplicateComputers', async (_, ids) => {
        try {
            return await duplicateComputers(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al duplicar computadores');
        }
    });

    ipcMain.handle('db:deleteManyComputers', async (_, ids) => {
        try {
            return await deleteManyComputers(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar computadores');
        }
    });
};

import { ipcMain } from 'electron';
import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    duplicateEmployees,
    deleteManyEmployees,
} from '../services/employeeServices.js';

export default () => {
    ipcMain.handle('db:getAllEmployees', async () => {
        return await getAllEmployees();
    });

    ipcMain.handle('db:createEmployee', async (_, data) => {
        return await createEmployee(data);
    });

    ipcMain.handle('db:updateEmployee', async (_, { id, data }) => {
        return await updateEmployee(id, data);
    });

    ipcMain.handle('db:deleteEmployee', async (_, id) => {
        return await deleteEmployee(id);
    });

    ipcMain.handle('db:duplicateEmployees', async (_, ids) => {
        try {
            return await duplicateEmployees(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al duplicar empleados');
        }
    });

    ipcMain.handle('db:deleteManyEmployees', async (_, ids) => {
        try {
            return await deleteManyEmployees(ids);
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar empleados');
        }
    });
};

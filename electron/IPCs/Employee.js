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
        try {
            return await createEmployee(data);
        } catch (error) {
            throw new Error(error.message || 'Error al crear empleado');
        }
    });

    ipcMain.handle('db:updateEmployee', async (_, { id, data }) => {
        try {
            return await updateEmployee(id, data);
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar empleado');
        }
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

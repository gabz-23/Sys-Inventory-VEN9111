import { ipcMain } from 'electron';
import {
    getUnifiedTraceability,
    getTraceabilityUsers,
    getTraceabilityItemTypes,
} from '../services/traceabilityReportServices.js';

export default () => {
    ipcMain.handle('db:getUnifiedTraceability', async (_, filters) => {
        try {
            return await getUnifiedTraceability(filters);
        } catch (error) {
            throw new Error(error.message || 'Error al obtener reporte de trazabilidad');
        }
    });

    ipcMain.handle('db:getTraceabilityUsers', async () => {
        try {
            return await getTraceabilityUsers();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener usuarios');
        }
    });

    ipcMain.handle('db:getTraceabilityItemTypes', async () => {
        try {
            return await getTraceabilityItemTypes();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener tipos de elemento');
        }
    });
};

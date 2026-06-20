import { ipcMain } from 'electron';
import {
    getAllCannibalizationsService,
    createCannibalizationService,
    createBulkCannibalizationService,
    createBulkCannibalizationMovementService,
    getAllCannibalizationMovementsService,
    deleteCannibalizationService,
    deleteCannibalizationMovementService,
    getMissingItemsByComputer,
} from '../services/cannibalizationServices.js';

export default () => {
    ipcMain.handle('db:getAllCannibalizaciones', async () => {
        try { return await getAllCannibalizationsService(); }
        catch (error) { throw new Error(error.message || 'Error al obtener canibalizaciones'); }
    });

    ipcMain.handle('db:createCannibalizacion', async (_, data) => {
        try { return await createCannibalizationService(data); }
        catch (error) { throw new Error(error.message || 'Error al crear canibalización'); }
    });

    ipcMain.handle('db:deleteCannibalizacion', async (_, id) => {
        try { return await deleteCannibalizationService(id); }
        catch (error) { throw new Error(error.message || 'Error al eliminar canibalización'); }
    });

    ipcMain.handle('db:createBulkCannibalizacion', async (_, data) => {
        try { return await createBulkCannibalizationService(data); }
        catch (error) { throw new Error(error.message || 'Error al crear canibalización masiva'); }
    });

    ipcMain.handle('db:createBulkCannibalizationMovement', async (_, data) => {
        try { return await createBulkCannibalizationMovementService(data); }
        catch (error) { throw new Error(error.message || 'Error al crear movimiento de canibalización'); }
    });

    ipcMain.handle('db:getAllCannibalizationMovements', async () => {
        try { return await getAllCannibalizationMovementsService(); }
        catch (error) { throw new Error(error.message || 'Error al obtener movimientos de canibalización'); }
    });

    ipcMain.handle('db:deleteManyCannibalizationMovements', async (_, ids) => {
        try { return await deleteCannibalizationMovementService(ids); }
        catch (error) { throw new Error(error.message || 'Error al eliminar movimientos'); }
    });

    ipcMain.handle('db:getMissingItemsByComputer', async (_, computerId) => {
        try { return await getMissingItemsByComputer(computerId); }
        catch (error) { throw new Error(error.message || 'Error al obtener ítems faltantes'); }
    });
};

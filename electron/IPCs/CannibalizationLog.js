import { ipcMain } from 'electron';
import {
    getItemsByState,
    transitionItemState,
    getAvailableItems,
} from '../services/cannibalizationLogServices.js';

export default () => {
    ipcMain.handle('db:getCannibalizationLogItems', async (_, states) => {
        try {
            return await getItemsByState(states);
        } catch (error) {
            throw new Error(error.message || 'Error al obtener ítems de bitácora');
        }
    });

    ipcMain.handle('db:transitionItemState', async (_, { itemType, itemCode, targetState, userId }) => {
        try {
            return await transitionItemState(itemType, itemCode, targetState, userId);
        } catch (error) {
            throw new Error(error.message || 'Error al cambiar estado del ítem');
        }
    });

    ipcMain.handle('db:getAvailableItems', async () => {
        try {
            return await getAvailableItems();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener ítems disponibles');
        }
    });
};

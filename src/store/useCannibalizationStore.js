import { create } from 'zustand';
import { useComponentStore } from './useComponentStore';
import { usePeripheralStore } from './usePeripheralStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';

export const useCannibalizationStore = create((set, get) => ({
    movements: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    loadMovements: async (forceRefresh = false) => {
        const { isCacheValid, movements } = get();
        if (!forceRefresh && isCacheValid() && movements.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const data = await window.electronAPI.getAllCannibalizationMovements();
            set({ movements: data, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener movimientos:', error);
            set({ error: error.message, isLoading: false, movements: [] });
        }
    },

    addMovement: async (data) => {
        try {
            const created = await window.electronAPI.createBulkCannibalizationMovement(data);
            set((state) => ({ movements: [created, ...state.movements], lastFetch: Date.now() }));
            await get().loadMovements(true);
            await useComponentStore.getState().loadComponents(true);
            await usePeripheralStore.getState().loadPeripherals(true);
            await useComputerStore.getState().loadComputers(true);
        } catch (error) {
            console.error('Error al crear movimiento:', error);
            throw error;
        }
    },

    deleteCannibalizacion: async (id) => {
        try {
            await window.electronAPI.deleteCannibalizacion(id);
            set((state) => ({
                movements: state.movements.filter((item) => item.id !== id),
                lastFetch: Date.now(),
            }));
            await get().loadMovements(true);
            await useComponentStore.getState().loadComponents(true);
            await usePeripheralStore.getState().loadPeripherals(true);
            await useComputerStore.getState().loadComputers(true);
        } catch (error) {
            console.error('Error al eliminar canibalización:', error);
            throw error;
        }
    },

    deleteMovements: async (ids) => {
        try {
            await window.electronAPI.deleteManyCannibalizationMovements(ids);
            set((state) => ({
                movements: state.movements.filter((item) => !ids.includes(item.id)),
                lastFetch: Date.now(),
            }));
        } catch (error) {
            console.error('Error al eliminar movimientos:', error);
            throw error;
        }
    },
}));

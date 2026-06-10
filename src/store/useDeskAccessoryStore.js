import { create } from 'zustand';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';

export const useDeskAccessoryStore = create((set, get) => ({
    deskAccessories: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    // Helper para actualizar el store de escritorios cuando cambian los accesorios
    refreshDeskStore: async () => {
        try {
            const deskStore = useDeskStore.getState();
            if (deskStore.loadDesks) {
                await deskStore.loadDesks(true);
            }
        } catch (error) {
            console.error('Error al actualizar el store de escritorios:', error);
        }
    },

    loadDeskAccessories: async (forceRefresh = false) => {
        const { isCacheValid, deskAccessories } = get();
        if (!forceRefresh && isCacheValid() && deskAccessories.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const data = await window.electronAPI.getAllDeskAccessories();
            set({ deskAccessories: data, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener accesorios de escritorio:', error);
            set({ error: error.message, isLoading: false, deskAccessories: [] });
        }
    },

    addDeskAccessory: async (data) => {
        try {
            const created = await window.electronAPI.createDeskAccessory(data);
            set((state) => ({ deskAccessories: [...state.deskAccessories, created], lastFetch: Date.now() }));
            await get().loadDeskAccessories(true);
            await get().refreshDeskStore();
        } catch (error) {
            console.error('Error al agregar accesorio de escritorio:', error);
            throw error;
        }
    },

    updateDeskAccessory: async (id, data) => {
        try {
            const updated = await window.electronAPI.updateDeskAccessory(id, data);
            set((state) => ({
                deskAccessories: state.deskAccessories.map((item) => (item.id === id ? updated : item)),
                lastFetch: Date.now(),
            }));
            await get().loadDeskAccessories(true);
            await get().refreshDeskStore();
        } catch (error) {
            console.error('Error al actualizar accesorio de escritorio:', error);
            throw error;
        }
    },

    deleteDeskAccessory: async (id) => {
        try {
            await window.electronAPI.deleteDeskAccessory(id);
            set((state) => ({
                deskAccessories: state.deskAccessories.filter((item) => item.id !== id),
                lastFetch: Date.now(),
            }));
            await get().refreshDeskStore();
        } catch (error) {
            console.error('Error al eliminar accesorio de escritorio:', error);
            throw error;
        }
    },
}));

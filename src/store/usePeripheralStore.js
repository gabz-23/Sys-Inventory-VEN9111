import { create } from 'zustand';

export const usePeripheralStore = create((set, get) => ({
    peripherals: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    loadPeripherals: async (forceRefresh = false) => {
        const { isCacheValid, peripherals } = get();
        if (!forceRefresh && isCacheValid() && peripherals.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const data = await window.electronAPI.getAllPeripherals();
            set({ peripherals: data, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener periféricos:', error);
            set({ error: error.message, isLoading: false, peripherals: [] });
        }
    },

    addPeripheral: async (data) => {
        try {
            const created = await window.electronAPI.createPeripheral(data);
            set((state) => ({ peripherals: [...state.peripherals, created], lastFetch: Date.now() }));
            await get().loadPeripherals(true);
        } catch (error) {
            console.error('Error al agregar periférico:', error);
            throw error;
        }
    },

    updatePeripheral: async (id, data) => {
        try {
            const updated = await window.electronAPI.updatePeripheral(id, data);
            set((state) => ({
                peripherals: state.peripherals.map((item) => (item.id === id ? updated : item)),
                lastFetch: Date.now(),
            }));
            await get().loadPeripherals(true);
        } catch (error) {
            console.error('Error al actualizar periférico:', error);
            throw error;
        }
    },

    deletePeripheral: async (id) => {
        try {
            await window.electronAPI.deletePeripheral(id);
            set((state) => ({
                peripherals: state.peripherals.filter((item) => item.id !== id),
                lastFetch: Date.now(),
            }));
        } catch (error) {
            console.error('Error al eliminar periférico:', error);
            throw error;
        }
    },
}));

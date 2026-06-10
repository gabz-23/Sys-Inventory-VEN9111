import { create } from 'zustand';

export const useComponentStore = create((set, get) => ({
    components: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    loadComponents: async (forceRefresh = false) => {
        const { isCacheValid, components } = get();
        if (!forceRefresh && isCacheValid() && components.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const data = await window.electronAPI.getAllComponents();
            set({ components: data, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener componentes:', error);
            set({ error: error.message, isLoading: false, components: [] });
        }
    },

    addComponent: async (data) => {
        try {
            const created = await window.electronAPI.createComponent(data);
            set((state) => ({ components: [...state.components, created], lastFetch: Date.now() }));
            await get().loadComponents(true);
        } catch (error) {
            console.error('Error al agregar componente:', error);
            throw error;
        }
    },

    updateComponent: async (id, data) => {
        try {
            const updated = await window.electronAPI.updateComponent(id, data);
            set((state) => ({
                components: state.components.map((item) => (item.id === id ? updated : item)),
                lastFetch: Date.now(),
            }));
            await get().loadComponents(true);
        } catch (error) {
            console.error('Error al actualizar componente:', error);
            throw error;
        }
    },

    deleteComponent: async (id) => {
        try {
            await window.electronAPI.deleteComponent(id);
            set((state) => ({
                components: state.components.filter((item) => item.id !== id),
                lastFetch: Date.now(),
            }));
        } catch (error) {
            console.error('Error al eliminar componente:', error);
            throw error;
        }
    },
}));

import { create } from 'zustand';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';
import { useAuthStore } from '@/store/useAuthStore';

const refreshItemStoreByType = (itemType) => {
    switch (itemType) {
        case 'Computadoras':
            useComputerStore.getState().loadComputers(true);
            break;
        case 'Acc. Escritorio':
            useDeskAccessoryStore.getState().loadDeskAccessories(true);
            break;
        case 'Componentes':
            useComponentStore.getState().loadComponents(true);
            break;
        case 'Periféricos':
            usePeripheralStore.getState().loadPeripherals(true);
            break;
    }
};

export const useItemTraceStore = create((set, get) => ({
    itemTraces: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    loadItemTraces: async (forceRefresh = false) => {
        const { isCacheValid, itemTraces } = get();
        if (!forceRefresh && isCacheValid() && itemTraces.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const data = await window.electronAPI.getAllItemTraces();
            set({ itemTraces: data, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            set({ error: error.message, isLoading: false, itemTraces: [] });
        }
    },

    addItemTrace: async (data) => {
        const user = useAuthStore.getState().user;
        const created = await window.electronAPI.createItemTrace({
            ...data,
            createdBy: user?.firstName || 'Sistema',
        });
        set((state) => ({ itemTraces: [...state.itemTraces, created], lastFetch: Date.now() }));
        await get().loadItemTraces(true);
        refreshItemStoreByType(created.itemType);
    },

    updateItemTrace: async (id, data) => {
        const user = useAuthStore.getState().user;
        const updated = await window.electronAPI.updateItemTrace(id, {
            ...data,
            createdBy: user?.firstName || 'Sistema',
        });
        set((state) => ({
            itemTraces: state.itemTraces.map((item) => (item.id === id ? updated : item)),
            lastFetch: Date.now(),
        }));
        await get().loadItemTraces(true);
        refreshItemStoreByType(updated.itemType);
    },

    deleteItemTrace: async (id) => {
        await window.electronAPI.deleteItemTrace(id);
        set((state) => ({
            itemTraces: state.itemTraces.filter((item) => item.id !== id),
            lastFetch: Date.now(),
        }));
    },
}));

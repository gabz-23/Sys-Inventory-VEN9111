import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useDeskAccessoryStore } from './useDeskAccessoryStore';
import { useComponentStore } from './useComponentStore';
import { usePeripheralStore } from './usePeripheralStore';

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

export const useCannibalizationLogStore = create((set, get) => ({
    damagedItems: [],
    rebuiltItems: [],
    availableItems: [],
    isLoading: false,
    transitioningId: null,

    loadAll: async () => {
        set({ isLoading: true });
        try {
            const [damaged, rebuilt, available] = await Promise.all([
                window.electronAPI.getCannibalizationLogItems(['Dañado']),
                window.electronAPI.getCannibalizationLogItems(['Reconstruido']),
                window.electronAPI.getAvailableItems(),
            ]);
            set({
                damagedItems: damaged || [],
                rebuiltItems: rebuilt || [],
                availableItems: available || [],
                isLoading: false,
            });
        } catch (error) {
            console.error('Error al cargar bitácoras:', error);
            set({ isLoading: false });
        }
    },

    transitionItem: async (itemType, itemCode, targetState) => {
        const user = useAuthStore.getState().user;
        set({ transitioningId: `${itemType}-${itemCode}` });
        try {
            await window.electronAPI.transitionItemState({
                itemType,
                itemCode,
                targetState,
                userId: user?.firstName || 'Sistema',
            });
            await get().loadAll();
            refreshItemStoreByType(itemType);
        } catch (error) {
            console.error('Error al transicionar ítem:', error);
            throw error;
        } finally {
            set({ transitioningId: null });
        }
    },
}));

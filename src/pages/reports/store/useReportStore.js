import { create } from 'zustand';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';
import { useCannibalizationStore } from '@/store/useCannibalizationStore';

export const useReportStore = create(() => ({
    // Cargar todos los datos necesarios para los reportes
    loadAllData: async () => {
        const computerStore = useComputerStore.getState();
        const deskStore = useDeskStore.getState();
        const deskAccStore = useDeskAccessoryStore.getState();
        const componentStore = useComponentStore.getState();
        const peripheralStore = usePeripheralStore.getState();
        const cannibalizationStore = useCannibalizationStore.getState();

        await Promise.all([
            computerStore.loadComputers(),
            deskStore.loadDesks(),
            deskAccStore.loadDeskAccessories(),
            componentStore.loadComponents(),
            peripheralStore.loadPeripherals(),
            cannibalizationStore.loadMovements(),
        ]);
    },

    // Obtener todos los datos
    getAllData: () => {
        const computerStore = useComputerStore.getState();
        const deskStore = useDeskStore.getState();
        const deskAccStore = useDeskAccessoryStore.getState();
        const componentStore = useComponentStore.getState();
        const peripheralStore = usePeripheralStore.getState();
        const cannibalizationStore = useCannibalizationStore.getState();

        return {
            computers: computerStore.computers || [],
            desks: deskStore.desks || [],
            deskAccessories: deskAccStore.deskAccessories || [],
            components: componentStore.components || [],
            peripherals: peripheralStore.peripherals || [],
            movements: cannibalizationStore.movements || [],
        };
    },
}));

import { create } from 'zustand';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';

export const useComputerStore = create((set, get) => ({
    computers: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos en milisegundos

    // Verifica si el caché es válido
    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    loadComputers: async (forceRefresh = false) => {
        const { isCacheValid, computers } = get();

        // Si el caché es válido y no se fuerza refresh, retorna los datos en caché
        if (!forceRefresh && isCacheValid() && computers.length > 0) {
            return;
        }
        set({ isLoading: true, error: null });

        try {
            const computers = await window.electronAPI.getAllComputers();
            set({ computers: computers, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener computadoras:', error);
            set({ error: error.message, isLoading: false, computers: [] });
        }
    },

    addComputer: async (computerData) => {
        try {
            const newComp = await window.electronAPI.createComputer(computerData);

            set((state) => ({
                computers: [...state.computers, newComp],
                lastFetch: Date.now(), // Renueva el timestamp del caché
            }));

            // Fuerza refresh después de agregar
            await get().loadComputers(true);

            // Refrescar la lista de accesorios si se asignaron accesorios al computador
            if (computerData.accessories && Array.isArray(computerData.accessories) && computerData.accessories.length > 0) {
                const deskAccStore = useDeskAccessoryStore.getState();
                if (deskAccStore.loadDeskAccessories) {
                    await deskAccStore.loadDeskAccessories(true);
                }
            }

            // Refrescar componentes y periféricos para reflejar las nuevas asignaciones
            const compStore = useComponentStore.getState();
            if (compStore.loadComponents) {
                await compStore.loadComponents(true);
            }
            const periphStore = usePeripheralStore.getState();
            if (periphStore.loadPeripherals) {
                await periphStore.loadPeripherals(true);
            }
        } catch (error) {
            console.error('Error al agregar computadora:', error);
            throw error;
        }
    },

    updateComputer: async (id, computerData) => {
        try {
            const updatedComp = await window.electronAPI.updateComputer(id, computerData);

            // Actualiza solo el registro modificado en el caché
            set((state) => ({
                computers: state.computers.map((computer) => (computer.id === id ? updatedComp : computer)),
                lastFetch: Date.now(),
            }));

            // Fuerza refresh después de actualizar
            await get().loadComputers(true);

            // Refrescar la lista de accesorios para actualizar las relaciones con computadores
            // Esto es necesario porque se pueden agregar, remover o cambiar accesorios del computador
            const deskAccStore = useDeskAccessoryStore.getState();
            if (deskAccStore.loadDeskAccessories) {
                await deskAccStore.loadDeskAccessories(true);
            }

            // Refrescar componentes y periféricos para reflejar las nuevas asignaciones
            const compStore = useComponentStore.getState();
            if (compStore.loadComponents) {
                await compStore.loadComponents(true);
            }
            const periphStore = usePeripheralStore.getState();
            if (periphStore.loadPeripherals) {
                await periphStore.loadPeripherals(true);
            }
        } catch (error) {
            console.error('Error al actualizar computadora:', error);
            throw error;
        }
    },

    deleteComputer: async (id) => {
        try {
            await window.electronAPI.deleteComputer(id);

            // Elimina del caché localmente sin refetch
            set((state) => ({
                computers: state.computers.filter((computer) => computer.id !== id),
                lastFetch: Date.now(),
            }));

            // Refrescar la lista de escritorios para actualizar los que tenían este computador asignado
            const deskStore = useDeskStore.getState();
            if (deskStore.loadDesks) {
                deskStore.loadDesks(true);
            }

            // Refrescar la lista de accesorios para actualizar las relaciones con computadores
            const deskAccStore = useDeskAccessoryStore.getState();
            if (deskAccStore.loadDeskAccessories) {
                await deskAccStore.loadDeskAccessories(true);
            }

            // Refrescar componentes y periféricos para reflejar las desasignaciones
            const compStore = useComponentStore.getState();
            if (compStore.loadComponents) {
                await compStore.loadComponents(true);
            }
            const periphStore = usePeripheralStore.getState();
            if (periphStore.loadPeripherals) {
                await periphStore.loadPeripherals(true);
            }
        } catch (error) {
            console.error('Error al eliminar computadora:', error);
            throw error;
        }
    },
}));

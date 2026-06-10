import { create } from 'zustand';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';

export const useDeskStore = create((set, get) => ({
    desks: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos en milisegundos

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

    // Helper para actualizar el store de computadores cuando cambia la asignación de un escritorio
    refreshComputerStore: async () => {
        try {
            const computerStore = useComputerStore.getState();
            if (computerStore.loadComputers) {
                await computerStore.loadComputers(true);
            }
        } catch (error) {
            console.error('Error al actualizar el store de computadores:', error);
        }
    },

    // Helper para actualizar el store de accesorios cuando cambia la asignación de un escritorio
    refreshAccessoryStore: async () => {
        try {
            const accessoryStore = useDeskAccessoryStore.getState();
            if (accessoryStore.loadDeskAccessories) {
                await accessoryStore.loadDeskAccessories(true);
            }
        } catch (error) {
            console.error('Error al actualizar el store de accesorios:', error);
        }
    },

    loadDesks: async (forceRefresh = false) => {
        const { isCacheValid, desks } = get();

        if (!forceRefresh && isCacheValid() && desks.length > 0) {
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const desks = await window.electronAPI.getAllDeskTables();
            set({ desks: desks, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener los escritorios:', error);
            set({ error: error.message, isLoading: false, desks: [] });
        }
    },

    addDesk: async (deskData) => {
        try {
            const newDesk = await window.electronAPI.createDeskTable(deskData);

            set((state) => ({
                desks: [...state.desks, newDesk],
                lastFetch: Date.now(), // Renueva el timestamp del caché
            }));

            // Fuerza refresh después de agregar
            await get().loadDesks(true);

            // Si se asignó un computador al escritorio, actualizar el store de computadores
            if (deskData.computer) {
                await get().refreshComputerStore();
            }

            // Si se asignaron accesorios al escritorio, actualizar el store de accesorios
            if (deskData.accessories && Array.isArray(deskData.accessories) && deskData.accessories.length > 0) {
                await get().refreshAccessoryStore();
            }
        } catch (error) {
            console.error('Error al agregar escritorio:', error);
            throw error;
        }
    },

    updateDesk: async (id, deskData) => {
        try {
            // Obtener el escritorio actual para verificar si tenía un computador asignado y accesorios
            const currentDesk = get().desks.find((desk) => desk.id === id);
            const hadComputer = currentDesk?.computerId;

            const updatedDesk = await window.electronAPI.updateDeskTable(id, deskData);

            // Actualiza solo el registro modificado en el caché
            set((state) => ({
                desks: state.desks.map((desk) => (desk.id === id ? updatedDesk : desk)),
                lastFetch: Date.now(),
            }));

            // Fuerza refresh después de actualizar
            await get().loadDesks(true);

            // Si se cambió la asignación del computador (se asignó, removió o cambió), actualizar el store de computadores
            const newComputerId = deskData.computer !== undefined ? deskData.computer : updatedDesk?.computerId;
            if (hadComputer !== newComputerId) {
                await get().refreshComputerStore();
            }

            // Si se modificaron los accesorios (se agregaron, removieron o cambiaron), actualizar el store de accesorios
            // Siempre refrescar si se pasaron accesorios en deskData, ya que indica que hubo cambios
            if (deskData.accessories !== undefined) {
                await get().refreshAccessoryStore();
            }
        } catch (error) {
            console.error('Error al actualizar escritorio:', error);
            throw error;
        }
    },

    deleteDesk: async (id) => {
        try {
            // Obtener el escritorio antes de eliminarlo para verificar si tenía un computador asignado y accesorios
            const deskToDelete = get().desks.find((desk) => desk.id === id);
            const hadComputer = deskToDelete?.computerId;
            const hadAccessories =
                deskToDelete?.accessories &&
                Array.isArray(deskToDelete.accessories) &&
                deskToDelete.accessories.length > 0;

            await window.electronAPI.deleteDeskTable(id);

            // Elimina del caché localmente sin refetch
            set((state) => ({
                desks: state.desks.filter((desk) => desk.id !== id),
                lastFetch: Date.now(),
            }));

            // Si el escritorio tenía un computador asignado, actualizar el store de computadores
            if (hadComputer) {
                await get().refreshComputerStore();
            }

            // Si el escritorio tenía accesorios asignados, actualizar el store de accesorios
            if (hadAccessories) {
                await get().refreshAccessoryStore();
            }
        } catch (error) {
            console.error('Error al eliminar escritorio:', error);
            throw error;
        }
    },
}));

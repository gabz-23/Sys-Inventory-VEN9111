import { create } from 'zustand';

export const useTraceabilityReportStore = create((set) => ({
    records: [],
    users: [],
    itemTypes: [],
    isLoading: false,
    filters: {
        movementTypes: [],
        dateStart: null,
        dateEnd: null,
        itemTypes: [],
        users: [],
    },

    loadFilters: async () => {
        try {
            const [users, itemTypes] = await Promise.all([
                window.electronAPI.getTraceabilityUsers(),
                window.electronAPI.getTraceabilityItemTypes(),
            ]);
            set({ users: users || [], itemTypes: itemTypes || [] });
        } catch (error) {
            console.error('Error al cargar filtros:', error);
        }
    },

    loadRecords: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const data = await window.electronAPI.getUnifiedTraceability(filters);
            set({ records: data || [], isLoading: false });
        } catch (error) {
            console.error('Error al cargar trazabilidad:', error);
            set({ records: [], isLoading: false });
        }
    },

    setFilter: (key, value) => {
        set((state) => ({ filters: { ...state.filters, [key]: value } }));
    },

    clearFilters: () => {
        set({ filters: { movementTypes: [], dateStart: null, dateEnd: null, itemTypes: [], users: [] } });
    },
}));

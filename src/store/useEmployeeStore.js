import { create } from 'zustand';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: 5 * 60 * 1000,

    isCacheValid: () => {
        const { lastFetch, cacheTimeout } = get();
        if (!lastFetch) return false;
        return Date.now() - lastFetch < cacheTimeout;
    },

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

    loadEmployees: async (forceRefresh = false) => {
        const { isCacheValid, employees } = get();

        if (!forceRefresh && isCacheValid() && employees.length > 0) {
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const employees = await window.electronAPI.getAllEmployees();
            set({ employees, isLoading: false, lastFetch: Date.now() });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            set({ error: error.message, isLoading: false, employees: [] });
        }
    },

    addEmployee: async (employeeData) => {
        try {
            const newEmployee = await window.electronAPI.createEmployee(employeeData);

            set((state) => ({
                employees: [...state.employees, newEmployee],
                lastFetch: Date.now(),
            }));

            await get().loadEmployees(true);
        } catch (error) {
            console.error('Error al agregar empleado:', error);
            throw error;
        }
    },

    updateEmployee: async (id, employeeData) => {
        try {
            const updatedEmployee = await window.electronAPI.updateEmployee(id, employeeData);

            set((state) => ({
                employees: state.employees.map((emp) => (emp.id === id ? updatedEmployee : emp)),
                lastFetch: Date.now(),
            }));

            await get().loadEmployees(true);
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            throw error;
        }
    },

    deleteEmployee: async (id) => {
        try {
            await window.electronAPI.deleteEmployee(id);

            set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id),
                lastFetch: Date.now(),
            }));

            await get().refreshDeskStore();
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            throw error;
        }
    },
}));

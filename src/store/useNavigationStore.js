import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
    // Vista actual
    currentView: 'dashboard',
    // Estado de la barra lateral
    isCollapsed: false,

    // Navegar a una vista
    navigate: (view) => set({ currentView: view }),
    // Toggle el estado de la barra lateral
    toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));

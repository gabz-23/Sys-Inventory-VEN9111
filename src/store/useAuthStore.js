import { create } from 'zustand';

// Cargar estado inicial desde localStorage y verificar si hay usuarios en la base de datos
const loadAuthFromStorage = async () => {
    try {
        // Verificar si hay usuarios en la base de datos
        const usersExist = await window.electronAPI.hasUsers();
        
        // Si no hay usuarios en la base de datos, limpiar el localStorage
        if (!usersExist) {
            localStorage.removeItem('auth-storage');
            return { user: null, isAuthenticated: false };
        }

        // Si hay usuarios, cargar desde localStorage
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.user && parsed.isAuthenticated) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('Error al cargar autenticación desde localStorage:', error);
        // En caso de error, limpiar el localStorage por seguridad
        localStorage.removeItem('auth-storage');
    }
    return { user: null, isAuthenticated: false };
};

// Cargar estado inicial de forma síncrona (sin usuarios por defecto)
// La verificación real se hará cuando se monte el componente
const initialState = { user: null, isAuthenticated: false };

export const useAuthStore = create((set, get) => ({
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,
    initialized: false,
    
    // Inicializar verificando usuarios y cargando desde localStorage
    initialize: async () => {
        const authState = await loadAuthFromStorage();
        set({ ...authState, initialized: true });
    },
    
    login: (userData) => {
        const state = { user: userData, isAuthenticated: true };
        localStorage.setItem('auth-storage', JSON.stringify(state));
        set(state);
    },
    // Verifica si el usuario tiene permiso basado en su rol
    // Los viewers tienen acceso limitado, solo los admins pueden hacer cambios
    hasPermission: (requiredRole) => {
        const state = get();
        if (!state.user) return false;
        if (requiredRole === 'viewer') return true; // Cualquiera puede ver
        return state.user.role === 'admin'; // Solo admins pueden modificar
    },
    logout: () => {
        localStorage.removeItem('auth-storage');
        set({ user: null, isAuthenticated: false });
    },
}));

import { Suspense, lazy, useEffect } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { Header } from '@/components/Header';
import { useNavigationStore } from './store/useNavigationStore';
import { useAuthStore } from './store/useAuthStore';

// Carga bajo demanda de cada pantalla para reducir el bundle inicial
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ComputadoresContent = lazy(() =>
    import('./pages/computers/ComputersPage').then((m) => ({ default: m.ComputadoresContent }))
);
const DesksPage = lazy(() => import('./pages/desks/DesksPage').then((m) => ({ default: m.DesksPage })));
const DeskAccessoriesPage = lazy(() =>
    import('./pages/desk-accessories/DeskAccessoriesPage').then((m) => ({ default: m.DeskAccessoriesPage }))
);
const ComponentsPage = lazy(() =>
    import('./pages/components/ComponentsPage').then((m) => ({ default: m.ComponentsPage }))
);
const PeripheralsPage = lazy(() =>
    import('./pages/peripherals/PeripheralsPage').then((m) => ({ default: m.PeripheralsPage }))
);
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const UsersPage = lazy(() => import('./pages/users/UsersPage').then((m) => ({ default: m.UsersPage })));
const EmployeesPage = lazy(() => import('./pages/employees/EmployeesPage').then((m) => ({ default: m.EmployeesPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/help/HelpPage').then((m) => ({ default: m.HelpPage })));
const BackupPage = lazy(() => import('./pages/backup/BackupPage').then((m) => ({ default: m.BackupPage })));
const ItemTracePage = lazy(() => import('./pages/item-trace/ItemTracePage').then((m) => ({ default: m.ItemTracePage })));
const AuthPage = lazy(() => import('./pages/auth/AuthPage').then((m) => ({ default: m.AuthPage })));

// Spinner de carga de la pagina
const LoadingView = ({ label = 'Cargando...', fullScreen = false }) => (
    <div
        className={`flex ${
            fullScreen ? 'min-h-screen' : 'min-h-[60vh]'
        } items-center justify-center gap-3 text-sm text-muted-foreground`}
    >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        {label}
    </div>
);

export const App = () => {
    const { currentView } = useNavigationStore();
    const { isAuthenticated, initialized, initialize } = useAuthStore();

    // Inicializar el store al montar el componente
    useEffect(() => {
        if (!initialized) {
            initialize();
        }
    }, [initialized, initialize]);

    // Mostrar loading mientras se inicializa
    if (!initialized) {
        return <LoadingView label="Cargando..." fullScreen />;
    }

    // Si no está autenticado, mostrar la página de autenticación
    if (!isAuthenticated) {
        return (
            <Suspense fallback={<LoadingView label="Cargando acceso..." fullScreen />}>
                <AuthPage />
            </Suspense>
        );
    }

    const page = {
        dashboard: DashboardPage,
        empleados: EmployeesPage,
        computadores: ComputadoresContent,
        escritorios: DesksPage,
        'accesorios-escritorio': DeskAccessoriesPage,
        componentes: ComponentsPage,
        perifericos: PeripheralsPage,
        usuarios: UsersPage,
        reportes: ReportsPage,
        configuracion: SettingsPage,
        respaldo: BackupPage,
        ayuda: HelpPage,
        trazabilidad: ItemTracePage,
    };
    const CurrentPage = page[currentView] ?? DashboardPage;

    return (
        <div className="flex h-screen">
            <SidebarNav />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-auto p-6">
                    <Suspense fallback={<LoadingView />}>
                        <CurrentPage />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

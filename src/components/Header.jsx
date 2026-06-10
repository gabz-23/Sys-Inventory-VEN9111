import { Button } from '@/components/ui/button';
import { User, LogOut, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAuthStore } from '@/store/useAuthStore';

const viewBreadcrumbs = {
    dashboard: [{ label: 'Panel de Control', view: 'dashboard' }],
    computadores: [
        { label: 'Inventario', view: null },
        { label: 'Computadores', view: 'computadores' },
    ],
    escritorios: [
        { label: 'Inventario', view: null },
        { label: 'Escritorios', view: 'escritorios' },
    ],
    accesorios: [
        { label: 'Inventario', view: null },
        { label: 'Gestión de Accesorios', view: 'accesorios' },
    ],
    categorias: [
        { label: 'Inventario', view: null },
        { label: 'Categorías', view: 'categorias' },
    ],
    reportes: [{ label: 'Reportes y Estadísticas', view: 'reportes' }],
    configuracion: [{ label: 'Configuración', view: 'configuracion' }],
    ayuda: [{ label: 'Ayuda', view: 'ayuda' }],
};

export function Header() {
    const { currentView, navigate, toggleSidebar, isCollapsed } = useNavigationStore();
    const breadcrumbs = viewBreadcrumbs[currentView] || [{ label: 'VEN 9-1-1', view: 'dashboard' }];

    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="cursor-pointer" size="icon" onClick={toggleSidebar}>
                    {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                </Button>

                <nav className="flex items-center gap-2">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            {crumb.view === null ? (
                                <span className="text-sm font-medium text-muted-foreground">{crumb.label}</span>
                            ) : index === breadcrumbs.length - 1 ? (
                                <span className="text-sm font-semibold text-foreground">{crumb.label}</span>
                            ) : (
                                <button
                                    onClick={() => navigate(crumb.view)}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer h-9 w-9">
                            <User className="shrink-0 size-6 text-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.firstName || 'Usuario'}</p>
                                <p className="text-xs text-muted-foreground">{user?.username || ''}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-destructive" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

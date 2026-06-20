import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    Package,
    Monitor,
    Armchair,
    FileText,
    ChevronDown,
    Settings,
    HelpCircle,
    Phone,
    Users,
    UserCircle,
    Cpu,
    Usb,
    Sofa,
    Database,
    History,
    Scissors,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
    {
        title: 'Dashboard',
        view: 'dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Empleados',
        view: 'empleados',
        icon: UserCircle,
    },
    {
        title: 'Inventario',
        icon: Package,
        items: [
            {
                title: 'Computadores',
                view: 'computadores',
                icon: Monitor,
            },
            {
                title: 'Escritorios',
                view: 'escritorios',
                icon: Armchair,
            },
            {
                title: 'Acc. Escritorio',
                view: 'accesorios-escritorio',
                icon: Sofa,
            },
            {
                title: 'Componentes',
                view: 'componentes',
                icon: Cpu,
            },
            {
                title: 'Periféricos',
                view: 'perifericos',
                icon: Usb,
            },
        ],
    },
    {
        title: 'Canibalización',
        view: 'canibalizacion',
        icon: Scissors,
    },
    {
        title: 'Trazabilidad',
        view: 'trazabilidad',
        icon: History,
    },
    {
        title: 'Reportes',
        view: 'reportes',
        icon: FileText,
        adminOnly: true,
    },
    {
        title: 'Usuarios',
        view: 'usuarios',
        icon: Users,
        adminOnly: true,
    },
];

const footerItems = [
    {
        title: 'Configuración',
        view: 'configuracion',
        icon: Settings,
    },
    {
        title: 'Respaldo Base de Datos',
        view: 'respaldo',
        icon: Database,
        adminOnly: true,
    },
    {
        title: 'Ayuda',
        view: 'ayuda',
        icon: HelpCircle,
    },
];

export function SidebarNav() {
    // Estado de la barra lateral
    const { currentView, navigate, isCollapsed } = useNavigationStore();
    const { user } = useAuthStore();
    // Verificar si el usuario tiene rol de viewer (solo lectura)
    const isViewer = user?.role === 'viewer';

    const [expandedItems, setExpandedItems] = useState(['Inventario']);

    const toggleExpanded = (title) => {
        // Toggle el estado de los items expandidos
        // Si el item está expandido, lo contraemos, si no, lo expandimos
        setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
    };

    return (
        <div
            className={cn(
                'flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-[266px]'
            )}
        >
            <div
                className={cn(
                    'flex flex-col items-start justify-start border-b px-4 pt-3 pb-2.5 transition-all duration-300',
                    isCollapsed && 'h-16 items-center justify-center'
                )}
            >
                {isCollapsed ? (
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-[#1f1f1f] leading-none">VEN</span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {['9', '1', '1'].map((num, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs font-bold leading-none"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, #F59E0B 0%, #F59E0B 33%, #003893 33%, #003893 66%, #CF142B 66%, #CF142B 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <div>
                                    <Phone className="text-[#1f1f1f] h-5 w-5 mr-0.5" />
                                </div>
                                <span className="text-xl font-bold text-[#1f1f1f] leading-none mr-1">VEN</span>

                                <div className="flex items-center">
                                    {['9', '1', '1'].map((num, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xl font-bold leading-none"
                                            style={{
                                                background:
                                                    'linear-gradient(to bottom, #F59E0B 0%, #F59E0B 33%, #003893 33%, #003893 66%, #CF142B 66%, #CF142B 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-1.5">
                                <p className="text-xs text-muted-foreground font-medium">Gestión de Activos</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-2">
                    {/* Filtrar elementos de navegación: ocultar los marcados como adminOnly si el usuario es viewer */}
                    {navItems.filter(item => !item.adminOnly || !isViewer).map((item, index) => (
                        <div key={index}>
                            {item.items ? (
                                <div>
                                    <button
                                        onClick={() => !isCollapsed && toggleExpanded(item.title)}
                                        className={cn(
                                            'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                            'text-sidebar-foreground hover:bg-accent/50 hover:text-sidebar-foreground',
                                            isCollapsed && 'justify-center px-2'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1 text-left">{item.title}</span>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 shrink-0 transition-transform duration-300',
                                                        expandedItems.includes(item.title) && 'rotate-180'
                                                    )}
                                                />
                                            </>
                                        )}
                                    </button>
                                    <div
                                        className={cn(
                                            'grid transition-all duration-300 ease-in-out',
                                            !isCollapsed && expandedItems.includes(item.title)
                                                ? 'grid-rows-[1fr] opacity-100 mt-1'
                                                : 'grid-rows-[0fr] opacity-0'
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="ml-2 space-y-1 border-l-2 border-border pl-4 py-1">
                                                {item.items.map((subItem, subIndex) => (
                                                    <button
                                                        key={subIndex}
                                                        onClick={() => navigate(subItem.view)}
                                                        className={cn(
                                                            'flex w-full cursor-pointer  items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                                            currentView === subItem.view
                                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                                        )}
                                                    >
                                                        <subItem.icon className="h-4 w-4 shrink-0" />
                                                        <span>{subItem.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate(item.view)}
                                    className={cn(
                                        'flex w-full items-center cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        currentView === item.view
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-sidebar-foreground hover:bg-accent/50 hover:text-sidebar-foreground',
                                        isCollapsed && 'justify-center px-2'
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span>{item.title}</span>}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer de la barra lateral */}
            <div className="border-t p-3">
                <div className="space-y-1">
                    {footerItems.filter(item => !item.adminOnly || !isViewer).map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.view)}
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
                                currentView === item.view
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-sidebar-foreground hover:bg-accent/50 hover:text-sidebar-foreground',
                                isCollapsed && 'justify-center px-2'
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

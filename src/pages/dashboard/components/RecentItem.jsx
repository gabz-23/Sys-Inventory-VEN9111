import { Armchair, Monitor, Mouse, Tag, Cpu, Usb, Plus, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const itemConfig = {
    computer: {
        bgIcon: 'bg-gradient-to-br from-orange-400 to-orange-500',
        icon: Monitor,
        label: 'Computador',
        textColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-200/50 dark:border-orange-800/30',
    },
    desk: {
        bgIcon: 'bg-gradient-to-br from-sky-400 to-sky-500',
        icon: Armchair,
        label: 'Escritorio',
        textColor: 'text-sky-600 dark:text-sky-400',
        borderColor: 'border-sky-200/50 dark:border-sky-800/30',
    },
    accessory: {
        bgIcon: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
        icon: Mouse,
        label: 'Accesorio',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
    category: {
        bgIcon: 'bg-gradient-to-br from-violet-400 to-violet-500',
        icon: Tag,
        label: 'Categoría',
        textColor: 'text-violet-600 dark:text-violet-400',
        borderColor: 'border-violet-200/50 dark:border-violet-800/30',
    },
    component: {
        bgIcon: 'bg-gradient-to-br from-purple-400 to-purple-500',
        icon: Cpu,
        label: 'Componente',
        textColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200/50 dark:border-purple-800/30',
    },
    peripheral: {
        bgIcon: 'bg-gradient-to-br from-teal-400 to-teal-500',
        icon: Usb,
        label: 'Periférico',
        textColor: 'text-teal-600 dark:text-teal-400',
        borderColor: 'border-teal-200/50 dark:border-teal-800/30',
    },
};

const actionConfig = {
    created: {
        label: 'Creado',
        icon: Plus,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800',
    },
    updated: {
        label: 'Actualizado',
        icon: Edit,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
    },
    deleted: {
        label: 'Eliminado',
        icon: Trash2,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
    },
    assigned: {
        label: 'Asignado',
        icon: ArrowRightLeft,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
    unassigned: {
        label: 'Desasignado',
        icon: ArrowRightLeft,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        borderColor: 'border-amber-200 dark:border-amber-800',
    },
};

export const RecentItem = ({ item }) => {
    if (!item) return null;

    const { type, title, code, date, action } = item;
    const config = itemConfig[type] || itemConfig.computer;
    const Icon = config.icon;
    const actionInfo = actionConfig[action] || actionConfig.created;
    const ActionIcon = actionInfo.icon;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div
            className={cn(
                'group flex items-center gap-3 rounded-lg border p-3 transition-all duration-200',
                'hover:shadow-md hover:border-border/80',
                'bg-card',
                config.borderColor
            )}
        >
            <div
                className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-110',
                    config.bgIcon
                )}
            >
                <Icon className="h-5 w-5 text-white" />
            </div>

            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-semibold uppercase tracking-wide', config.textColor)}>
                        {config.label}
                    </span>
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            actionInfo.bgColor,
                            actionInfo.color,
                            actionInfo.borderColor,
                            'border'
                        )}
                    >
                        <ActionIcon className="h-3 w-3" />
                        {actionInfo.label}
                    </span>
                </div>
                <p className="truncate text-sm font-semibold text-foreground">{title || 'Sin título'}</p>
                {code && <p className="truncate text-xs font-mono text-muted-foreground">{code}</p>}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
            </div>
        </div>
    );
};

import { useMemo } from 'react';
import { useReportStore } from '../store/useReportStore';

/**
 * Determina el estado de un item según su tipo.
 *
 * Para computadores: usa el estado original del item.
 * Para escritorios: 'Asignado' si tiene computador asociado, 'Disponible' en caso contrario.
 * Para accesorios: 'Asignado' si está asignado a un computador o escritorio, 'Disponible' en caso contrario.
 */
const getItemStatus = (item, type) => {
    if (type === 'computer') {
        // Para computadores, usar el estado original directamente
        return item.state || 'Bueno';
    }

    if (type === 'desk') {
        if (item.computer) {
            return 'Asignado';
        }
        return 'Disponible';
    }

    if (type === 'desk_accessory') {
        if (item.deskTableId) {
            return 'Asignado';
        }
        return 'Disponible';
    }

    if (type === 'component' || type === 'peripheral') {
        if (item.computerId) {
            return 'Asignado';
        }
        return 'Disponible';
    }

    return 'Disponible';
};

/**
 * Hook personalizado para procesar y filtrar datos de reportes.
 *
 * Este hook:
 * 1. Obtiene todos los datos del store (computadores, escritorios, accesorios, categorías)
 * 2. Calcula el rango de fechas según el filtro seleccionado
 * 3. Combina todos los items en un formato uniforme
 * 4. Aplica filtros de estado, fecha y categoría
 * 5. Ordena los items según el criterio seleccionado
 * 6. Calcula estadísticas agregadas
 
 */
export const useReportData = (filters) => {
    const { dateRange = [], itemType = [], status = [], assignment = 'all', category = [], sortBy = 'date' } = filters;
    const { getAllData } = useReportStore();
    const { computers, desks, deskAccessories, components, peripherals } = getAllData();

    /**
     * Calcula el rango de fechas según el filtro seleccionado.
     * Retorna un objeto con start y end, o null si es 'all'.
     */
    const dateRangeFilter = useMemo(() => {
        if (!Array.isArray(dateRange) || dateRange.length === 0) return null;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const ranges = dateRange
            .map((range) => {
                switch (range) {
                    case 'today':
                        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
                    case 'week': {
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());
                        return { start: weekStart, end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) };
                    }
                    case 'month':
                        return {
                            start: new Date(today.getFullYear(), today.getMonth(), 1),
                            end: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                        };
                    case 'quarter': {
                        const quarter = Math.floor(today.getMonth() / 3);
                        return {
                            start: new Date(today.getFullYear(), quarter * 3, 1),
                            end: new Date(today.getFullYear(), (quarter + 1) * 3, 1),
                        };
                    }
                    case 'year':
                        return {
                            start: new Date(today.getFullYear(), 0, 1),
                            end: new Date(today.getFullYear() + 1, 0, 1),
                        };
                    default:
                        return null;
                }
            })
            .filter(Boolean);

        return ranges.length ? ranges : null;
    }, [dateRange]);

    /**
     * Combina todos los items (computadores, escritorios, accesorios) en un formato uniforme.
     * Cada item tiene: id, code, type, description, status, category, date.
     */
    const allItems = useMemo(() => {
        const items = [];

        const typeFilter = Array.isArray(itemType) && itemType.length > 0 ? new Set(itemType) : null;

        // Lookup para saber si un computador tiene escritorio asignado
        const deskLookupByComputer = new Map();
        desks.forEach((desk) => {
            if (desk.computerId) {
                deskLookupByComputer.set(desk.computerId, true);
            }
        });

        // Agregar computadores
        if (!typeFilter || typeFilter.has('computer')) {
            computers.forEach((computer) => {
                const status = getItemStatus(computer, 'computer');
                items.push({
                    id: computer.id,
                    code: computer.code,
                    type: 'Computador',
                    description: `${computer.brand || ''} ${computer.model || ''}`.trim() || 'Computador',
                    status,
                    category: 'Computadores',
                    date: computer.createdAt,
                    isAssigned: deskLookupByComputer.has(computer.id),
                });
            });
        }

        // Agregar escritorios
        if (!typeFilter || typeFilter.has('desk')) {
            desks.forEach((desk) => {
                const status = getItemStatus(desk, 'desk');
                items.push({
                    id: desk.id,
                    code: desk.code,
                    type: 'Escritorio',
                    description: 'Escritorio',
                    status,
                    category: 'Mobiliario',
                    date: desk.createdAt,
                    isAssigned: Boolean(desk.computerId),
                });
            });
        }

        // Agregar accesorios de escritorio
        if (!typeFilter || typeFilter.has('desk_accessory')) {
            deskAccessories.forEach((acc) => {
                const status = getItemStatus(acc, 'desk_accessory');
                items.push({
                    id: acc.id,
                    code: acc.code,
                    type: 'Acc. Escritorio',
                    description: acc.description || 'Accesorio de escritorio',
                    status,
                    category: 'Acc. Escritorio',
                    date: acc.createdAt,
                    isAssigned: Boolean(acc.deskTableId),
                });
            });
        }

        // Agregar componentes
        if (!typeFilter || typeFilter.has('component')) {
            components.forEach((comp) => {
                const status = getItemStatus(comp, 'component');
                items.push({
                    id: comp.id,
                    code: comp.code,
                    type: 'Componente',
                    description: comp.description || 'Componente',
                    status,
                    category: 'Componentes',
                    date: comp.createdAt,
                    isAssigned: Boolean(comp.computerId),
                });
            });
        }

        // Agregar periféricos
        if (!typeFilter || typeFilter.has('peripheral')) {
            peripherals.forEach((per) => {
                const status = getItemStatus(per, 'peripheral');
                items.push({
                    id: per.id,
                    code: per.code,
                    type: 'Periférico',
                    description: per.description || 'Periférico',
                    status,
                    category: 'Periféricos',
                    date: per.createdAt,
                    isAssigned: Boolean(per.computerId),
                });
            });
        }

        return items;
    }, [computers, desks, deskAccessories, components, peripherals, itemType, category]);

    /**
     * Aplica los filtros de estado y fecha, y ordena los items.
     */
    const filteredItems = useMemo(() => {
        let filtered = [...allItems];

        // Filtrar por estado
        if (status && status.length > 0) {
            const statusFilter = new Set(status);
            filtered = filtered.filter((item) => statusFilter.has(item.status));
        }

        // Filtrar por asignación (usa el flag calculado isAssigned)
        if (assignment && assignment !== 'all') {
            filtered = filtered.filter((item) => {
                const isAssigned = Boolean(item.isAssigned);
                if (assignment === 'assigned') return isAssigned;
                if (assignment === 'not_assigned') return !isAssigned;
                return true;
            });
        }

        // Filtrar por rango de fechas
        if (dateRangeFilter) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.date);
                return dateRangeFilter.some((range) => itemDate >= range.start && itemDate < range.end);
            });
        }

        // Ordenar
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.description.localeCompare(b.description);
                case 'code':
                    return a.code.localeCompare(b.code);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'date':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        return filtered;
    }, [allItems, status, assignment, dateRangeFilter, sortBy]);

    /**
     * Calcula estadísticas agregadas de los items filtrados.
     * Cuenta totales por cada estado.
     
     */
    const stats = useMemo(() => {
        const total = filteredItems.length;
        const bueno = filteredItems.filter((item) => item.status === 'Bueno').length;
        const repuesto = filteredItems.filter((item) => item.status === 'Repuesto').length;
        const danado = filteredItems.filter((item) => item.status === 'Dañado').length;
        const enReparacion = filteredItems.filter((item) => item.status === 'En reparacion').length;
        const disponible = filteredItems.filter((item) => item.status === 'Disponible').length;
        const asignado = filteredItems.filter((item) => item.status === 'Asignado').length;

        return { total, bueno, repuesto, danado, enReparacion, disponible, asignado };
    }, [filteredItems]);

    return {
        filteredItems,
        stats,
        categories: [],
        dateRangeFilter,
    };
};

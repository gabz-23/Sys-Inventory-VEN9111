import { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ComputerFilters = ({ table, computers = [] }) => {
    // Verificar si hay computadores sin asignar
    const hasUnassigned = useMemo(() => {
        return computers.some(
            (comp) => !comp.deskTable || (!comp.deskTable?.code && !comp.deskTable?.dataValues?.code)
        );
    }, [computers]);

    // Verificar si hay computadores con asignación
    const hasAssigned = useMemo(() => {
        return computers.some(
            (comp) => comp.deskTable && (comp.deskTable?.code || comp.deskTable?.dataValues?.code)
        );
    }, [computers]);

    // Estados disponibles
    const states = ['Bueno', 'Repuesto', 'Dañado', 'En reparacion', 'Reparado', 'Reconstruido'];

    // Obtener filtros activos
    const deskFilter = table.getColumn('deskTable')?.getFilterValue();
    const stateFilter = table.getColumn('state')?.getFilterValue();

    const hasActiveFilters = deskFilter || stateFilter;
    const filterCount = [deskFilter, stateFilter]
        .filter(Boolean)
        .reduce((acc, filter) => acc + (Array.isArray(filter) ? filter.length : 0), 0);

    const clearFilters = () => {
        table.getColumn('deskTable')?.setFilterValue(undefined);
        table.getColumn('state')?.setFilterValue(undefined);
    };

    const handleDeskFilter = (deskCode, checked) => {
        const currentFilter = table.getColumn('deskTable')?.getFilterValue() || [];
        if (checked) {
            table.getColumn('deskTable')?.setFilterValue([...currentFilter, deskCode]);
        } else {
            table.getColumn('deskTable')?.setFilterValue(currentFilter.filter((d) => d !== deskCode));
        }
    };

    const handleStateFilter = (state, checked) => {
        const currentFilter = table.getColumn('state')?.getFilterValue() || [];
        if (checked) {
            table.getColumn('state')?.setFilterValue([...currentFilter, state]);
        } else {
            table.getColumn('state')?.setFilterValue(currentFilter.filter((s) => s !== state));
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-[220px] justify-between cursor-pointer',
                            hasActiveFilters && 'border-primary'
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Filtros</span>
                            {(hasActiveFilters && filterCount > 0) && (
                                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    {filterCount}
                                </span>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                    <div className="max-h-[200px] overflow-auto">
                        <div className="p-2">
                            {(hasUnassigned || hasAssigned) && (
                                <>
                                    <div className="text-sm font-medium mb-2 px-2">Filtrar por Escritorio</div>
                                    <div className="space-y-1 mb-3">
                                        {hasAssigned && (
                                            <div
                                                onClick={() =>
                                                    handleDeskFilter(
                                                        'Con asignación',
                                                        !(Array.isArray(deskFilter) && deskFilter.includes('Con asignación'))
                                                    )
                                                }
                                                className={cn(
                                                    'flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent',
                                                    Array.isArray(deskFilter) && deskFilter.includes('Con asignación') && 'bg-accent'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                        Array.isArray(deskFilter) && deskFilter.includes('Con asignación')
                                                            ? 'bg-primary border-primary text-primary-foreground'
                                                            : 'border-input'
                                                    )}
                                                >
                                                    {Array.isArray(deskFilter) && deskFilter.includes('Con asignación') && (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <span className="text-sm">Con asignación</span>
                                            </div>
                                        )}
                                        {hasUnassigned && (
                                            <div
                                                onClick={() =>
                                                    handleDeskFilter(
                                                        'Sin asignar',
                                                        !(Array.isArray(deskFilter) && deskFilter.includes('Sin asignar'))
                                                    )
                                                }
                                                className={cn(
                                                    'flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent',
                                                    Array.isArray(deskFilter) && deskFilter.includes('Sin asignar') && 'bg-accent'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                        Array.isArray(deskFilter) && deskFilter.includes('Sin asignar')
                                                            ? 'bg-primary border-primary text-primary-foreground'
                                                            : 'border-input'
                                                    )}
                                                >
                                                    {Array.isArray(deskFilter) && deskFilter.includes('Sin asignar') && (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <span className="text-sm">Sin asignar</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="text-sm font-medium mb-2 px-2">Filtrar por Estado</div>
                            <div className="space-y-1">
                                {states.map((state) => {
                                    const isChecked = Array.isArray(stateFilter) && stateFilter.includes(state);
                                    return (
                                        <div
                                            key={state}
                                            onClick={() => handleStateFilter(state, !isChecked)}
                                            className={cn(
                                                'flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent',
                                                isChecked && 'bg-accent'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                    isChecked
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-input'
                                                )}
                                            >
                                                {isChecked && <Check className="h-3 w-3" />}
                                            </div>
                                            <span className="text-sm">{state}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <>
                                <div className="border-t" />
                                <div
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="text-sm">Limpiar filtros</span>
                                </div>
                            </>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};


import { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DeskFilters = ({ table, desks = [] }) => {
    // Verificar si hay escritorios sin asignar
    const hasUnassigned = useMemo(() => {
        return desks.some((desk) => !desk.computer || desk.computer === null);
    }, [desks]);

    // Verificar si hay escritorios con asignación
    const hasAssigned = useMemo(() => {
        return desks.some((desk) => desk.computer && desk.computer !== null);
    }, [desks]);

    // Obtener filtros activos
    const computerFilter = table.getColumn('computer')?.getFilterValue();

    const hasActiveFilters = computerFilter && Array.isArray(computerFilter) && computerFilter.length > 0;
    const filterCount = Array.isArray(computerFilter) ? computerFilter.length : 0;

    const clearFilters = () => {
        table.getColumn('computer')?.setFilterValue(undefined);
    };

    const handleComputerFilter = (filterValue, checked) => {
        const currentFilter = table.getColumn('computer')?.getFilterValue() || [];
        if (checked) {
            table.getColumn('computer')?.setFilterValue([...currentFilter, filterValue]);
        } else {
            table.getColumn('computer')?.setFilterValue(currentFilter.filter((f) => f !== filterValue));
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
                            {hasActiveFilters && (
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
                                    <div className="text-sm font-medium mb-2 px-2">Filtrar por Computador</div>
                                    <div className="space-y-1">
                                        <div
                                            onClick={() =>
                                                handleComputerFilter(
                                                    'Asignado',
                                                    !(Array.isArray(computerFilter) && computerFilter.includes('Asignado'))
                                                )
                                            }
                                            className={cn(
                                                'flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent',
                                                Array.isArray(computerFilter) && computerFilter.includes('Asignado') && 'bg-accent'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                    Array.isArray(computerFilter) && computerFilter.includes('Asignado')
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-input'
                                                )}
                                            >
                                                {Array.isArray(computerFilter) && computerFilter.includes('Asignado') && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                            <span className="text-sm">Asignado</span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleComputerFilter(
                                                    'Sin asignar',
                                                    !(Array.isArray(computerFilter) && computerFilter.includes('Sin asignar'))
                                                )
                                            }
                                            className={cn(
                                                'flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent',
                                                Array.isArray(computerFilter) && computerFilter.includes('Sin asignar') && 'bg-accent'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                    Array.isArray(computerFilter) && computerFilter.includes('Sin asignar')
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-input'
                                                )}
                                            >
                                                {Array.isArray(computerFilter) && computerFilter.includes('Sin asignar') && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                            <span className="text-sm">Sin asignar</span>
                                        </div>
                                    </div>
                                </>
                            )}
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


import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Package, CheckCircle, Tag, ArrowUpDown, Filter, X } from 'lucide-react';

/**
 * Componente de filtros para los reportes.
 *
 * Permite filtrar por:
 * - Rango de fechas (hoy, semana, mes, trimestre, año, todo)
 * - Tipo de item (computadores, escritorios, accesorios, todos)
 * - Estado (Bueno, Repuesto, Dañado, Disponible, Asignado, todos)
 * - Categoría (solo para accesorios)
 * - Ordenamiento (fecha, nombre, código, estado)
 *
 * Incluye botón para limpiar todos los filtros cuando hay filtros activos.
 */
export const ReportFilters = ({ filters, onFilterChange, onClearFilters, categories }) => {
    const { dateRange = [], itemType = [], status = [], assignment = 'all', category = [], sortBy = 'date' } = filters;

    const hasActiveFilters = useMemo(() => {
        return (
            dateRange.length > 0 ||
            itemType.length > 0 ||
            status.length > 0 ||
            assignment !== 'all' ||
            category.length > 0 ||
            sortBy !== 'date'
        );
    }, [dateRange.length, itemType.length, status.length, assignment, category.length, sortBy]);

    const dateOptions = [
        { value: 'today', label: 'Hoy' },
        { value: 'week', label: 'Esta semana' },
        { value: 'month', label: 'Este mes' },
        { value: 'quarter', label: 'Este trimestre' },
        { value: 'year', label: 'Este año' },
    ];

    const typeOptions = [
        { value: 'computer', label: 'Computadores' },
        { value: 'desk', label: 'Escritorios' },
        { value: 'desk_accessory', label: 'Acc. Escritorio' },
        { value: 'component', label: 'Componentes' },
        { value: 'peripheral', label: 'Periféricos' },
    ];

    const statusOptions = [
        { value: 'Bueno', label: 'Bueno' },
        { value: 'Repuesto', label: 'Repuesto' },
        { value: 'Dañado', label: 'Dañado' },
        { value: 'En reparacion', label: 'En reparacion' },
        { value: 'Reparado', label: 'Reparado' },
        { value: 'Reconstruido', label: 'Reconstruido' },
        { value: 'Disponible', label: 'Disponible' },
        { value: 'Asignado', label: 'Asignado' },
    ];

    const assignmentOptions = [
        { value: 'assigned', label: 'Asignado' },
        { value: 'not_assigned', label: 'No asignado' },
    ];

    const categoryOptions = categories.map((cat) => ({ value: String(cat.id), label: cat.name }));

    const getLabel = (values, options, emptyLabel) => {
        if (!values || values.length === 0) return emptyLabel;
        const labels = options.filter((opt) => values.includes(opt.value)).map((opt) => opt.label);
        return labels.join(', ');
    };

    const toggleValue = (currentValues, value) => {
        if (value === 'all') return [];
        if (currentValues.includes(value)) {
            return currentValues.filter((v) => v !== value);
        }
        return [...currentValues, value];
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
                    </div>

                    {/* Botón para limpiar filtros */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-8 gap-1.5 text-xs cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" />
                            Limpiar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Rango de fechas
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 w-full justify-between cursor-pointer">
                                    <span className="truncate">
                                        {getLabel(dateRange, dateOptions, 'Todo el tiempo')}
                                    </span>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={dateRange.length === 0}
                                    onCheckedChange={() => onFilterChange('dateRange', [])}
                                    className="cursor-pointer"
                                >
                                    Todo el tiempo
                                </DropdownMenuCheckboxItem>
                                {dateOptions.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={dateRange.includes(option.value)}
                                        onCheckedChange={() =>
                                            onFilterChange('dateRange', toggleValue(dateRange, option.value))
                                        }
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5" />
                            Tipo de Item
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 w-full justify-between cursor-pointer">
                                    <span className="truncate">{getLabel(itemType, typeOptions, 'Todos')}</span>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={itemType.length === 0}
                                    onCheckedChange={() => onFilterChange('itemType', [])}
                                    className="cursor-pointer"
                                >
                                    Todos
                                </DropdownMenuCheckboxItem>
                                {typeOptions.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={itemType.includes(option.value)}
                                        onCheckedChange={() =>
                                            onFilterChange('itemType', toggleValue(itemType, option.value))
                                        }
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Estado
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 w-full justify-between cursor-pointer">
                                    <span className="truncate">{getLabel(status, statusOptions, 'Todos')}</span>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={status.length === 0}
                                    onCheckedChange={() => onFilterChange('status', [])}
                                    className="cursor-pointer"
                                >
                                    Todos
                                </DropdownMenuCheckboxItem>
                                {statusOptions.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={status.includes(option.value)}
                                        onCheckedChange={() =>
                                            onFilterChange('status', toggleValue(status, option.value))
                                        }
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5" />
                            Categoría
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 w-full justify-between cursor-pointer">
                                    <span className="truncate">{getLabel(category, categoryOptions, 'Todas')}</span>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    checked={category.length === 0}
                                    onCheckedChange={() => onFilterChange('category', [])}
                                    className="cursor-pointer"
                                >
                                    Todas
                                </DropdownMenuCheckboxItem>
                                {categoryOptions.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option.value}
                                        checked={category.includes(option.value)}
                                        onCheckedChange={() =>
                                            onFilterChange('category', toggleValue(category, option.value))
                                        }
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Asignación
                        </label>
                        <Select
                            value={assignment}
                            onValueChange={(value) => onFilterChange('assignment', value)}
                            className=" cursor-pointer"
                        >
                            <SelectTrigger className="h-9 w-full cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="cursor-pointer">
                                    Todos
                                </SelectItem>
                                {assignmentOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            Ordenar por
                        </label>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => onFilterChange('sortBy', value)}
                            className="w-full cursor-pointer"
                        >
                            <SelectTrigger className="h-9 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date" className="cursor-pointer">
                                    Fecha
                                </SelectItem>
                                <SelectItem value="name" className="cursor-pointer">
                                    Nombre
                                </SelectItem>
                                <SelectItem value="code" className="cursor-pointer">
                                    Código
                                </SelectItem>
                                <SelectItem value="status" className="cursor-pointer">
                                    Estado
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

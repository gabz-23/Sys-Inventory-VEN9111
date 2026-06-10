import { TruncatedCell } from '@/components/table/TruncatedCell';
import { ComputerActions } from './ComputerActions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { selectColumn } from '@/components/table/selectionColumn';

export const computerCols = [
    {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('code')} charLimit={15} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'serial',
        header: 'Serial',
        cell: ({ row }) => <TruncatedCell value={row.getValue('serial')} charLimit={15} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'computerType',
        header: 'Tipo de equipo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('computerType')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'brand',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (column.getIsSorted() === 'asc') {
                            column.toggleSorting(true); // Asc -> Desc
                        } else if (column.getIsSorted() === 'desc') {
                            column.clearSorting(); // Desc -> None
                        } else {
                            column.toggleSorting(false); // None -> Asc
                        }
                    }}
                    className="p-0 hover:bg-transparent cursor-pointer"
                >
                    Marca
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <TruncatedCell value={row.getValue('brand')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'model',
        header: 'Modelo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('model')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'deskTable',
        header: 'Escritorio',
        cell: ({ row }) => {
            const deskTable = row.getValue('deskTable')?.dataValues?.code || row.getValue('deskTable')?.code;

            return <TruncatedCell value={deskTable} minWidth="80px" maxWidth="100px" />;
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            const deskCode = row.getValue(id)?.dataValues?.code || row.getValue(id)?.code;

            // Separar filtros especiales de filtros específicos
            const hasUnassigned = filterValue.includes('Sin asignar');
            const hasAssigned = filterValue.includes('Con asignación');
            const otherFilters = filterValue.filter((f) => f !== 'Sin asignar' && f !== 'Con asignación');

            // Si solo hay filtros especiales
            if (otherFilters.length === 0) {
                if (hasUnassigned && hasAssigned) {
                    // Mostrar todos (con y sin asignación)
                    return true;
                }
                if (hasUnassigned) {
                    // Solo sin asignar
                    return !deskCode;
                }
                if (hasAssigned) {
                    // Solo con asignación
                    return !!deskCode;
                }
            }

            // Si hay otros filtros específicos además de los especiales
            if (otherFilters.length > 0) {
                const matchesSpecial = (hasUnassigned && !deskCode) || (hasAssigned && deskCode);
                const matchesSpecific = otherFilters.includes(deskCode);

                if (hasUnassigned || hasAssigned) {
                    // Si hay filtros especiales, mostrar si coincide con alguno
                    return matchesSpecial || matchesSpecific;
                }
                // Solo filtros específicos
                return matchesSpecific;
            }

            // Fallback: filtro por código específico
            return filterValue.includes(deskCode);
        },
    },
    {
        accessorKey: 'state',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (column.getIsSorted() === 'asc') {
                            column.toggleSorting(true); // Asc -> Desc
                        } else if (column.getIsSorted() === 'desc') {
                            column.clearSorting(); // Desc -> None
                        } else {
                            column.toggleSorting(false); // None -> Asc
                        }
                    }}
                    className="p-0 hover:bg-transparent cursor-pointer"
                >
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <TruncatedCell value={row.getValue('state')} minWidth="80px" maxWidth="100px" />,
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            return filterValue.includes(row.getValue(id));
        },
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const computer = row.original;
            return <ComputerActions computer={computer} />;
        },
    },
];

import { TruncatedCell } from '@/components/table/TruncatedCell';
import { ItemTraceActions } from './ItemTraceActions';
import { selectColumn } from '@/components/table/selectionColumn';
import { Badge } from '@/components/ui/badge';

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const itemTraceCols = [
    {
        accessorKey: 'itemType',
        header: 'Tipo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('itemType')} minWidth="80px" maxWidth="120px" />,
    },
    {
        accessorKey: 'itemCode',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('itemCode')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'dateDamaged',
        header: 'Dañado',
        cell: ({ row }) => <TruncatedCell value={formatDate(row.getValue('dateDamaged'))} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'dateInRepair',
        header: 'En reparacion',
        cell: ({ row }) => <TruncatedCell value={formatDate(row.getValue('dateInRepair'))} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'dateRepaired',
        header: 'Reparado',
        cell: ({ row }) => <TruncatedCell value={formatDate(row.getValue('dateRepaired'))} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'dateReinstated',
        header: 'Reincorporado',
        cell: ({ row }) => <TruncatedCell value={formatDate(row.getValue('dateReinstated'))} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'createdBy',
        header: 'Registrado por',
        cell: ({ row }) => <TruncatedCell value={row.getValue('createdBy') || '-'} minWidth="80px" maxWidth="120px" />,
    },
    {
        accessorKey: 'rebuilt',
        header: 'Reconstruido',
        cell: ({ row }) => {
            const rebuilt = row.getValue('rebuilt');
            return (
                <Badge variant={rebuilt ? 'default' : 'secondary'}>
                    {rebuilt ? 'Sí' : 'No'}
                </Badge>
            );
        },
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const itemTrace = row.original;
            return <ItemTraceActions itemTrace={itemTrace} />;
        },
    },
];

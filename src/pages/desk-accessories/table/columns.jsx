import { TruncatedCell } from '@/components/table/TruncatedCell';
import { Badge } from '@/components/ui/badge';
import { DeskAccessoryActions } from './DeskAccessoryActions';
import { selectColumn } from '@/components/table/selectionColumn';
import { statusStyles } from '@/constants/badgeColorStatus';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const deskAccessoryCols = [
    {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('code')} charLimit={15} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'serial',
        header: 'Serial',
        cell: ({ row }) => <TruncatedCell value={row.getValue('serial')} charLimit={15} minWidth="100px" maxWidth="130px" />,
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => <TruncatedCell value={row.getValue('description')} minWidth="120px" maxWidth="180px" />,
    },
    {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <TruncatedCell value={capitalize(row.getValue('type'))} minWidth="80px" maxWidth="120px" />,
    },
    {
        accessorKey: 'state',
        header: 'Estado',
        cell: ({ row }) => {
            const state = row.getValue('state');
            return (
                <Badge className={statusStyles[state] || 'bg-slate-100 text-slate-700'}>
                    {capitalize(state)}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'deskCode',
        header: 'Escritorio',
        cell: ({ row }) => <TruncatedCell value={row.getValue('deskCode') || 'Sin asignar'} minWidth="100px" maxWidth="130px" />,
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const deskAccessory = row.original;
            return <DeskAccessoryActions deskAccessory={deskAccessory} />;
        },
    },
];

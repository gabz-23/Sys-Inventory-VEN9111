import { TruncatedCell } from '@/components/table/TruncatedCell';
import { PeripheralActions } from './PeripheralActions';
import { selectColumn } from '@/components/table/selectionColumn';

export const peripheralCols = [
    {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <TruncatedCell value={row.getValue('code')} charLimit={12} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'serial',
        header: 'Serial',
        cell: ({ row }) => <TruncatedCell value={row.getValue('serial')} charLimit={15} minWidth="80px" maxWidth="100px" />,
    },
    {
        id: 'computerCode',
        header: 'Computador',
        cell: ({ row }) => {
            const computer = row.original.computer;
            return <TruncatedCell value={computer?.code || '-'} minWidth="80px" maxWidth="100px" />;
        },
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => <TruncatedCell value={row.getValue('description')} minWidth="100px" maxWidth="150px" />,
    },
    {
        accessorKey: 'brand',
        header: 'Marca',
        cell: ({ row }) => <TruncatedCell value={row.getValue('brand')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'model',
        header: 'Modelo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('model')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <TruncatedCell value={row.getValue('type')} minWidth="80px" maxWidth="100px" />,
    },
    {
        accessorKey: 'state',
        header: 'Estado',
    },
    selectColumn,
    {
        id: 'actions',
        cell: ({ row }) => {
            const peripheral = row.original;
            return <PeripheralActions peripheral={peripheral} />;
        },
    },
];
